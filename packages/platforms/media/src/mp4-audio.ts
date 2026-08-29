export interface Mp4AudioInspection {
  readonly durationMs: number;
}

interface IsoBox {
  readonly type: string;
  readonly payloadStart: number;
  readonly end: number;
}

interface IsoDescriptor {
  readonly tag: number;
  readonly payloadStart: number;
  readonly end: number;
}

function invalidAudioMp4(message: string): TypeError {
  return new TypeError(`Invalid audio MP4: ${message}`);
}

function readUint16(content: Uint8Array, offset: number): number {
  if (offset < 0 || offset + 2 > content.byteLength) {
    throw invalidAudioMp4('truncated 16-bit integer.');
  }

  return content[offset]! * 0x100 + content[offset + 1]!;
}

function readUint32(content: Uint8Array, offset: number): number {
  if (offset < 0 || offset + 4 > content.byteLength) {
    throw invalidAudioMp4('truncated 32-bit integer.');
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
    throw invalidAudioMp4('truncated box type.');
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
    throw invalidAudioMp4('truncated box header.');
  }

  const size32 = readUint32(content, offset);
  const type = readType(content, offset + 4);

  let headerBytes = 8;
  let boxBytes: bigint;

  if (size32 === 1) {
    if (offset + 16 > limit) {
      throw invalidAudioMp4('truncated extended-size box header.');
    }
    headerBytes = 16;
    boxBytes = readUint64(content, offset + 8);
  } else if (size32 === 0) {
    boxBytes = BigInt(limit - offset);
  } else {
    boxBytes = BigInt(size32);
  }

  if (boxBytes < BigInt(headerBytes)) {
    throw invalidAudioMp4(`box ${type} has an impossible size.`);
  }

  const endBig = BigInt(offset) + boxBytes;
  if (endBig > BigInt(limit) || endBig > BigInt(Number.MAX_SAFE_INTEGER)) {
    throw invalidAudioMp4(`box ${type} extends beyond its container boundary.`);
  }

  const end = Number(endBig);
  if (end <= offset) {
    throw invalidAudioMp4(`box ${type} does not advance the parser.`);
  }

  return {
    type,
    payloadStart: offset + headerBytes,
    end,
  };
}

function* iterateBoxes(
  content: Uint8Array,
  start: number,
  end: number,
): Generator<IsoBox, void, undefined> {
  let offset = start;

  while (offset < end) {
    const box = readBox(content, offset, end);
    yield box;
    offset = box.end;
  }
}

function findBox(
  content: Uint8Array,
  start: number,
  end: number,
  type: string,
): IsoBox | undefined {
  for (const box of iterateBoxes(content, start, end)) {
    if (box.type === type) {
      return box;
    }
  }

  return undefined;
}

function requiredChild(content: Uint8Array, parent: IsoBox, type: string): IsoBox {
  const child = findBox(content, parent.payloadStart, parent.end, type);

  if (!child) {
    throw invalidAudioMp4(`${parent.type} does not contain required ${type} metadata.`);
  }

  return child;
}

function readHandlerType(content: Uint8Array, hdlr: IsoBox): string {
  if (hdlr.end - hdlr.payloadStart < 12) {
    throw invalidAudioMp4('hdlr metadata is truncated.');
  }

  return readType(content, hdlr.payloadStart + 8);
}

function readMediaDurationMs(content: Uint8Array, mdhd: IsoBox): number {
  const payloadBytes = mdhd.end - mdhd.payloadStart;
  const version = content[mdhd.payloadStart];

  let timescale: number;
  let duration: bigint;

  if (version === 0) {
    if (payloadBytes < 20) {
      throw invalidAudioMp4('version 0 mdhd is truncated.');
    }

    timescale = readUint32(content, mdhd.payloadStart + 12);
    duration = BigInt(readUint32(content, mdhd.payloadStart + 16));
  } else if (version === 1) {
    if (payloadBytes < 32) {
      throw invalidAudioMp4('version 1 mdhd is truncated.');
    }

    timescale = readUint32(content, mdhd.payloadStart + 20);
    duration = readUint64(content, mdhd.payloadStart + 24);
  } else {
    throw invalidAudioMp4(`unsupported mdhd version ${String(version)}.`);
  }

  if (timescale <= 0 || duration <= 0n) {
    throw invalidAudioMp4('audio duration and timescale must be positive.');
  }

  const scale = BigInt(timescale);
  const durationMs = (duration * 1000n + scale / 2n) / scale;

  if (durationMs <= 0n || durationMs > BigInt(Number.MAX_SAFE_INTEGER)) {
    throw invalidAudioMp4('derived audio duration is outside the supported numeric range.');
  }

  return Number(durationMs);
}

