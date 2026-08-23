export interface ShortMp4VideoInspection {
  readonly durationMs: number;
}

interface IsoBox {
  readonly type: string;
  readonly payloadStart: number;
  readonly end: number;
}

function invalidMp4(message: string): TypeError {
  return new TypeError(`Invalid MP4: ${message}`);
}

function readUint32(content: Uint8Array, offset: number): number {
  if (offset < 0 || offset + 4 > content.byteLength) {
    throw invalidMp4('truncated 32-bit integer.');
  }

  return (
    content[offset]! * 0x1000000 +
    content[offset + 1]! * 0x10000 +
    content[offset + 2]! * 0x100 +
    content[offset + 3]!
  );
}

function readUint64(content: Uint8Array, offset: number): bigint {
  const high = BigInt(readUint32(content, offset));
  const low = BigInt(readUint32(content, offset + 4));
  return (high << 32n) | low;
}

function readType(content: Uint8Array, offset: number): string {
  if (offset < 0 || offset + 4 > content.byteLength) {
    throw invalidMp4('truncated box type.');
  }

  return String.fromCharCode(
    content[offset]!,
    content[offset + 1]!,
    content[offset + 2]!,
    content[offset + 3]!,
  );
}

function readBox(content: Uint8Array, offset: number, limit: number): IsoBox {
  if (offset + 8 > limit) {
    throw invalidMp4('truncated box header.');
  }

  const size32 = readUint32(content, offset);
  const type = readType(content, offset + 4);

  let headerBytes = 8;
  let boxBytes: bigint;

  if (size32 === 1) {
    if (offset + 16 > limit) {
      throw invalidMp4('truncated extended-size box header.');
    }
    headerBytes = 16;
    boxBytes = readUint64(content, offset + 8);
  } else if (size32 === 0) {
    boxBytes = BigInt(limit - offset);
  } else {
    boxBytes = BigInt(size32);
  }

  if (boxBytes < BigInt(headerBytes)) {
    throw invalidMp4(`box ${type} has an impossible size.`);
  }

  const endBig = BigInt(offset) + boxBytes;
  if (endBig > BigInt(limit) || endBig > BigInt(Number.MAX_SAFE_INTEGER)) {
    throw invalidMp4(`box ${type} extends beyond the file boundary.`);
  }

  const end = Number(endBig);
  if (end <= offset) {
    throw invalidMp4(`box ${type} does not advance the parser.`);
  }

  return {
    type,
    payloadStart: offset + headerBytes,
    end,
  };
}

function listBoxes(content: Uint8Array, start: number, end: number): IsoBox[] {
  const boxes: IsoBox[] = [];
  let offset = start;

  while (offset < end) {
    const box = readBox(content, offset, end);
    boxes.push(box);
    offset = box.end;
  }

  return boxes;
}

function containsAvcSampleEntry(content: Uint8Array, start: number, end: number): boolean {
  const avc1 = [0x61, 0x76, 0x63, 0x31];
  const avc3 = [0x61, 0x76, 0x63, 0x33];

  for (let offset = start; offset + 4 <= end; offset += 1) {
    const matches = (marker: readonly number[]) =>
      marker.every((byte, index) => content[offset + index] === byte);

    if (matches(avc1) || matches(avc3)) {
      return true;
    }
  }

  return false;
}

function readMovieDurationMs(content: Uint8Array, moov: IsoBox): number {
  const mvhd = listBoxes(content, moov.payloadStart, moov.end).find((box) => box.type === 'mvhd');

  if (!mvhd) {
    throw invalidMp4('moov does not contain mvhd duration metadata.');
  }

  const payloadBytes = mvhd.end - mvhd.payloadStart;
  const version = content[mvhd.payloadStart];

  let timescale: number;
  let duration: bigint;

  if (version === 0) {
    if (payloadBytes < 20) {
      throw invalidMp4('version 0 mvhd is truncated.');
    }
    timescale = readUint32(content, mvhd.payloadStart + 12);
    duration = BigInt(readUint32(content, mvhd.payloadStart + 16));
  } else if (version === 1) {
    if (payloadBytes < 32) {
      throw invalidMp4('version 1 mvhd is truncated.');
    }
    timescale = readUint32(content, mvhd.payloadStart + 20);
    duration = readUint64(content, mvhd.payloadStart + 24);
  } else {
    throw invalidMp4(`unsupported mvhd version ${String(version)}.`);
  }

  if (timescale <= 0 || duration <= 0n) {
    throw invalidMp4('mvhd duration and timescale must be positive.');
  }

  const scale = BigInt(timescale);
  const durationMs = (duration * 1000n + scale / 2n) / scale;

  if (durationMs <= 0n || durationMs > BigInt(Number.MAX_SAFE_INTEGER)) {
    throw invalidMp4('derived duration is outside the supported numeric range.');
  }

  return Number(durationMs);
}

export function inspectShortMp4Video(content: Uint8Array): ShortMp4VideoInspection {
  if (content.byteLength < 16) {
    throw invalidMp4('file is too small.');
  }

  const topLevel = listBoxes(content, 0, content.byteLength);

  if (topLevel[0]?.type !== 'ftyp') {
    throw invalidMp4('the first top-level box must be ftyp.');
  }

  const moov = topLevel.find((box) => box.type === 'moov');
  if (!moov) {
    throw invalidMp4('moov box is required.');
  }

  if (!containsAvcSampleEntry(content, moov.payloadStart, moov.end)) {
    throw invalidMp4('H.264/AVC sample entry avc1 or avc3 is required.');
  }

  return {
    durationMs: readMovieDurationMs(content, moov),
  };
}
