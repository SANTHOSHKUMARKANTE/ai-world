import { ImageResponse } from 'next/og';

export const alt = 'Knowledge · AI World';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default function KnowledgeOpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        position: 'relative',
        display: 'flex',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #edf6f1 0%, #f7f2e7 48%, #ececff 100%)',
        color: '#17201b',
        fontFamily: 'sans-serif',
      }}
    >
      <div
        style={{
          position: 'absolute',
          display: 'flex',
          width: 520,
          height: 520,
          borderRadius: 999,
          right: -50,
          top: -130,
          background: 'rgba(21, 94, 85, 0.12)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          display: 'flex',
          width: 360,
          height: 360,
          borderRadius: 999,
          right: 80,
          bottom: -120,
          border: '4px solid rgba(109, 91, 208, 0.16)',
        }}
      />
      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          width: 900,
          padding: '72px 76px',
        }}
      >
        <div
          style={{
            display: 'flex',
            color: '#155e55',
            fontSize: 25,
            fontWeight: 800,
            letterSpacing: 5,
            textTransform: 'uppercase',
          }}
        >
          AI World Discovery
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
          Knowledge
        </div>
        <div
          style={{
            display: 'flex',
            maxWidth: 760,
            marginTop: 28,
            color: '#526058',
            fontSize: 28,
            lineHeight: 1.4,
          }}
        >
          Explore published Knowledge across Devotional and Anime with real identity and canonical
          destinations.
        </div>
      </div>
    </div>,
    size,
  );
}
