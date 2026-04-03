import '../styles/globals.css'
import type { Metadata } from 'next'
import { Inter, Playfair_Display, Instrument_Serif } from 'next/font/google'
import Script from 'next/script'
import { Toaster } from 'react-hot-toast'
import { generateMedicalMetadata } from '@/lib/medicalMetadata'
import { organizationSchema, webApplicationSchema, faqSchema } from '@/lib/seo'
import { ClientAccessibilityControls } from '@/components/ui/ClientAccessibilityControls'
import { ClientEmergencyHandler } from '@/components/ui/ClientEmergencyHandler'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { reportWebVitals } from '@/lib/performance-monitoring'
import MiniPlayer from '@/components/ui/MiniPlayer'

// Optimized font loading
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
})

const playfairDisplay = Playfair_Display({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair'
})

const instrumentSerif = Instrument_Serif({ 
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
  variable: '--font-instrument'
})

// Medical-grade metadata
export const metadata: Metadata = generateMedicalMetadata()

// Enable Web Vitals reporting for production performance monitoring
export function useReportWebVitals(metric: any) {
  reportWebVitals(metric)
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const orgSchema = organizationSchema()
  const appSchema = webApplicationSchema()
  const homepageFaq = faqSchema([
    {
      q: 'What is frequency therapy?',
      a: 'Frequency therapy uses specific sound tones (measured in Hz) to influence brainwave patterns through brainwave entrainment. Different frequencies promote different states — delta (1-4 Hz) for deep sleep, theta (4-8 Hz) for meditation, alpha (8-14 Hz) for relaxation, and gamma (30-100 Hz) for focus.',
    },
    {
      q: 'Are binaural beats scientifically proven?',
      a: 'Brainwave entrainment — the brain synchronizing to external audio stimuli — is well-documented in auditory neuroscience since the 1970s via EEG studies. The Frequency Following Response (FFR) is consistently replicated. Research continues on specific therapeutic applications.',
    },
    {
      q: 'What frequency helps with anxiety?',
      a: '432 Hz is the most commonly studied frequency for anxiety. Research suggests it may activate the parasympathetic nervous system and promote calm. FreqTherapy offers a free 432 Hz session.',
    },
    {
      q: 'What is the best frequency for sleep?',
      a: 'Delta frequencies (0.5-4 Hz), particularly 1.5 Hz, are associated with deep sleep. The Schumann resonance (7.83 Hz) may support circadian rhythm regulation. FreqTherapy\'s Deep Sleep Protocol combines both.',
    },
    {
      q: 'Do I need headphones for frequency therapy?',
      a: 'Yes, quality headphones are recommended, especially for binaural beats which require different tones in each ear. Over-ear headphones provide the best results.',
    },
    {
      q: 'Is FreqTherapy free?',
      a: 'FreqTherapy offers 2 frequencies free with 5-minute sessions, no account needed. Full access to all 23 frequencies starts at $10/month with the annual plan.',
    },
  ])

  return (
    <html 
      lang="en" 
      className={`scroll-smooth ${inter.variable} ${playfairDisplay.variable} ${instrumentSerif.variable}`}
      suppressHydrationWarning
      style={{ backgroundColor: '#0a0a0f' }}
    >
      <head>
        {/* Prevent white flash — set dark class before paint */}
        <script dangerouslySetInnerHTML={{ __html: `try{if(localStorage.getItem('theme')==='dark'||(!localStorage.getItem('theme')&&window.matchMedia('(prefers-color-scheme:dark)').matches)||document.location.pathname.startsWith('/try/')){document.documentElement.classList.add('dark')}}catch(e){}` }} />
        {/* Structured Data — Organization + WebApplication + FAQ */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageFaq) }}
        />
        
        {/* Security Headers via Meta Tags (backup for server headers) */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
        
        {/* Wellness Disclaimer */}
        <meta name="disclaimer" content="FreqTherapy is a wellness tool. Not intended to diagnose, treat, cure, or prevent any disease. Consult your healthcare provider." />
      </head>
      
      <body 
        className={`${inter.className} antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider>
        {/* Client-side accessibility and emergency controls */}
        <ClientAccessibilityControls />

        {/* Global Mini Player — shows when audio is playing */}
        <MiniPlayer />

        {/* Main Content */}
        <main id="main-content">
          {children}
        </main>

        {/* Client-side emergency handler */}
        <ClientEmergencyHandler />

        {/* Enhanced Toast Notifications with Medical Context */}
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 6000, // Longer for medical information
            style: {
              background: '#1f2937',
              color: '#fff',
              fontSize: '16px',
              fontWeight: '500',
              borderRadius: '12px',
              padding: '16px 20px',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            },
            success: {
              duration: 4000,
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 8000, // Longer for medical warnings
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
            // Medical-specific toast type
            loading: {
              duration: Infinity, // Don't auto-dismiss medical processes
              iconTheme: {
                primary: '#3b82f6',
                secondary: '#fff',
              },
            }
          }}
          containerStyle={{
            top: '80px', // Below skip links
          }}
        />
        </ThemeProvider>

        {/* Global Keyboard Shortcuts Handler */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              document.addEventListener('keydown', function(e) {
                // Emergency stop on Escape key
                if (e.key === 'Escape') {
                  if (window.FreqTherapyAudio) {
                    window.FreqTherapyAudio.emergencyStop();
                    document.getElementById('emergency-notice')?.classList.remove('hidden');
                  }
                }
                
                // Accessibility shortcuts
                if (e.altKey && e.key === '1') {
                  document.getElementById('main-content')?.focus();
                }
                if (e.altKey && e.key === '2') {
                  document.getElementById('navigation')?.focus();
                }
              });
              
              // High contrast mode CSS
              const highContrastCSS = \`
                .high-contrast * {
                  background: #000 !important;
                  color: #fff !important;
                  border-color: #fff !important;
                }
                .high-contrast button,
                .high-contrast a {
                  background: #000 !important;
                  color: #ffff00 !important;
                  border: 2px solid #fff !important;
                }
              \`;
              
              const style = document.createElement('style');
              style.textContent = highContrastCSS;
              document.head.appendChild(style);
            `,
          }}
        />

        {/* Lemon Squeezy overlay checkout script */}
        <Script
          src="https://app.lemonsqueezy.com/js/lemon.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  )
}