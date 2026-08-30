import { ImageResponse } from 'next/og';

export const alt = 'Devotional · AI World';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default function DevotionalOpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        position: 'relative',
        display: 'flex',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #fffaf0 0%, #f5e7ce 52%, #e7f0e9 100%)',
        color: '#2d241b',
        fontFamily: 'sans-serif',
      }}
    >
      <div
        style={{
          position: 'absolute',
          display: 'flex',
          width: 500,
          height: 500,
          borderRadius: 999,
          right: -20,
          top: -80,
          border: '4px solid rgba(173, 111, 48, 0.24)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          display: 'flex',
          width: 330,
          height: 330,
          borderRadius: 999,
          right: 65,
          top: 5,
          border: '2px solid rgba(47, 111, 99, 0.2)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          display: 'flex',
          width: 170,
          height: 170,
          borderRadius: 999,
          right: 145,
          top: 85,
          background: 'rgba(196, 122, 44, 0.2)',
        }}
      />

      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          width: 820,
          padding: '72px 76px',
        }}
      >
        <div
          style={{
            display: 'flex',
            color: '#8b531f',
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
            fontSize: 104,
            fontWeight: 820,
            letterSpacing: -6,
            lineHeight: 0.92,
          }}
        >
          Devotional
        </div>
        <div
          style={{
            display: 'flex',
            maxWidth: 700,
            marginTop: 28,
            color: '#665b50',
            fontSize: 28,
            lineHeight: 1.4,
          }}
        >
          Explore published devotional Knowledge through the shared AI World experience.
        </div>
      </div>
    </div>,
    size,
  );
}