function readDescriptor(content: Uint8Array, offset: number, limit: number): IsoDescriptor {
  if (offset >= limit) {
    throw invalidAudioMp4('truncated MPEG-4 descriptor tag.');
  }

  const tag = content[offset]!;
  let cursor = offset + 1;
  let payloadBytes = 0;
  let completed = false;

  for (let count = 0; count < 4; count += 1) {
    if (cursor >= limit) {
      throw invalidAudioMp4('truncated MPEG-4 descriptor size.');
    }

    const current = content[cursor]!;
    cursor += 1;
    payloadBytes = payloadBytes * 128 + (current & 0x7f);

    if ((current & 0x80) === 0) {
      completed = true;
      break;
    }
  }

  if (!completed) {
    throw invalidAudioMp4('MPEG-4 descriptor size exceeds the supported encoding.');
  }

  const end = cursor + payloadBytes;
  if (end > limit || end < cursor) {
    throw invalidAudioMp4('MPEG-4 descriptor extends beyond its container.');
  }

  return {
    tag,
    payloadStart: cursor,
    end,
  };
}

function* iterateDescriptors(
  content: Uint8Array,
  start: number,
  end: number,
): Generator<IsoDescriptor, void, undefined> {
  let offset = start;

  while (offset < end) {
    const descriptor = readDescriptor(content, offset, end);
    yield descriptor;
    offset = descriptor.end;
  }
}

function requiredDescriptor(
  content: Uint8Array,
  start: number,
  end: number,
  tag: number,
  label: string,
): IsoDescriptor {
  for (const descriptor of iterateDescriptors(content, start, end)) {
    if (descriptor.tag === tag) {
      return descriptor;
    }
  }

  throw invalidAudioMp4(`${label} descriptor is required.`);
}

function esDescriptorChildrenStart(content: Uint8Array, descriptor: IsoDescriptor): number {
  if (descriptor.end - descriptor.payloadStart < 3) {
    throw invalidAudioMp4('ES descriptor is truncated.');
  }

  const flags = content[descriptor.payloadStart + 2]!;
  let cursor = descriptor.payloadStart + 3;

  if ((flags & 0x80) !== 0) {
    cursor += 2;
  }

  if ((flags & 0x40) !== 0) {
    if (cursor >= descriptor.end) {
      throw invalidAudioMp4('ES descriptor URL length is truncated.');
    }

    const urlBytes = content[cursor]!;
    cursor += 1 + urlBytes;
  }

  if ((flags & 0x20) !== 0) {
    cursor += 2;
  }

  if (cursor > descriptor.end) {
    throw invalidAudioMp4('ES descriptor optional fields are truncated.');
  }

  return cursor;
}

class AudioSpecificConfigBitReader {
  private bitOffset = 0;

  public constructor(
    private readonly content: Uint8Array,
    private readonly start: number,
    private readonly end: number,
  ) {
    if (start < 0 || end < start || end > content.byteLength) {
      throw invalidAudioMp4('AudioSpecificConfig bounds are invalid.');
    }
  }

  public get remainingBits(): number {
    return (this.end - this.start) * 8 - this.bitOffset;
  }

  public readBits(count: number, label: string): number {
    if (!Number.isInteger(count) || count <= 0 || count > 24) {
      throw invalidAudioMp4(`unsupported AudioSpecificConfig bit read for ${label}.`);
    }

    if (this.remainingBits < count) {
      throw invalidAudioMp4(`AudioSpecificConfig is truncated while reading ${label}.`);
    }

    let value = 0;

    for (let index = 0; index < count; index += 1) {
      const absoluteBit = this.bitOffset + index;
      const byte = this.content[this.start + Math.floor(absoluteBit / 8)]!;
      const bit = (byte >> (7 - (absoluteBit % 8))) & 1;
      value = value * 2 + bit;
    }

    this.bitOffset += count;
    return value;
  }

  public consumeZeroPadding(): void {
    while (this.remainingBits > 0) {
      if (this.readBits(1, 'zero padding') !== 0) {
        throw invalidAudioMp4('unsupported non-zero AudioSpecificConfig trailing bits.');
      }
    }
  }
}

