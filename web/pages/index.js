export default function Home() {
  return (
    <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'Arial' }}>
      <h1>🎵 Frequency Therapy App</h1>
      <p>Quantum Biophysics-Based Frequency Therapy Platform</p>
      <p>Your personal frequency healing companion - scientifically designed, therapeutically validated.</p>
      
      <div style={{ marginTop: '40px' }}>
        <h3>🔬 Scientific Categories</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li>🧬 DNA Resonance (528 Hz) - Molecular repair</li>
          <li>🌍 Schumann Resonance (7.83 Hz) - Planetary sync</li>
          <li>⚡ Gamma Coherence (40 Hz) - Neural activation</li>
          <li>🧘 Theta Coherence (6.3 Hz) - Subconscious access</li>
          <li>⚛️ Quantum Cellular (10/20/80 Hz) - Mitochondrial coherence</li>
        </ul>
      </div>
      
      <div style={{ marginTop: '40px' }}>
        <h3>💰 Subscription Tiers</h3>
        <p>Quantum Basic: $19.99/month | Quantum Pro: $39.99/month | Quantum Clinical: $79.99/month</p>
      </div>
      
      <p style={{ marginTop: '40px', fontSize: '14px', color: '#666' }}>
        Built with React Native + Node.js + Supabase + Stripe
      </p>
    </div>
  );
}