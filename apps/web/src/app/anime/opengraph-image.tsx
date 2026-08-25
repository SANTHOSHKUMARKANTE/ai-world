import { ImageResponse } from 'next/og';

export const alt = 'Anime · AI World';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default function AnimeOpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        position: 'relative',
        display: 'flex',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        background: '#020611',
        color: '#ffffff',
        fontFamily: 'sans-serif',
      }}
    >
      <div
        style={{
          position: 'absolute',
          width: 520,
          height: 520,
          borderRadius: 999,
          right: -40,
          top: -70,
          background: '#173b7a',
          opacity: 0.82,
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 300,
          height: 300,
          borderRadius: 999,
          right: 300,
          bottom: -80,
          background: '#8b461e',
          opacity: 0.58,
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 760,
          height: 6,
          right: -80,
          top: 270,
          background: '#6f91df',
          transform: 'rotate(-18deg)',
          opacity: 0.72,
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 680,
          height: 5,
          right: -40,
          top: 390,
          background: '#ff9b42',
          transform: 'rotate(-10deg)',
          opacity: 0.72,
        }}
      />

      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          width: 790,
          padding: '72px 76px',
        }}
      >
        <div
          style={{
            display: 'flex',
            color: '#ff9b42',
            fontSize: 25,
            fontWeight: 800,
            letterSpacing: 5,
            textTransform: 'uppercase',
          }}
        >
          AI World Universe
        </div>
        <div
          style={{
            display: 'flex',
            marginTop: 18,
            fontSize: 112,
            fontWeight: 850,
            letterSpacing: -7,
            lineHeight: 0.9,
          }}
        >
          Anime
        </div>
        <div
          style={{
            display: 'flex',
            maxWidth: 650,
            marginTop: 28,
            color: '#c7d2e8',
            fontSize: 29,
            lineHeight: 1.35,
          }}
        >
          Characters, stories, and worlds in motion.
        </div>
      </div>
    </div>,
    size,
  );
}