function readAudioObjectType(reader: AudioSpecificConfigBitReader): number {
  const audioObjectType = reader.readBits(5, 'audioObjectType');

  if (audioObjectType !== 31) {
    return audioObjectType;
  }

  return 32 + reader.readBits(6, 'extended audioObjectType');
}

function assertAacLcAudioSpecificConfig(content: Uint8Array, decoderSpecific: IsoDescriptor): void {
  const reader = new AudioSpecificConfigBitReader(
    content,
    decoderSpecific.payloadStart,
    decoderSpecific.end,
  );
  const audioObjectType = readAudioObjectType(reader);

  if (audioObjectType !== 2) {
    throw invalidAudioMp4(
      `AAC-LC Audio Object Type 2 is required; found ${String(audioObjectType)}.`,
    );
  }

  const samplingFrequencyIndex = reader.readBits(4, 'samplingFrequencyIndex');

  if (samplingFrequencyIndex === 0x0f) {
    const explicitSamplingFrequency = reader.readBits(24, 'explicit sampling frequency');
    if (explicitSamplingFrequency <= 0) {
      throw invalidAudioMp4('AAC-LC explicit sampling frequency must be positive.');
    }
  } else if (samplingFrequencyIndex > 12) {
    throw invalidAudioMp4(
      `AAC-LC samplingFrequencyIndex ${String(samplingFrequencyIndex)} is reserved.`,
    );
  }

  const channelConfiguration = reader.readBits(4, 'channelConfiguration');
  if (channelConfiguration < 1 || channelConfiguration > 7) {
    throw invalidAudioMp4('Initial AAC-LC profile requires channelConfiguration between 1 and 7.');
  }

  reader.readBits(1, 'frameLengthFlag');

  if (reader.readBits(1, 'dependsOnCoreCoder') === 1) {
    reader.readBits(14, 'coreCoderDelay');
  }

  const extensionFlag = reader.readBits(1, 'extensionFlag');

  if (extensionFlag === 1) {
    const extensionFlag3 = reader.readBits(1, 'extensionFlag3');
    if (extensionFlag3 !== 0) {
      throw invalidAudioMp4('AAC-LC extensionFlag3 must be zero.');
    }
  }

  if (reader.remainingBits === 0) {
    return;
  }

  if (reader.remainingBits < 11) {
    reader.consumeZeroPadding();
    return;
  }

  const syncExtensionType = reader.readBits(11, 'syncExtensionType');

  if (syncExtensionType === 0) {
    reader.consumeZeroPadding();
    return;
  }

  if (syncExtensionType !== 0x2b7) {
    throw invalidAudioMp4(
      `unsupported AudioSpecificConfig sync extension 0x${syncExtensionType.toString(16)}.`,
    );
  }

  const extensionAudioObjectType = readAudioObjectType(reader);
  if (extensionAudioObjectType !== 5) {
    throw invalidAudioMp4(
      `unsupported AudioSpecificConfig extension Audio Object Type ${String(extensionAudioObjectType)}.`,
    );
  }

  if (reader.readBits(1, 'sbrPresentFlag') !== 0) {
    throw invalidAudioMp4('SBR/HE-AAC is outside the initial AAC-LC profile.');
  }

  reader.consumeZeroPadding();
}

function assertAacLcCodecConfiguration(content: Uint8Array, esds: IsoBox): void {
  if (esds.end - esds.payloadStart < 5) {
    throw invalidAudioMp4('esds metadata is truncated.');
  }

  const esDescriptor = requiredDescriptor(content, esds.payloadStart + 4, esds.end, 0x03, 'ES');
  const decoderConfig = requiredDescriptor(
    content,
    esDescriptorChildrenStart(content, esDescriptor),
    esDescriptor.end,
    0x04,
    'DecoderConfig',
  );

  if (decoderConfig.end - decoderConfig.payloadStart < 13) {
    throw invalidAudioMp4('DecoderConfig descriptor is truncated.');
  }

  if (content[decoderConfig.payloadStart] !== 0x40) {
    throw invalidAudioMp4('MPEG-4 Audio DecoderConfig object type 0x40 is required.');
  }

  const streamType = content[decoderConfig.payloadStart + 1]! >> 2;
  if (streamType !== 0x05) {
    throw invalidAudioMp4('MPEG-4 DecoderConfig must identify an audio stream.');
  }

  const decoderSpecific = requiredDescriptor(
    content,
    decoderConfig.payloadStart + 13,
    decoderConfig.end,
    0x05,
    'DecoderSpecificInfo',
  );

  if (decoderSpecific.payloadStart >= decoderSpecific.end) {
    throw invalidAudioMp4('AudioSpecificConfig is empty.');
  }

  assertAacLcAudioSpecificConfig(content, decoderSpecific);
}

