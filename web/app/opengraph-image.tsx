import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'FreqTherapy — Frequency Wellness & Guided Breathing'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0a0a0f 0%, #0f1729 50%, #0a0a0f 100%)',
          fontFamily: 'Georgia, serif',
        }}
      >
        {/* Subtle glow */}
        <div
          style={{
            position: 'absolute',
            top: '30%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(6,182,212,0.15) 0%, transparent 70%)',
          }}
        />

        {/* Logo icon */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 64,
            height: 64,
            borderRadius: 16,
            background: 'linear-gradient(135deg, #06b6d4, #0d9488)',
            marginBottom: 32,
          }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
          </svg>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 56,
            fontWeight: 300,
            color: 'rgba(255,255,255,0.9)',
            letterSpacing: '-0.02em',
            marginBottom: 16,
          }}
        >
          FreqTherapy
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 22,
            color: 'rgba(255,255,255,0.35)',
            maxWidth: 600,
            textAlign: 'center',
            lineHeight: 1.5,
          }}
        >
          Frequency wellness with immersive experiences & guided breathing
        </div>

        {/* Stats bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 32,
            marginTop: 48,
            fontSize: 14,
            color: 'rgba(255,255,255,0.2)',
          }}
        >
          <span>23 frequencies</span>
          <span>·</span>
          <span>6 breathing patterns</span>
          <span>·</span>
          <span>Research-informed</span>
        </div>
      </div>
    ),
    { ...size }
  )
}
