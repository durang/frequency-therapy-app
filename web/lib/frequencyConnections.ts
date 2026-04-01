/**
 * Frequency Connections — Scientific relationships between frequencies
 */

export interface FrequencyConnection {
  fromSlug: string
  toSlug: string
  toName: string
  toHz: number
  relationship: 'Harmonic' | 'Synergistic' | 'Sequential' | 'Complementary'
  explanation: string
  protocol?: string
}

export const FREQUENCY_CONNECTIONS: FrequencyConnection[] = [
  // Schumann 7.83 Hz
  { fromSlug: 'schumann-earth-resonance', toSlug: 'anxiety-liberation', toName: 'Anxiety Liberation', toHz: 432, relationship: 'Harmonic', explanation: '432 Hz is a mathematical harmonic of Earth\'s 7.83 Hz Schumann resonance. Both activate the parasympathetic nervous system — Schumann grounds the body, 432 Hz calms the mind.' },
  { fromSlug: 'schumann-earth-resonance', toSlug: 'deep-sleep-delta', toName: 'Deep Sleep Delta', toHz: 1.5, relationship: 'Sequential', explanation: 'Schumann (7.83 Hz) prepares your circadian rhythm for sleep at the alpha-theta boundary. Delta (1.5 Hz) takes you into deep slow-wave sleep. Use sequentially: Schumann 1h before bed → delta at bedtime.', protocol: 'sleep' },
  { fromSlug: 'schumann-earth-resonance', toSlug: 'serotonin-balance', toName: 'Serotonin Balance', toHz: 10, relationship: 'Complementary', explanation: 'Schumann (7.83 Hz) and alpha (10 Hz) both promote calm awareness. Schumann grounds you to Earth\'s rhythm; 10 Hz optimizes serotonin — the neurotransmitter of contentment.' },

  // 432 Hz Anxiety
  { fromSlug: 'anxiety-liberation', toSlug: 'schumann-earth-resonance', toName: 'Schumann Earth Resonance', toHz: 7.83, relationship: 'Harmonic', explanation: '432 Hz derives from Earth\'s 7.83 Hz resonance — it\'s literally in tune with the planet. Combine both for maximum grounding.' },
  { fromSlug: 'anxiety-liberation', toSlug: 'dna-repair', toName: 'Love Frequency', toHz: 528, relationship: 'Synergistic', explanation: '432 Hz reduces cortisol while 528 Hz repairs cellular damage from chronic stress. Together they form the core of the Anxiety Relief Protocol.', protocol: 'anxiety' },
  { fromSlug: 'anxiety-liberation', toSlug: 'gaba-relaxation', toName: 'GABA Relaxation', toHz: 100, relationship: 'Complementary', explanation: '432 Hz calms the autonomic nervous system (cortisol, heart rate). 100 Hz GABA calms neurotransmitter signaling. Different mechanisms, same deep calm.' },
  { fromSlug: 'anxiety-liberation', toSlug: 'heart-coherence-optimizer', toName: 'Heart Coherence', toHz: 0.1, relationship: 'Synergistic', explanation: '432 Hz calms the mind; 0.1 Hz optimizes heart rate variability (HRV). High HRV is the signature of emotional resilience.' },

  // 528 Hz Love Frequency
  { fromSlug: 'dna-repair', toSlug: 'anxiety-liberation', toName: 'Anxiety Liberation', toHz: 432, relationship: 'Synergistic', explanation: 'Chronic stress damages DNA through oxidative pathways. 432 Hz reduces cortisol first, then 528 Hz repairs the damage. Calm first, heal second.', protocol: 'anxiety' },
  { fromSlug: 'dna-repair', toSlug: 'stem-cell-activation', toName: 'Deep Restoration', toHz: 174, relationship: 'Sequential', explanation: '174 Hz supports deep restoration; 528 Hz provides the Love Frequency template. 174 Hz rebuilds tissue, 528 Hz enhances the restorative experience.', protocol: 'pain' },
  { fromSlug: 'dna-repair', toSlug: 'telomere-guardian', toName: 'Longevity Frequency', toHz: 963, relationship: 'Complementary', explanation: '528 Hz repairs active stress. 963 Hz supports longevity and deep wellness. Relaxation + longevity support.' },

  // 40 Hz Gamma Focus
  { fromSlug: 'gamma-focus-enhancement', toSlug: 'dopamine-elevation', toName: 'Dopamine Elevation', toHz: 14, relationship: 'Synergistic', explanation: '40 Hz gamma activates attention networks. 14 Hz beta stimulates dopamine — the motivation neurotransmitter. Focus + drive = flow state.', protocol: 'focus' },
  { fromSlug: 'gamma-focus-enhancement', toSlug: 'neural-repair-frequency', toName: 'Neural Repair', toHz: 741, relationship: 'Complementary', explanation: 'MIT showed 40 Hz activates microglia (brain cleanup). 741 Hz supports neuroplasticity. One clears debris; the other builds new connections.' },
  { fromSlug: 'gamma-focus-enhancement', toSlug: 'serotonin-balance', toName: 'Serotonin Balance', toHz: 10, relationship: 'Sequential', explanation: 'Intense 40 Hz focus is mentally taxing. 10 Hz alpha (serotonin) is the perfect wind-down: high-gamma productivity → calm rest.' },

  // 1.5 Hz Delta Sleep
  { fromSlug: 'deep-sleep-delta', toSlug: 'schumann-earth-resonance', toName: 'Schumann Earth Resonance', toHz: 7.83, relationship: 'Sequential', explanation: 'Sleep Protocol: Schumann (7.83 Hz) 1h before bed aligns circadian rhythm → delta (1.5 Hz) at bedtime induces deep slow-wave sleep.', protocol: 'sleep' },
  { fromSlug: 'deep-sleep-delta', toSlug: 'anxiety-liberation', toName: 'Anxiety Liberation', toHz: 432, relationship: 'Complementary', explanation: 'Anxiety is sleep\'s #1 enemy. 432 Hz reduces cortisol and racing thoughts. Use 432 Hz in the evening → delta 1.5 Hz at bedtime.', protocol: 'sleep' },
  { fromSlug: 'deep-sleep-delta', toSlug: 'dna-repair', toName: 'Love Frequency', toHz: 528, relationship: 'Synergistic', explanation: 'Deep sleep is when your body performs most Love Frequency. Delta maximizes sleep depth; 528 Hz supports the relaxation response.' },

  // 174 Hz Stem Cell
  { fromSlug: 'stem-cell-activation', toSlug: 'pain-relief-matrix', toName: 'Pain Relief Matrix', toHz: 285, relationship: 'Sequential', explanation: '174 Hz (lowest solfeggio) relieves pain and security. 285 Hz heals tissue. Pain Protocol: 174 Hz relieves → 285 Hz repairs.', protocol: 'pain' },
  { fromSlug: 'stem-cell-activation', toSlug: 'dna-repair', toName: 'Love Frequency', toHz: 528, relationship: 'Complementary', explanation: '174 Hz activates stem cells. 528 Hz ensures new cells have properly repaired DNA. Regeneration + genetic integrity.', protocol: 'healing' },

  // 285 Hz Pain Relief
  { fromSlug: 'pain-relief-matrix', toSlug: 'stem-cell-activation', toName: 'Deep Restoration', toHz: 174, relationship: 'Sequential', explanation: '285 Hz repairs tissue; 174 Hz provides foundational pain relief. Together: first two phases of the Pain Protocol.', protocol: 'pain' },
  { fromSlug: 'pain-relief-matrix', toSlug: 'universal-healing-frequency', toName: 'Universal Healing', toHz: 10000, relationship: 'Synergistic', explanation: '285 Hz = precision tissue repair. 10000 Hz = broad-spectrum cellular support. Targeted + systemic healing.', protocol: 'pain' },

  // 741 Hz Neural Repair
  { fromSlug: 'neural-repair-frequency', toSlug: 'gamma-focus-enhancement', toName: 'Gamma Focus', toHz: 40, relationship: 'Complementary', explanation: '741 Hz promotes neuroplasticity (new pathways). 40 Hz gamma strengthens those pathways through focused activation. Repair → reinforce.' },
  { fromSlug: 'neural-repair-frequency', toSlug: 'epigenetic-optimization', toName: 'Epigenetic Optimization', toHz: 852, relationship: 'Sequential', explanation: 'Solfeggio progression: 741 Hz (cleansing) → 852 Hz (awakening). Clear toxins first, then activate gene expression.', protocol: 'detox' },

  // 14 Hz Dopamine
  { fromSlug: 'dopamine-elevation', toSlug: 'gamma-focus-enhancement', toName: 'Gamma Focus', toHz: 40, relationship: 'Synergistic', explanation: 'Dopamine (14 Hz) = motivation + reward. Gamma (40 Hz) = sustained attention. Together: the neurochemical cocktail of flow state.', protocol: 'focus' },
  { fromSlug: 'dopamine-elevation', toSlug: 'serotonin-balance', toName: 'Serotonin Balance', toHz: 10, relationship: 'Complementary', explanation: 'Dopamine drives action; serotonin gives satisfaction. 14 Hz mornings for drive → 10 Hz evenings for contentment.' },

  // 10 Hz Serotonin
  { fromSlug: 'serotonin-balance', toSlug: 'dopamine-elevation', toName: 'Dopamine Elevation', toHz: 14, relationship: 'Complementary', explanation: 'Serotonin (10 Hz alpha) = contentment. Dopamine (14 Hz beta) = motivation. Yin and yang of mood. Balance both.' },
  { fromSlug: 'serotonin-balance', toSlug: 'anxiety-liberation', toName: 'Anxiety Liberation', toHz: 432, relationship: 'Synergistic', explanation: 'Low serotonin drives anxiety. 10 Hz optimizes serotonin while 432 Hz calms the autonomic nervous system. Chemistry + physiology.', protocol: 'anxiety' },

  // 10000 Hz Universal Healing
  { fromSlug: 'universal-healing-frequency', toSlug: 'dna-repair', toName: 'Love Frequency', toHz: 528, relationship: 'Synergistic', explanation: '10000 Hz = broad-spectrum cellular stimulation. 528 Hz = Love Frequency fidelity. Universal Healing Protocol combines both.', protocol: 'healing' },
  { fromSlug: 'universal-healing-frequency', toSlug: 'pain-relief-matrix', toName: 'Pain Relief Matrix', toHz: 285, relationship: 'Complementary', explanation: '10000 Hz (Swiss army knife) + 285 Hz (precision tool). Pain Protocol uses both for complete coverage.', protocol: 'pain' },

  // 100 Hz GABA
  { fromSlug: 'gaba-relaxation', toSlug: 'anxiety-liberation', toName: 'Anxiety Liberation', toHz: 432, relationship: 'Synergistic', explanation: 'GABA = brain\'s inhibitory neurotransmitter. 100 Hz enhances GABA; 432 Hz calms the autonomic system. Two pathways to deep calm.' },
  { fromSlug: 'gaba-relaxation', toSlug: 'deep-sleep-delta', toName: 'Deep Sleep Delta', toHz: 1.5, relationship: 'Sequential', explanation: 'GABA naturally rises before sleep — it\'s the brain\'s "off switch." 100 Hz pre-sleep → 1.5 Hz delta for sleep induction.' },

  // 0.1 Hz Heart Coherence
  { fromSlug: 'heart-coherence-optimizer', toSlug: 'anxiety-liberation', toName: 'Anxiety Liberation', toHz: 432, relationship: 'Synergistic', explanation: 'HRV at 0.1 Hz = emotional resilience marker. 432 Hz reduces cortisol. Together: heart-brain coherence — the state of inner peace.' },
  { fromSlug: 'heart-coherence-optimizer', toSlug: 'schumann-earth-resonance', toName: 'Schumann Earth Resonance', toHz: 7.83, relationship: 'Complementary', explanation: '0.1 Hz optimizes heart rhythm; 7.83 Hz aligns brain with Earth. Heart coherence + circadian alignment = total harmony.' },

  // 852 Hz Epigenetic
  { fromSlug: 'epigenetic-optimization', toSlug: 'dna-repair', toName: 'Love Frequency', toHz: 528, relationship: 'Sequential', explanation: '528 Hz repairs DNA structure. 852 Hz influences gene expression (epigenetics). Repair the code → optimize which parts activate.' },
  { fromSlug: 'epigenetic-optimization', toSlug: 'neural-repair-frequency', toName: 'Neural Repair', toHz: 741, relationship: 'Sequential', explanation: 'Solfeggio: 741 Hz (cleansing) → 852 Hz (awakening). Clear toxins → activate higher-order expression.', protocol: 'detox' },

  // 963 Hz Anti-Aging
  { fromSlug: 'telomere-guardian', toSlug: 'dna-repair', toName: 'Love Frequency', toHz: 528, relationship: 'Complementary', explanation: '963 Hz protects telomeres (aging clock). 528 Hz repairs active stress. Protection + restoration = longevity support.' },
  { fromSlug: 'telomere-guardian', toSlug: 'stem-cell-activation', toName: 'Deep Restoration', toHz: 174, relationship: 'Synergistic', explanation: 'Telomere preservation (963 Hz) keeps cells young. Stem cell activation (174 Hz) creates new cells. Young + new = regeneration.' },

  // 95 Hz Metabolic
  { fromSlug: 'metabolic-accelerator', toSlug: 'mitochondrial-boost', toName: 'Cellular Energy', toHz: 55, relationship: 'Synergistic', explanation: 'Metabolism (95 Hz) = how fast you burn. Mitochondria (55 Hz) = how much you produce. Both for maximum energy.' },

  // 55 Hz Cellular Energy
  { fromSlug: 'mitochondrial-boost', toSlug: 'metabolic-accelerator', toName: 'Metabolic Accelerator', toHz: 95, relationship: 'Synergistic', explanation: '55 Hz enhances ATP production; 95 Hz accelerates metabolic rate. More energy + faster metabolism = vitality.' },
  { fromSlug: 'mitochondrial-boost', toSlug: 'dna-repair', toName: 'Love Frequency', toHz: 528, relationship: 'Complementary', explanation: 'Mitochondria have their own DNA (mtDNA). 55 Hz boosts mitochondrial function; 528 Hz repairs the mtDNA that keeps them running.' },
]

export function getConnectionsForFrequency(slug: string): FrequencyConnection[] {
  return FREQUENCY_CONNECTIONS.filter(c => c.fromSlug === slug)
}