function audioSampleEntryChildrenStart(content: Uint8Array, entry: IsoBox): number {
  if (entry.end - entry.payloadStart < 28) {
    throw invalidAudioMp4('mp4a sample entry is truncated.');
  }

  const version = readUint16(content, entry.payloadStart + 8);
  const extraBytes = version === 0 ? 0 : version === 1 ? 16 : version === 2 ? 36 : null;

  if (extraBytes === null) {
    throw invalidAudioMp4(`unsupported mp4a sample-entry version ${String(version)}.`);
  }

  const childrenStart = entry.payloadStart + 28 + extraBytes;
  if (childrenStart > entry.end) {
    throw invalidAudioMp4('mp4a versioned fields are truncated.');
  }

  return childrenStart;
}

function assertAacLcSampleDescription(content: Uint8Array, stsd: IsoBox): void {
  if (stsd.end - stsd.payloadStart < 8) {
    throw invalidAudioMp4('stsd metadata is truncated.');
  }

  const entryCount = readUint32(content, stsd.payloadStart + 4);
  let offset = stsd.payloadStart + 8;
  let accepted = false;

  for (let index = 0; index < entryCount; index += 1) {
    const entry = readBox(content, offset, stsd.end);
    offset = entry.end;

    if (entry.type !== 'mp4a') {
      continue;
    }

    const esds = findBox(content, audioSampleEntryChildrenStart(content, entry), entry.end, 'esds');

    if (!esds) {
      throw invalidAudioMp4('mp4a sample entry does not contain esds codec metadata.');
    }

    assertAacLcCodecConfiguration(content, esds);
    accepted = true;
  }

  if (!accepted) {
    throw invalidAudioMp4('audio track requires an AAC-LC mp4a sample entry.');
  }
}

function inspectAudioTrack(content: Uint8Array, mdia: IsoBox): number {
  const mdhd = requiredChild(content, mdia, 'mdhd');
  const minf = requiredChild(content, mdia, 'minf');
  const stbl = requiredChild(content, minf, 'stbl');
  const stsd = requiredChild(content, stbl, 'stsd');

  assertAacLcSampleDescription(content, stsd);
  return readMediaDurationMs(content, mdhd);
}

export function inspectMp4Audio(content: Uint8Array): Mp4AudioInspection {
  if (content.byteLength < 16) {
    throw invalidAudioMp4('file is too small.');
  }

  const firstTopLevel = readBox(content, 0, content.byteLength);
  if (firstTopLevel.type !== 'ftyp') {
    throw invalidAudioMp4('the first top-level box must be ftyp.');
  }

  let moov: IsoBox | undefined;
  let hasNonEmptyMdat = false;

  for (const box of iterateBoxes(content, 0, content.byteLength)) {
    if (box.type === 'moov' && moov === undefined) {
      moov = box;
    }

    if (box.type === 'mdat' && box.payloadStart < box.end) {
      hasNonEmptyMdat = true;
    }
  }

  if (!moov) {
    throw invalidAudioMp4('moov box is required.');
  }

  if (!hasNonEmptyMdat) {
    throw invalidAudioMp4('non-empty mdat media data is required.');
  }

  let durationMs: number | undefined;

  for (const trak of iterateBoxes(content, moov.payloadStart, moov.end)) {
    if (trak.type !== 'trak') {
      continue;
    }

    const mdia = requiredChild(content, trak, 'mdia');
    const handlerType = readHandlerType(content, requiredChild(content, mdia, 'hdlr'));

    if (handlerType === 'vide') {
      throw invalidAudioMp4('VIDEO tracks are not permitted in the initial AUDIO profile.');
    }

    if (handlerType !== 'soun') {
      continue;
    }

    const currentDurationMs = inspectAudioTrack(content, mdia);
    durationMs ??= currentDurationMs;
  }

  if (durationMs === undefined) {
    throw invalidAudioMp4('an AAC-LC audio track is required.');
  }

  return { durationMs };
}
