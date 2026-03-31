export default function Home() {
  return (
    <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'Arial' }}>
      <h1>🎵 Frequency Wellness App</h1>
      <p>Research-Inspired Frequency Wellness Platform</p>
      <p>Your personal frequency wellness companion - carefully selected frequencies for relaxation and mindfulness.</p>
      
      <div style={{ marginTop: '40px' }}>
        <h3>🔬 Wellness Categories</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li>🧬 Love Frequency (528 Hz) - Deep relaxation & stress relief</li>
          <li>🌍 Schumann Resonance (7.83 Hz) - Natural grounding frequency</li>
          <li>⚡ Gamma Focus (40 Hz) - Concentration support</li>
          <li>🧘 Theta Meditation (6.3 Hz) - Mindfulness practice</li>
          <li>⚛️ Cellular Harmony (10/20/80 Hz) - Energizing frequencies</li>
        </ul>
      </div>
      
      <div style={{ marginTop: '40px' }}>
        <h3>💰 Subscription Tiers</h3>
        <p>Wellness Basic: $19.99/month | Wellness Pro: $39.99/month | Wellness Premium: $79.99/month</p>
      </div>
      
      <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px', fontSize: '14px', color: '#666' }}>
        <h4 style={{ color: '#333', marginBottom: '10px' }}>📋 Educational & Informational Content</h4>
        <p>FrequencyTherapy provides educational content about frequency wellness based on research we've reviewed over time. This information is for educational and relaxation purposes only. Individual experiences may vary.</p>
        <p style={{ fontWeight: 'bold', marginTop: '10px' }}>This is not medical advice. Always consult healthcare professionals for medical concerns.</p>
      </div>
      
      <p style={{ marginTop: '40px', fontSize: '14px', color: '#666' }}>
        Built with React Native + Node.js + Supabase + Stripe
      </p>
    </div>
  );
}