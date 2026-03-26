export default function Landing() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      fontFamily: 'Arial',
      padding: '0 20px'
    }}>
      {/* Hero Section */}
      <div style={{ textAlign: 'center', padding: '80px 0' }}>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '20px', fontWeight: 'bold' }}>
          🎵 Frequency Therapy App
        </h1>
        <p style={{ fontSize: '1.5rem', marginBottom: '40px', opacity: 0.9 }}>
          Your Personal Quantum Biophysics Healing Companion
        </p>
        <p style={{ fontSize: '1.2rem', marginBottom: '60px', opacity: 0.8 }}>
          Scientifically designed • Therapeutically validated • Screen-off capable
        </p>
        
        <div style={{ marginBottom: '60px' }}>
          <button style={{
            background: 'rgba(255,255,255,0.2)',
            border: '2px solid white',
            color: 'white',
            padding: '15px 40px',
            fontSize: '1.2rem',
            borderRadius: '50px',
            cursor: 'pointer',
            marginRight: '20px'
          }}>
            Start Free Trial
          </button>
          <button style={{
            background: 'transparent',
            border: '2px solid rgba(255,255,255,0.5)',
            color: 'white',
            padding: '15px 40px', 
            fontSize: '1.2rem',
            borderRadius: '50px',
            cursor: 'pointer'
          }}>
            Watch Demo
          </button>
        </div>
      </div>

      {/* Scientific Categories */}
      <div style={{ textAlign: 'center', padding: '60px 0' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '50px' }}>🔬 Scientific Categories</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', maxWidth: '1200px', margin: '0 auto' }}>
          {[
            { icon: '🧬', title: 'DNA Resonance', freq: '528 Hz', desc: 'Molecular repair & regeneration' },
            { icon: '🌍', title: 'Schumann Resonance', freq: '7.83 Hz', desc: 'Planetary synchronization' },
            { icon: '⚡', title: 'Gamma Coherence', freq: '40 Hz', desc: 'Neural activation & focus' },
            { icon: '🧘', title: 'Theta Coherence', freq: '6.3 Hz', desc: 'Subconscious access' },
            { icon: '⚛️', title: 'Quantum Cellular', freq: '10/20/80 Hz', desc: 'Mitochondrial coherence' },
            { icon: '😴', title: 'Deep Sleep', freq: '0.5-4 Hz', desc: 'Regenerative sleep cycles' }
          ].map((item, i) => (
            <div key={i} style={{
              background: 'rgba(255,255,255,0.1)',
              padding: '30px',
              borderRadius: '15px',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '15px' }}>{item.icon}</div>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '10px' }}>{item.title}</h3>
              <p style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '10px', color: '#FFD700' }}>{item.freq}</p>
              <p style={{ opacity: 0.8 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing */}
      <div style={{ textAlign: 'center', padding: '60px 0' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '50px' }}>💰 Choose Your Plan</h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', flexWrap: 'wrap' }}>
          {[
            { name: 'Quantum Basic', price: '$19.99', features: ['6 Core Frequencies', 'Basic Patterns', 'Sleep Mode'] },
            { name: 'Quantum Pro', price: '$39.99', features: ['All Frequencies', 'Advanced Patterns', 'Biometric Integration', 'Progress Tracking'], popular: true },
            { name: 'Quantum Clinical', price: '$79.99', features: ['Everything in Pro', 'Clinical Protocols', 'Priority Support', 'Advanced Analytics'] }
          ].map((plan, i) => (
            <div key={i} style={{
              background: plan.popular ? 'rgba(255,215,0,0.2)' : 'rgba(255,255,255,0.1)',
              padding: '40px 30px',
              borderRadius: '15px',
              border: plan.popular ? '2px solid #FFD700' : '1px solid rgba(255,255,255,0.2)',
              minWidth: '250px',
              position: 'relative'
            }}>
              {plan.popular && (
                <div style={{
                  position: 'absolute',
                  top: '-10px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: '#FFD700',
                  color: '#333',
                  padding: '5px 20px',
                  borderRadius: '20px',
                  fontSize: '0.9rem',
                  fontWeight: 'bold'
                }}>
                  Most Popular
                </div>
              )}
              <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>{plan.name}</h3>
              <p style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '20px', color: '#FFD700' }}>{plan.price}</p>
              <ul style={{ listStyle: 'none', padding: 0, marginBottom: '30px' }}>
                {plan.features.map((feature, j) => (
                  <li key={j} style={{ marginBottom: '10px', opacity: 0.9 }}>✓ {feature}</li>
                ))}
              </ul>
              <button style={{
                background: plan.popular ? '#FFD700' : 'rgba(255,255,255,0.2)',
                color: plan.popular ? '#333' : 'white',
                border: 'none',
                padding: '12px 30px',
                borderRadius: '25px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}>
                Choose Plan
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', padding: '40px 0', opacity: 0.7, borderTop: '1px solid rgba(255,255,255,0.2)' }}>
        <p>Built with React Native + Node.js + Supabase + Stripe</p>
        <p>Contact: sergioduran89@gmail.com</p>
      </div>
    </div>
  );
}