import { Frequency } from '@/types'

export const frequencies: Frequency[] = [
  // Love Frequency — moved to basic tier per D039
  {
    id: '1',
    name: 'Love Frequency',
    slug: 'dna-repair',
    hz_value: 528,
    category: 'dna_repair',
    description: 'The renowned Solfeggio frequency associated with inner harmony, deep relaxation, and a profound sense of wellbeing',
    scientific_backing: 'Research suggests that 528 Hz sound waves may positively influence the autonomic nervous system and stress markers. A peer-reviewed study (Akimoto et al., 2018) found that listening to 528 Hz music reduced cortisol and increased oxytocin in participants. Additional research explores potential effects on cell viability and testosterone production in laboratory settings.',
    benefits: [
      'Deep relaxation and stress relief',
      'Enhanced sense of inner harmony',
      'Improved mood and emotional balance',
      'Support for restorative rest',
      'Promotes feelings of wellbeing',
      'Gentle energizing effect'
    ],
    best_for: [
      'Post-illness recovery',
      'Relaxation practice',
      'Meditation enhancement',
      'Self-care routines',
      'Stress management',
      'Mindfulness sessions'
    ],
    tier: 'basic',
    duration_minutes: 20,
    research_citations: [
      'Akimoto K, Hu A, Yamaguchi T, Kobayashi H. Effect of 528 Hz Music on the Endocrine System and Autonomic Nervous System. Health, 2018; 10(9): 1159-1170. https://doi.org/10.4236/health.2018.109088',
      'Babayi Daylari T, Riazi GH, et al. Influence of 528 Hz sound-wave in production of testosterone in rat brain. Genes & Genomics, 2019; 41: 201-212. https://pubmed.ncbi.nlm.nih.gov/30414050/',
      'Babayi T, Riazi GH. Effects of 528 Hz Sound Wave to Reduce Cell Death in Human Astrocyte Primary Cell Culture. J Addict Res Ther, 2017; 8: 335. https://doi.org/10.4172/2155-6105.1000335',
      'Bhoot A, et al. Effect of OM Chanting at 528Hz on HRV, Wellbeing, and Sleep Quality. Annals of Indian Academy of Neurology, 2025. https://doi.org/10.1177/09727531251390261'
    ],
    clinical_trials: [
      {
        title: 'Effect of 528 Hz Music on Endocrine and Autonomic Nervous System',
        participants: 9,
        duration_weeks: 1,
        results: 'Reduced cortisol and increased oxytocin observed in participants',
        institution: 'Institute of Subtropical Agriculture, Japan (Akimoto et al., 2018)'
      }
    ],
    mechanism: 'Research suggests 528 Hz may promote relaxation by influencing the autonomic nervous system, potentially reducing stress hormone levels and supporting a sense of calm',
    contraindications: ['Consult your healthcare provider if you are in your first trimester of pregnancy', 'Consult your healthcare provider if you are undergoing active cancer treatment', 'Consult your healthcare provider if you use a pacemaker', 'This is a wellness tool, not a medical device'],
    dosage: '20-30 minutes daily, preferably morning hours for a refreshing start. Individual experiences may vary',
    breathing: { inhale: 5, hold: 5, exhale: 5, reason: 'Steady equal breathing supports relaxation and enhances the listening experience' }
  },
  // TIER 1: FREE - Scientific Gateway Frequencies (2 free per D039)
  {
    id: '2',
    name: 'Anxiety Liberation',
    slug: 'anxiety-liberation',
    hz_value: 432,
    category: 'anxiety_relief',
    description: 'Mathematical harmony frequency for anxiety and stress relief, promoting deep calm and emotional balance',
    scientific_backing: 'A double-blind crossover study (Calamassi & Pomponi, 2019) found that music tuned to 432 Hz was associated with a slight decrease in blood pressure and heart rate compared to 440 Hz. Research suggests that this tuning may promote parasympathetic activation and emotional balance, though more studies are needed.',
    benefits: [
      'Reduced tension and anxiety',
      'Enhanced calm and emotional balance',
      'Support for parasympathetic relaxation',
      'Improved sense of wellbeing',
      'Stress relief',
      'Gentle mood elevation'
    ],
    best_for: [
      'Stress management',
      'Relaxation practice',
      'Meditation enhancement',
      'Performance anxiety support',
      'Mindfulness sessions',
      'Self-care routines'
    ],
    tier: 'free',
    duration_minutes: 25,
    research_citations: [
      'Calamassi D, Pomponi GP. Music Tuned to 440 Hz Versus 432 Hz and the Health Effects: A Double-blind Cross-over Pilot Study. EXPLORE, 2019; 15(4): 283-290. https://pubmed.ncbi.nlm.nih.gov/30389302/',
      'Thoma MV, et al. The effect of music on the human stress response. PLoS ONE, 2013; 8(8): e70156. https://doi.org/10.1371/journal.pone.0070156',
      'Chanda ML, Levitin DJ. The neurochemistry of music. Trends in Cognitive Sciences, 2013; 17(4): 179-193. https://doi.org/10.1016/j.tics.2013.02.007'
    ],
    clinical_trials: [],
    mechanism: 'Creates harmonic resonance associated with calm states, may support parasympathetic activation and reduce stress responses',
    contraindications: ['Consult your healthcare provider if you have severe depression with psychotic features', 'Consult your healthcare provider if you are experiencing acute bipolar episodes', 'This is a wellness tool, not a medical device'],
    dosage: '20-30 minutes during anxious moments, or as a preventive practice twice daily. Individual experiences may vary',
    breathing: { inhale: 4, hold: 4, exhale: 6, reason: 'Extended exhale supports vagus nerve activation, promoting calm breathing and relaxation' }
  },
  {
    id: '3',
    name: 'Gamma Focus Enhancement',
    slug: 'gamma-focus',
    hz_value: 40,
    category: 'cognitive_enhancement',
    description: 'Peak cognitive performance through gamma wave entrainment, associated with heightened focus and mental clarity',
    scientific_backing: 'Research at MIT (Iaccarino et al., 2016, published in Nature) demonstrated that 40 Hz gamma frequency entrainment reduced amyloid load and modified microglia in mouse models. A follow-up study (Martorell et al., 2019, Cell) extended these findings with multi-sensory gamma stimulation. This frequency is observed in experienced meditators during deep focus states.',
    benefits: [
      'Enhanced focus and concentration',
      'Improved mental clarity',
      'Support for cognitive performance',
      'Better attention during tasks',
      'Mental stamina support',
      'Creative thinking enhancement'
    ],
    best_for: [
      'Study enhancement',
      'Work productivity',
      'Creative projects',
      'Mental performance',
      'Meditation enhancement',
      'Mindfulness sessions'
    ],
    tier: 'free',
    duration_minutes: 45,
    research_citations: [
      'Iaccarino HF, Singer AC, et al. Gamma frequency entrainment attenuates amyloid load and modifies microglia. Nature, 2016; 540: 230-235. https://doi.org/10.1038/nature20587',
      'Martorell AJ, et al. Multi-sensory gamma stimulation ameliorates Alzheimer-associated pathology. Cell, 2019; 177(2): 256-271. https://doi.org/10.1016/j.cell.2019.02.014',
      'Chanda ML, Levitin DJ. The neurochemistry of music. Trends in Cognitive Sciences, 2013; 17(4): 179-193. https://doi.org/10.1016/j.tics.2013.02.007'
    ],
    clinical_trials: [
      {
        title: 'Gamma Frequency Entrainment and Amyloid Load',
        participants: 0,
        duration_weeks: 1,
        results: 'Reduced amyloid-beta levels and modified microglial response in mouse models',
        institution: 'MIT Picower Institute for Learning and Memory (Iaccarino et al., 2016, Nature)'
      }
    ],
    mechanism: 'Entrains cortical gamma oscillations, associated with enhanced neural synchronization and heightened attentional states',
    contraindications: ['Consult your healthcare provider if you have epilepsy', 'Consult your healthcare provider if you have a recent concussion', 'This is a wellness tool, not a medical device'],
    dosage: '30-45 minutes during peak performance needs, avoid within 4 hours of sleep. Individual experiences may vary',
    breathing: { inhale: 4, hold: 4, exhale: 4, reason: 'Box breathing supports balanced focus and sustained cognitive performance' }
  },
  {
    id: '4',
    name: 'Deep Sleep Delta',
    slug: 'deep-sleep-delta',
    hz_value: 1.5,
    category: 'sleep_optimization',
    description: 'Ultra-deep delta frequency for restorative sleep, promoting deep rest and overnight recovery',
    scientific_backing: 'Research suggests that delta-range frequencies (0.5-4 Hz) are associated with the deepest stages of sleep, during which the body undergoes restorative processes. Studies on sound-based sleep interventions show that auditory stimulation synchronized with slow-wave sleep may enhance sleep quality and support natural recovery processes.',
    benefits: [
      'Support for deeper sleep stages',
      'Enhanced sense of overnight rest',
      'Improved sleep quality',
      'Better morning refreshment',
      'Relaxation before bed',
      'Support for natural recovery'
    ],
    best_for: [
      'Sleep quality improvement',
      'Relaxation practice',
      'Recovery support',
      'Self-care routines',
      'Stress management',
      'Evening wind-down'
    ],
    tier: 'basic',
    duration_minutes: 60,
    research_citations: [
      'Thoma MV, et al. The effect of music on the human stress response. PLoS ONE, 2013; 8(8): e70156. https://doi.org/10.1371/journal.pone.0070156',
      'Goldsby TL, et al. Effects of Singing Bowl Sound Meditation on Mood, Tension, and Well-being. J Evid Based Complementary Altern Med, 2017; 22(3): 401-406. https://doi.org/10.1177/2156587216668109',
      'Nakajima Y, et al. Stress Recovery Effects of High- and Low-Frequency Amplified Music on Heart Rate Variability. Behav Neurol, 2016; 2016: 5965894. https://doi.org/10.1155/2016/5965894'
    ],
    clinical_trials: [],
    mechanism: 'Associated with slow-wave sleep states that support deep rest and natural overnight recovery processes',
    contraindications: ['Consult your healthcare provider if you have untreated sleep apnea', 'Consult your healthcare provider if you have narcolepsy', 'Consult your healthcare provider if you have recently changed sleep medications', 'This is a wellness tool, not a medical device'],
    dosage: '45-60 minutes during sleep hours, use with good sleep hygiene practices. Individual experiences may vary',
    breathing: { inhale: 4, hold: 7, exhale: 8, reason: 'Extended hold and long exhale promote calm breathing and support the transition to sleep' }
  },
  {
    id: '5',
    name: 'Schumann Earth Resonance',
    slug: 'schumann-earth-resonance',
    hz_value: 7.83,
    category: 'grounding',
    description: 'Earth\'s natural electromagnetic frequency for grounding, circadian support, and a deep connection to natural rhythms',
    scientific_backing: 'The Schumann resonance at 7.83 Hz is a well-documented electromagnetic phenomenon in the Earth-ionosphere cavity. Research suggests that exposure to this frequency range may support circadian rhythm alignment and promote a sense of grounding. While specific research on 7.83 Hz listening is limited, the broader field of sound wellness research suggests that low frequencies may promote relaxation and reduce stress markers.',
    benefits: [
      'Sense of grounding and connection',
      'Circadian rhythm support',
      'Stress reduction',
      'Enhanced relaxation',
      'Natural rhythm alignment',
      'Improved sense of balance'
    ],
    best_for: [
      'Jet lag recovery',
      'Relaxation practice',
      'Stress management',
      'Meditation enhancement',
      'Mindfulness sessions',
      'Self-care routines'
    ],
    tier: 'basic',
    duration_minutes: 30,
    research_citations: [
      'Thoma MV, et al. The effect of music on the human stress response. PLoS ONE, 2013; 8(8): e70156. https://doi.org/10.1371/journal.pone.0070156',
      'Chanda ML, Levitin DJ. The neurochemistry of music. Trends in Cognitive Sciences, 2013; 17(4): 179-193. https://doi.org/10.1016/j.tics.2013.02.007',
      'Nakajima Y, et al. Stress Recovery Effects of High- and Low-Frequency Amplified Music on Heart Rate Variability. Behav Neurol, 2016; 2016: 5965894. https://doi.org/10.1155/2016/5965894'
    ],
    clinical_trials: [],
    mechanism: 'Associated with Earth\'s natural electromagnetic rhythm, may support circadian alignment and promote a sense of grounding and calm',
    contraindications: ['Consult your healthcare provider if you use a pacemaker', 'Consult your healthcare provider if you have severe arrhythmias', 'Consult your healthcare provider if you have electromagnetic sensitivity', 'This is a wellness tool, not a medical device'],
    dosage: '25-35 minutes daily, optimal timing 2 hours before natural bedtime. Individual experiences may vary',
    breathing: { inhale: 4, hold: 4, exhale: 6, reason: 'Calming extended exhale promotes relaxation and harmonizes with a natural sense of rhythm' }
  },

  // TIER 2: BASIC ($19.99) - Advanced Therapeutic Suite
  {
    id: '6',
    name: 'Pain Relief',
    slug: 'pain-relief',
    hz_value: 285,
    category: 'pain_management',
    description: 'Solfeggio frequency associated with comfort, tension relief, and a restorative experience for the body',
    scientific_backing: 'Research suggests that specific sound frequencies may influence pain perception through auditory-mediated relaxation pathways. A peer-reviewed study found that music-based interventions can modulate pain responses by promoting endorphin release and reducing stress hormones. While specific research on 285 Hz is limited, the broader field of sound wellness research suggests that targeted frequencies may support comfort and relaxation.',
    benefits: [
      'Reduced tension and discomfort',
      'Deep relaxation',
      'Enhanced sense of physical comfort',
      'Support for natural recovery',
      'Stress relief',
      'Improved sense of wellbeing'
    ],
    best_for: [
      'Relaxation practice',
      'Recovery support',
      'Self-care routines',
      'Stress management',
      'Mindfulness sessions',
      'Post-exercise comfort'
    ],
    tier: 'basic',
    duration_minutes: 35,
    research_citations: [
      'Goldsby TL, et al. Effects of Singing Bowl Sound Meditation on Mood, Tension, and Well-being. J Evid Based Complementary Altern Med, 2017; 22(3): 401-406. https://doi.org/10.1177/2156587216668109',
      'Chanda ML, Levitin DJ. The neurochemistry of music. Trends in Cognitive Sciences, 2013; 17(4): 179-193. https://doi.org/10.1016/j.tics.2013.02.007',
      'Thoma MV, et al. The effect of music on the human stress response. PLoS ONE, 2013; 8(8): e70156. https://doi.org/10.1371/journal.pone.0070156'
    ],
    clinical_trials: [],
    mechanism: 'May promote relaxation and comfort through auditory-mediated pathways, potentially supporting the body\'s natural responses to tension',
    contraindications: ['Consult your healthcare provider if you have acute abdominal pain', 'Consult your healthcare provider if you have undiagnosed pain conditions', 'Consult your healthcare provider if you have pregnancy complications', 'This is a wellness tool, not a medical device'],
    dosage: '30-40 minutes, 2-3 times daily as needed for comfort. Individual experiences may vary',
    breathing: { inhale: 5, hold: 3, exhale: 7, reason: 'Long exhale supports relaxation and promotes a sense of physical comfort' }
  },
  {
    id: '7',
    name: 'Heart Coherence',
    slug: 'heart-coherence',
    hz_value: 0.1,
    category: 'cardiovascular',
    description: 'Ultra-low frequency for heart rate variability support and a balanced sense of calm',
    scientific_backing: 'Research suggests that breathing and biofeedback practices at approximately 0.1 Hz (6 breaths per minute) are associated with improved heart rate variability and autonomic balance. Peer-reviewed studies on HRV biofeedback demonstrate that this resonant frequency may support cardiovascular wellness and stress resilience.',
    benefits: [
      'Heart rate variability support',
      'Enhanced sense of calm',
      'Improved stress resilience',
      'Support for autonomic balance',
      'Relaxation and centering',
      'Improved sense of wellbeing'
    ],
    best_for: [
      'Relaxation practice',
      'Stress management',
      'Meditation enhancement',
      'Self-care routines',
      'Mindfulness sessions',
      'Athletic recovery'
    ],
    tier: 'basic',
    duration_minutes: 20,
    research_citations: [
      'Thoma MV, et al. The effect of music on the human stress response. PLoS ONE, 2013; 8(8): e70156. https://doi.org/10.1371/journal.pone.0070156',
      'Nakajima Y, et al. Stress Recovery Effects of High- and Low-Frequency Amplified Music on Heart Rate Variability. Behav Neurol, 2016; 2016: 5965894. https://doi.org/10.1155/2016/5965894',
      'Chanda ML, Levitin DJ. The neurochemistry of music. Trends in Cognitive Sciences, 2013; 17(4): 179-193. https://doi.org/10.1016/j.tics.2013.02.007'
    ],
    clinical_trials: [],
    mechanism: 'Associated with cardiac coherence patterns; may support autonomic balance through resonant frequency entrainment',
    contraindications: ['Consult your healthcare provider if you have severe arrhythmias', 'Consult your healthcare provider if you have had recent cardiac surgery', 'Consult your healthcare provider if you have unstable angina', 'This is a wellness tool, not a medical device'],
    dosage: '15-25 minutes, preferably morning and evening sessions. Individual experiences may vary',
    breathing: { inhale: 5, hold: 3, exhale: 7, reason: 'This breathing ratio supports relaxation and promotes a sense of heart-centered calm' }
  },
  {
    id: '8',
    name: 'Dopamine & Motivation',
    slug: 'dopamine-elevation',
    hz_value: 14,
    category: 'neurotransmitter_optimization',
    description: 'Beta frequency associated with motivation, drive, and an uplifting sense of focus and energy',
    scientific_backing: 'Research suggests that beta-range frequencies (12-30 Hz) are associated with alert, focused mental states. Studies on auditory stimulation in the beta range indicate potential effects on mood and motivation. While specific research on 14 Hz is limited, the broader field of sound wellness research suggests that beta frequencies may support an energized and focused mental state.',
    benefits: [
      'Enhanced sense of motivation',
      'Improved focus and drive',
      'Uplifting mood support',
      'Better mental energy',
      'Support for positive outlook',
      'Increased sense of purpose'
    ],
    best_for: [
      'Motivation support',
      'Self-care routines',
      'Morning energy practice',
      'Mindfulness sessions',
      'Creative work',
      'Stress management'
    ],
    tier: 'basic',
    duration_minutes: 25,
    research_citations: [
      'Chanda ML, Levitin DJ. The neurochemistry of music. Trends in Cognitive Sciences, 2013; 17(4): 179-193. https://doi.org/10.1016/j.tics.2013.02.007',
      'Gerra G, et al. Neuroendocrine responses of healthy volunteers to music. Psychoneuroendocrinology, 1998; 23(8): 915-925.',
      'Thoma MV, et al. The effect of music on the human stress response. PLoS ONE, 2013; 8(8): e70156. https://doi.org/10.1371/journal.pone.0070156'
    ],
    clinical_trials: [],
    mechanism: 'Associated with beta brainwave states linked to alertness and motivation; may support an energized mental state',
    contraindications: ['Consult your healthcare provider if you have bipolar disorder (manic phase)', 'Consult your healthcare provider if you have psychotic disorders', 'This is a wellness tool, not a medical device'],
    dosage: '20-30 minutes morning use, avoid evening application to prevent sleep disruption. Individual experiences may vary',
    breathing: { inhale: 6, hold: 2, exhale: 4, reason: 'Energizing ratio with longer inhale supports an uplifting, motivated state' }
  },
  {
    id: '9',
    name: 'Serotonin Balance',
    slug: 'serotonin-balance',
    hz_value: 10,
    category: 'mood_enhancement',
    description: 'Alpha frequency associated with emotional balance, calm, and an elevated sense of mood',
    scientific_backing: 'Research suggests that alpha-range frequencies (8-12 Hz) are associated with relaxed, calm mental states. Studies on sound and music interventions show effects on mood and emotional regulation. A peer-reviewed study found that music listening significantly reduced cortisol and improved mood markers in participants.',
    benefits: [
      'Enhanced emotional balance',
      'Improved mood and calm',
      'Reduced tension',
      'Greater sense of wellbeing',
      'Support for emotional stability',
      'Gentle relaxation'
    ],
    best_for: [
      'Emotional wellness',
      'Relaxation practice',
      'Meditation enhancement',
      'Self-care routines',
      'Stress management',
      'Mindfulness sessions'
    ],
    tier: 'basic',
    duration_minutes: 30,
    research_citations: [
      'Thoma MV, et al. The effect of music on the human stress response. PLoS ONE, 2013; 8(8): e70156. https://doi.org/10.1371/journal.pone.0070156',
      'Chanda ML, Levitin DJ. The neurochemistry of music. Trends in Cognitive Sciences, 2013; 17(4): 179-193. https://doi.org/10.1016/j.tics.2013.02.007',
      'Goldsby TL, et al. Effects of Singing Bowl Sound Meditation on Mood, Tension, and Well-being. J Evid Based Complementary Altern Med, 2017; 22(3): 401-406. https://doi.org/10.1177/2156587216668109'
    ],
    clinical_trials: [],
    mechanism: 'Associated with alpha brainwave states linked to calm alertness; may support emotional balance through relaxation pathways',
    contraindications: ['Consult your healthcare provider if you are at risk of serotonin syndrome', 'Consult your healthcare provider if you take MAOI medications', 'Consult your healthcare provider if you have recently changed SSRI medications', 'This is a wellness tool, not a medical device'],
    dosage: '25-35 minutes daily, preferably at a consistent time for routine building. Individual experiences may vary',
    breathing: { inhale: 4, hold: 4, exhale: 6, reason: 'Gentle extended exhale promotes calm breathing and supports emotional balance' }
  },
  {
    id: '10',
    name: 'GABA Relaxation',
    slug: 'gaba-relaxation',
    hz_value: 100,
    category: 'relaxation',
    description: 'High-frequency gamma for deep relaxation, tension release, and a profound sense of calm',
    scientific_backing: 'Research suggests that sound-based relaxation interventions can promote measurable reductions in anxiety and tension. A peer-reviewed study on singing bowl meditation found significant reductions in tension, anger, and fatigue. While specific research on 100 Hz is limited, the broader field of sound wellness research supports the use of specific frequencies for relaxation and stress reduction.',
    benefits: [
      'Deep relaxation',
      'Reduced tension and anxiety',
      'Enhanced sense of calm',
      'Support for sleep preparation',
      'Stress relief',
      'Improved sense of wellbeing'
    ],
    best_for: [
      'Relaxation practice',
      'Stress management',
      'Sleep preparation',
      'Self-care routines',
      'Meditation enhancement',
      'Mindfulness sessions'
    ],
    tier: 'basic',
    duration_minutes: 20,
    research_citations: [
      'Goldsby TL, et al. Effects of Singing Bowl Sound Meditation on Mood, Tension, and Well-being. J Evid Based Complementary Altern Med, 2017; 22(3): 401-406. https://doi.org/10.1177/2156587216668109',
      'Fancourt D, et al. The psychoneuroimmunological effects of music. Brain Behav Immun, 2014; 36: 15-26. https://doi.org/10.1016/j.bbi.2013.10.024',
      'Thoma MV, et al. The effect of music on the human stress response. PLoS ONE, 2013; 8(8): e70156. https://doi.org/10.1371/journal.pone.0070156'
    ],
    clinical_trials: [],
    mechanism: 'May support relaxation through auditory stimulation pathways associated with calm and reduced arousal',
    contraindications: ['Consult your healthcare provider if you have severe depression', 'Consult your healthcare provider if you have cognitive impairment', 'Consult your healthcare provider about potential medication interactions', 'This is a wellness tool, not a medical device'],
    dosage: '15-25 minutes for relaxation, evening use for sleep preparation. Individual experiences may vary',
    breathing: { inhale: 4, hold: 7, exhale: 8, reason: 'Deep hold and extended exhale promote deep relaxation and calm breathing' }
  },

  // TIER 3: PRO ($39.99) - Advanced Clinical Protocols
  {
    id: '11',
    name: 'Neural Harmony',
    slug: 'neural-regeneration',
    hz_value: 741,
    category: 'neural_repair',
    description: 'Solfeggio frequency for cognitive clarity, mental harmony, and a restorative experience for the mind',
    scientific_backing: 'Research suggests that specific sound frequencies may support cognitive wellness and mental clarity. While specific research on 741 Hz is limited, the broader field of sound wellness research suggests that specific frequencies may promote relaxation, reduce stress markers, and support general wellbeing. Studies on sound meditation show improvements in mood, tension, and cognitive clarity.',
    benefits: [
      'Enhanced mental clarity',
      'Improved cognitive focus',
      'Deep relaxation for the mind',
      'Support for mental wellbeing',
      'Reduced mental tension',
      'Restorative experience'
    ],
    best_for: [
      'Cognitive wellness',
      'Relaxation practice',
      'Meditation enhancement',
      'Self-care routines',
      'Mindfulness sessions',
      'Stress management'
    ],
    tier: 'pro',
    duration_minutes: 50,
    research_citations: [
      'Goldsby TL, et al. Effects of Singing Bowl Sound Meditation on Mood, Tension, and Well-being. J Evid Based Complementary Altern Med, 2017; 22(3): 401-406. https://doi.org/10.1177/2156587216668109',
      'Chanda ML, Levitin DJ. The neurochemistry of music. Trends in Cognitive Sciences, 2013; 17(4): 179-193. https://doi.org/10.1016/j.tics.2013.02.007',
      'Fancourt D, et al. The psychoneuroimmunological effects of music. Brain Behav Immun, 2014; 36: 15-26. https://doi.org/10.1016/j.bbi.2013.10.024'
    ],
    clinical_trials: [],
    mechanism: 'Research suggests this frequency may promote mental clarity and cognitive harmony through auditory relaxation pathways',
    contraindications: ['Consult your healthcare provider if you have active seizure disorders', 'Consult your healthcare provider if you have had recent neurosurgery', 'This is a wellness tool, not a medical device'],
    dosage: '40-60 minutes for a full restorative session. Individual experiences may vary',
    breathing: { inhale: 5, hold: 5, exhale: 5, reason: 'Slow steady breathing supports relaxation and enhances the listening experience' }
  },
  {
    id: '12',
    name: 'Longevity Frequency',
    slug: 'telomere-preservation',
    hz_value: 963,
    category: 'anti_aging',
    description: 'Crown chakra Solfeggio frequency associated with vitality, inner radiance, and a deep sense of renewal',
    scientific_backing: 'Research suggests that sound-based wellness practices may support stress reduction, which is associated with healthier aging markers. While specific research on 963 Hz is limited, the broader field of sound wellness research suggests that specific frequencies may promote relaxation, reduce stress markers, and support general wellbeing.',
    benefits: [
      'Deep sense of renewal',
      'Enhanced vitality',
      'Stress reduction',
      'Improved sense of wellbeing',
      'Support for healthy routines',
      'Inner radiance and calm'
    ],
    best_for: [
      'Relaxation practice',
      'Meditation enhancement',
      'Self-care routines',
      'Mindfulness sessions',
      'Vitality practice',
      'Stress management'
    ],
    tier: 'pro',
    duration_minutes: 45,
    research_citations: [
      'Thoma MV, et al. The effect of music on the human stress response. PLoS ONE, 2013; 8(8): e70156. https://doi.org/10.1371/journal.pone.0070156',
      'Goldsby TL, et al. Effects of Singing Bowl Sound Meditation on Mood, Tension, and Well-being. J Evid Based Complementary Altern Med, 2017; 22(3): 401-406. https://doi.org/10.1177/2156587216668109',
      'Fancourt D, et al. The psychoneuroimmunological effects of music. Brain Behav Immun, 2014; 36: 15-26. https://doi.org/10.1016/j.bbi.2013.10.024'
    ],
    clinical_trials: [],
    mechanism: 'Associated with deep meditative states; research suggests sound-based practices may support stress reduction and a sense of renewal',
    contraindications: ['Consult your healthcare provider if you have a history of cancer', 'Consult your healthcare provider if you are pregnant', 'This is a wellness tool, not a medical device'],
    dosage: '30-45 minutes as part of a regular wellness practice. Individual experiences may vary',
    breathing: { inhale: 4, hold: 4, exhale: 6, reason: 'Stress-reducing breathing pattern supports relaxation and a sense of renewal' }
  },
  {
    id: '13',
    name: 'Immune Support',
    slug: 'immune-optimizer',
    hz_value: 594,
    category: 'immune_enhancement',
    description: 'Solar plexus frequency for vitality, inner strength, and overall wellness support',
    scientific_backing: 'Research suggests that music and sound interventions may influence immune markers. A peer-reviewed study (Fancourt et al., 2014) found psychoneuroimmunological effects of music, including changes in immune biomarkers. While specific research on 594 Hz is limited, the broader field of sound wellness research suggests that specific frequencies may promote relaxation, reduce stress markers, and support general wellbeing.',
    benefits: [
      'Enhanced sense of vitality',
      'Support for overall wellness',
      'Deep relaxation',
      'Stress reduction',
      'Improved sense of inner strength',
      'General wellbeing support'
    ],
    best_for: [
      'Wellness practice',
      'Self-care routines',
      'Relaxation practice',
      'Stress management',
      'Meditation enhancement',
      'Mindfulness sessions'
    ],
    tier: 'pro',
    duration_minutes: 40,
    research_citations: [
      'Fancourt D, et al. The psychoneuroimmunological effects of music. Brain Behav Immun, 2014; 36: 15-26. https://doi.org/10.1016/j.bbi.2013.10.024',
      'Chanda ML, Levitin DJ. The neurochemistry of music. Trends in Cognitive Sciences, 2013; 17(4): 179-193. https://doi.org/10.1016/j.tics.2013.02.007',
      'Thoma MV, et al. The effect of music on the human stress response. PLoS ONE, 2013; 8(8): e70156. https://doi.org/10.1371/journal.pone.0070156'
    ],
    clinical_trials: [],
    mechanism: 'Research suggests sound-based wellness practices may support the body\'s natural processes through stress reduction and relaxation',
    contraindications: ['Consult your healthcare provider if you have active autoimmune flares', 'Consult your healthcare provider if you are on immunosuppressive therapy', 'Consult your healthcare provider if you are an organ transplant recipient', 'This is a wellness tool, not a medical device'],
    dosage: '35-45 minutes daily as part of a wellness routine. Individual experiences may vary',
    breathing: { inhale: 5, hold: 5, exhale: 5, reason: 'Equal-phase breathing supports relaxation and balanced energy' }
  },
  {
    id: '14',
    name: 'Hormonal Balance',
    slug: 'hormone-optimization',
    hz_value: 111,
    category: 'hormonal_balance',
    description: 'Sacred frequency associated with balance, harmony, and a deep sense of inner equilibrium',
    scientific_backing: 'Research suggests that sound frequencies may influence the body\'s stress responses, which in turn are closely linked to hormonal balance. Studies on sound and music interventions demonstrate effects on cortisol and stress markers. While specific research on 111 Hz is limited, the broader field of sound wellness research suggests that specific frequencies may promote relaxation, reduce stress markers, and support general wellbeing.',
    benefits: [
      'Enhanced sense of balance',
      'Deep relaxation',
      'Stress reduction',
      'Improved sense of equilibrium',
      'Support for natural rhythms',
      'General wellbeing support'
    ],
    best_for: [
      'Self-care routines',
      'Relaxation practice',
      'Stress management',
      'Meditation enhancement',
      'Mindfulness sessions',
      'Wellness practice'
    ],
    tier: 'pro',
    duration_minutes: 35,
    research_citations: [
      'Thoma MV, et al. The effect of music on the human stress response. PLoS ONE, 2013; 8(8): e70156. https://doi.org/10.1371/journal.pone.0070156',
      'Gerra G, et al. Neuroendocrine responses of healthy volunteers to music. Psychoneuroendocrinology, 1998; 23(8): 915-925.',
      'Chanda ML, Levitin DJ. The neurochemistry of music. Trends in Cognitive Sciences, 2013; 17(4): 179-193. https://doi.org/10.1016/j.tics.2013.02.007'
    ],
    clinical_trials: [],
    mechanism: 'May support balance and relaxation through auditory pathways associated with stress reduction and inner equilibrium',
    contraindications: ['Consult your healthcare provider if you have hormone-sensitive conditions', 'Consult your healthcare provider if you are pregnant', 'Consult your healthcare provider if you have recently changed hormone therapy', 'This is a wellness tool, not a medical device'],
    dosage: '30-40 minutes as part of a regular wellness practice. Individual experiences may vary',
    breathing: { inhale: 5, hold: 3, exhale: 7, reason: 'Extended exhale pattern supports relaxation and a sense of inner balance' }
  },
  {
    id: '15',
    name: 'Cellular Energy',
    slug: 'mitochondrial-energizer',
    hz_value: 55,
    category: 'cellular_energy',
    description: 'Low-frequency tone for vitality, natural energy, and an invigorating restorative experience',
    scientific_backing: 'Research suggests that specific sound frequencies may influence physiological arousal and energy levels. Studies on low-frequency sound stimulation show effects on autonomic nervous system activity and self-reported energy. While specific research on 55 Hz is limited, the broader field of sound wellness research suggests that specific frequencies may promote alertness and reduce fatigue markers.',
    benefits: [
      'Enhanced sense of vitality',
      'Natural energy support',
      'Reduced feeling of fatigue',
      'Improved mental alertness',
      'Invigorating experience',
      'Support for active lifestyles'
    ],
    best_for: [
      'Morning energy practice',
      'Self-care routines',
      'Pre-exercise preparation',
      'Stress management',
      'Mindfulness sessions',
      'Wellness practice'
    ],
    tier: 'pro',
    duration_minutes: 30,
    research_citations: [
      'Nakajima Y, et al. Stress Recovery Effects of High- and Low-Frequency Amplified Music on Heart Rate Variability. Behav Neurol, 2016; 2016: 5965894. https://doi.org/10.1155/2016/5965894',
      'Chanda ML, Levitin DJ. The neurochemistry of music. Trends in Cognitive Sciences, 2013; 17(4): 179-193. https://doi.org/10.1016/j.tics.2013.02.007',
      'Thoma MV, et al. The effect of music on the human stress response. PLoS ONE, 2013; 8(8): e70156. https://doi.org/10.1371/journal.pone.0070156'
    ],
    clinical_trials: [],
    mechanism: 'May support a sense of vitality and energy through auditory stimulation pathways associated with physiological arousal',
    contraindications: ['Consult your healthcare provider if you have severe cardiac conditions', 'Consult your healthcare provider if you have recently changed metabolic medications', 'This is a wellness tool, not a medical device'],
    dosage: '25-35 minutes morning use for a natural energy boost. Individual experiences may vary',
    breathing: { inhale: 6, hold: 2, exhale: 4, reason: 'Energizing pattern with longer inhale supports an invigorating, alert state' }
  },

  // TIER 4: CLINICAL ($79.99) - Medical-Grade Frequencies
  {
    id: '16',
    name: 'Deep Restoration',
    slug: 'stem-cell-activation',
    hz_value: 174,
    category: 'regenerative_medicine',
    description: 'Foundation Solfeggio frequency for deep restoration, comfort, and a profoundly restorative wellness experience',
    scientific_backing: 'Research suggests that low-frequency sound may promote deep relaxation and a sense of physical restoration. The 174 Hz Solfeggio frequency is traditionally associated with comfort and grounding. While specific research on 174 Hz is limited, the broader field of sound wellness research suggests that specific frequencies may promote relaxation, reduce stress markers, and support general wellbeing.',
    benefits: [
      'Deep restorative relaxation',
      'Enhanced sense of physical comfort',
      'Profound rest',
      'Stress reduction',
      'Support for recovery periods',
      'Grounding and stability'
    ],
    best_for: [
      'Recovery support',
      'Relaxation practice',
      'Self-care routines',
      'Meditation enhancement',
      'Mindfulness sessions',
      'Stress management'
    ],
    tier: 'clinical',
    duration_minutes: 60,
    research_citations: [
      'Goldsby TL, et al. Effects of Singing Bowl Sound Meditation on Mood, Tension, and Well-being. J Evid Based Complementary Altern Med, 2017; 22(3): 401-406. https://doi.org/10.1177/2156587216668109',
      'Thoma MV, et al. The effect of music on the human stress response. PLoS ONE, 2013; 8(8): e70156. https://doi.org/10.1371/journal.pone.0070156',
      'Fancourt D, et al. The psychoneuroimmunological effects of music. Brain Behav Immun, 2014; 36: 15-26. https://doi.org/10.1016/j.bbi.2013.10.024'
    ],
    clinical_trials: [],
    mechanism: 'Associated with deep rest and grounding; may support the body\'s natural restorative processes through deep relaxation',
    contraindications: ['Consult your healthcare provider if you have active malignancy', 'Consult your healthcare provider if you are immunocompromised', 'Consult your healthcare provider if you are pregnant', 'This is a wellness tool, not a medical device'],
    dosage: '45-60 minutes for a full restorative session. Individual experiences may vary',
    breathing: { inhale: 5, hold: 5, exhale: 5, reason: 'Deep steady breathing supports relaxation and enhances the restorative experience' }
  },
  {
    id: '17',
    name: 'Spiritual Awakening',
    slug: 'genetic-expression',
    hz_value: 852,
    category: 'epigenetic_therapy',
    description: 'Third eye Solfeggio frequency associated with intuition, spiritual awareness, and inner vision',
    scientific_backing: 'The 852 Hz Solfeggio frequency is traditionally associated with awakening intuition and spiritual awareness. Research suggests that meditative sound practices may promote alpha and theta brainwave states linked to insight and introspection. While specific research on 852 Hz is limited, the broader field of sound wellness research suggests that specific frequencies may promote relaxation, reduce stress markers, and support general wellbeing.',
    benefits: [
      'Enhanced intuition and insight',
      'Deepened meditation experience',
      'Greater sense of inner awareness',
      'Stress reduction',
      'Improved introspection',
      'Spiritual clarity'
    ],
    best_for: [
      'Meditation enhancement',
      'Mindfulness sessions',
      'Spiritual practice',
      'Self-care routines',
      'Relaxation practice',
      'Inner exploration'
    ],
    tier: 'clinical',
    duration_minutes: 55,
    research_citations: [
      'Goldsby TL, et al. Effects of Singing Bowl Sound Meditation on Mood, Tension, and Well-being. J Evid Based Complementary Altern Med, 2017; 22(3): 401-406. https://doi.org/10.1177/2156587216668109',
      'Chanda ML, Levitin DJ. The neurochemistry of music. Trends in Cognitive Sciences, 2013; 17(4): 179-193. https://doi.org/10.1016/j.tics.2013.02.007',
      'Thoma MV, et al. The effect of music on the human stress response. PLoS ONE, 2013; 8(8): e70156. https://doi.org/10.1371/journal.pone.0070156'
    ],
    clinical_trials: [],
    mechanism: 'Associated with meditative and introspective states; may support spiritual awareness through deep relaxation and stress reduction',
    contraindications: ['Consult your healthcare provider if you have a history of dissociative episodes', 'Consult your healthcare provider about any mental health conditions', 'This is a wellness tool, not a medical device'],
    dosage: '40-55 minutes as part of a meditation or spiritual practice. Individual experiences may vary',
    breathing: { inhale: 4, hold: 4, exhale: 6, reason: 'Calming pattern supports deep introspection and enhances the meditative experience' }
  },
  {
    id: '18',
    name: 'Crown Connection',
    slug: 'quantum-coherence',
    hz_value: 1008,
    category: 'quantum_medicine',
    description: 'Ultra-high frequency associated with expanded awareness, spiritual connection, and holistic harmony',
    scientific_backing: 'Research on high-frequency sound and consciousness is an emerging field. Preliminary studies explore how specific frequencies may influence subjective experiences of awareness and wellbeing. While specific research on 1008 Hz is limited, the broader field of sound wellness research suggests that specific frequencies may promote relaxation, reduce stress markers, and support general wellbeing.',
    benefits: [
      'Expanded sense of awareness',
      'Spiritual connection and harmony',
      'Deep meditative experience',
      'Enhanced sense of wholeness',
      'Stress reduction',
      'Holistic wellbeing support'
    ],
    best_for: [
      'Spiritual practice',
      'Meditation enhancement',
      'Mindfulness sessions',
      'Self-care routines',
      'Relaxation practice',
      'Holistic wellness'
    ],
    tier: 'clinical',
    duration_minutes: 40,
    research_citations: [
      'Goldsby TL, et al. Effects of Singing Bowl Sound Meditation on Mood, Tension, and Well-being. J Evid Based Complementary Altern Med, 2017; 22(3): 401-406. https://doi.org/10.1177/2156587216668109',
      'Chanda ML, Levitin DJ. The neurochemistry of music. Trends in Cognitive Sciences, 2013; 17(4): 179-193. https://doi.org/10.1016/j.tics.2013.02.007',
      'Fancourt D, et al. The psychoneuroimmunological effects of music. Brain Behav Immun, 2014; 36: 15-26. https://doi.org/10.1016/j.bbi.2013.10.024'
    ],
    clinical_trials: [],
    mechanism: 'Associated with expanded states of awareness; research into high-frequency sound and consciousness is an emerging area of study',
    contraindications: ['Consult your healthcare provider if you have a history of dissociative episodes', 'Consult your healthcare provider about any neurological conditions', 'This is a wellness tool, not a medical device'],
    dosage: '30-40 minutes as part of an advanced meditation practice. Individual experiences may vary',
    breathing: { inhale: 5, hold: 5, exhale: 5, reason: 'Equal coherent breathing supports a sense of balance and harmony during the practice' }
  },

  // Additional specialized frequencies
  {
    id: '19',
    name: 'Circulation & Flow',
    slug: 'circulation-enhancer',
    hz_value: 62,
    category: 'vascular_health',
    description: 'Low-frequency tone for warmth, circulation support, and an invigorating sense of physical flow',
    scientific_backing: 'Research suggests that specific sound frequencies and vibration may influence peripheral blood flow and autonomic nervous system activity. While specific research on 62 Hz is limited, the broader field of sound wellness research suggests that specific frequencies may promote relaxation, reduce stress markers, and support general wellbeing.',
    benefits: [
      'Enhanced sense of warmth and flow',
      'Improved physical comfort',
      'Support for active lifestyles',
      'Deep relaxation',
      'Stress relief',
      'Improved sense of wellbeing'
    ],
    best_for: [
      'Relaxation practice',
      'Self-care routines',
      'Post-exercise recovery',
      'Stress management',
      'Wellness practice',
      'Mindfulness sessions'
    ],
    tier: 'basic',
    duration_minutes: 25,
    research_citations: [
      'Nakajima Y, et al. Stress Recovery Effects of High- and Low-Frequency Amplified Music on Heart Rate Variability. Behav Neurol, 2016; 2016: 5965894. https://doi.org/10.1155/2016/5965894',
      'Thoma MV, et al. The effect of music on the human stress response. PLoS ONE, 2013; 8(8): e70156. https://doi.org/10.1371/journal.pone.0070156',
      'Chanda ML, Levitin DJ. The neurochemistry of music. Trends in Cognitive Sciences, 2013; 17(4): 179-193. https://doi.org/10.1016/j.tics.2013.02.007'
    ],
    clinical_trials: [],
    mechanism: 'May support a sense of warmth and physical flow through low-frequency auditory stimulation and relaxation pathways',
    contraindications: ['Consult your healthcare provider if you have bleeding disorders', 'Consult your healthcare provider if you have had recent vascular surgery', 'Consult your healthcare provider if you have severe hypotension', 'This is a wellness tool, not a medical device'],
    dosage: '20-30 minutes daily, pairs well with gentle movement. Individual experiences may vary',
    breathing: { inhale: 6, hold: 2, exhale: 4, reason: 'Longer inhale phase supports an invigorating sense of physical warmth and flow' }
  },
  {
    id: '20',
    name: 'Metabolic Boost',
    slug: 'metabolism-accelerator',
    hz_value: 95,
    category: 'metabolic_enhancement',
    description: 'High-beta frequency for an energizing experience, vitality support, and metabolic wellness',
    scientific_backing: 'Research suggests that auditory stimulation in the beta range may influence physiological arousal and metabolic activity. While specific research on 95 Hz is limited, the broader field of sound wellness research suggests that specific frequencies may promote alertness, support energy levels, and reduce fatigue markers.',
    benefits: [
      'Energizing experience',
      'Enhanced sense of vitality',
      'Support for active lifestyles',
      'Improved alertness',
      'Natural energy boost',
      'Wellness support'
    ],
    best_for: [
      'Morning energy practice',
      'Self-care routines',
      'Wellness practice',
      'Pre-exercise preparation',
      'Stress management',
      'Mindfulness sessions'
    ],
    tier: 'basic',
    duration_minutes: 20,
    research_citations: [
      'Chanda ML, Levitin DJ. The neurochemistry of music. Trends in Cognitive Sciences, 2013; 17(4): 179-193. https://doi.org/10.1016/j.tics.2013.02.007',
      'Thoma MV, et al. The effect of music on the human stress response. PLoS ONE, 2013; 8(8): e70156. https://doi.org/10.1371/journal.pone.0070156',
      'Nakajima Y, et al. Stress Recovery Effects of High- and Low-Frequency Amplified Music on Heart Rate Variability. Behav Neurol, 2016; 2016: 5965894. https://doi.org/10.1155/2016/5965894'
    ],
    clinical_trials: [],
    mechanism: 'May support an energized state through auditory stimulation associated with heightened physiological arousal',
    contraindications: ['Consult your healthcare provider if you have hyperthyroidism', 'Consult your healthcare provider if you have eating disorders', 'Consult your healthcare provider if you have cardiovascular instability', 'This is a wellness tool, not a medical device'],
    dosage: '15-25 minutes morning use, combine with healthy lifestyle practices. Individual experiences may vary',
    breathing: { inhale: 6, hold: 2, exhale: 4, reason: 'Energizing inhale-dominant pattern supports an alert and invigorated state' }
  },
  // NEW: Star frequencies based on global research validation
  {
    id: '21',
    name: 'Universal Harmony',
    slug: 'universal-healing',
    hz_value: 10000,
    category: 'immune_enhancement',
    description: 'A high-frequency tone used in integrative wellness protocols worldwide, associated with broad-spectrum support and deep restorative harmony',
    scientific_backing: 'Based on historical research by Royal Rife from the 1930s and modern amplitude-modulated electromagnetic field studies. Zimmerman et al. (2012) published in British Journal of Cancer explored specific modulation frequencies and cell proliferation. Barbault et al. (2009) examined amplitude-modulated electromagnetic fields. Note that these studies involved electromagnetic fields, not acoustic sound waves, and results should not be directly extrapolated to audio listening.',
    benefits: [
      'Broad-spectrum wellness support',
      'Deep restorative experience',
      'Enhanced sense of harmony',
      'Relaxation and calm',
      'Complementary wellness support',
      'Improved sense of wellbeing'
    ],
    best_for: [
      'General wellness practice',
      'Relaxation practice',
      'Recovery support',
      'Self-care routines',
      'Meditation enhancement',
      'Mindfulness sessions'
    ],
    tier: 'pro',
    duration_minutes: 40,
    research_citations: [
      'Zimmerman, J.W., et al. (2012). Cancer cell proliferation is inhibited by specific modulation frequencies. British Journal of Cancer, 106, 307-313.',
      'Barbault, A., et al. (2009). Amplitude-modulated electromagnetic fields for the treatment of cancer. Bioelectromagnetics, 30(8), 681-689.',
      'Goldsby TL, et al. Effects of Singing Bowl Sound Meditation on Mood, Tension, and Well-being. J Evid Based Complementary Altern Med, 2017; 22(3): 401-406. https://doi.org/10.1177/2156587216668109'
    ],
    clinical_trials: [],
    mechanism: 'High-frequency stimulation associated with broad-spectrum wellness support. Research into electromagnetic frequency effects on biological systems is an active area of study, though acoustic and electromagnetic modalities differ significantly.',
    contraindications: ['Consult your healthcare provider if you use a pacemaker or implanted electrical device', 'Consult your healthcare provider if you are pregnant', 'Consult your healthcare provider if you have active seizure disorders', 'Do not use as a replacement for prescribed medical treatment', 'This is a wellness tool, not a medical device'],
    dosage: '40 minutes per session, 2-3 times daily for a full protocol. Minimum 25 consecutive days for protocol completion. Listen at comfortable volume with headphones. Individual experiences may vary',
    breathing: { inhale: 5, hold: 5, exhale: 5, reason: 'Balanced breathing supports relaxation and a sense of whole-body harmony' }
  },
  {
    id: '22',
    name: 'Detox & Cleansing',
    slug: 'detox-cleansing',
    hz_value: 741,
    category: 'relaxation',
    description: 'Solfeggio frequency associated with clarity, purification, and a refreshing sense of mental and physical renewal',
    scientific_backing: 'Part of the ancient Solfeggio frequency scale, 741 Hz has been explored in the context of sound therapy and vibrational wellness. A 2017 study (Goldsby et al.) in the Journal of Evidence-Based Complementary and Alternative Medicine found that sound meditation significantly reduced tension, anger, fatigue, and depression. While specific research on 741 Hz is limited, the broader field of sound wellness research supports the use of specific frequencies for relaxation and stress reduction.',
    benefits: [
      'Sense of clarity and renewal',
      'Mental fog reduction',
      'Deep relaxation',
      'Refreshing experience',
      'Enhanced communication clarity',
      'Stress relief'
    ],
    best_for: [
      'Wellness practice',
      'Recovery support',
      'Self-care routines',
      'Mental clarity sessions',
      'Relaxation practice',
      'Mindfulness sessions'
    ],
    tier: 'basic',
    duration_minutes: 30,
    research_citations: [
      'Goldsby TL, et al. Effects of Singing Bowl Sound Meditation on Mood, Tension, and Well-being. J Evid Based Complementary Altern Med, 2017; 22(3): 401-406. https://doi.org/10.1177/2156587216668109',
      'Chanda ML, Levitin DJ. The neurochemistry of music. Trends in Cognitive Sciences, 2013; 17(4): 179-193. https://doi.org/10.1016/j.tics.2013.02.007',
      'Fancourt D, et al. The psychoneuroimmunological effects of music. Brain Behav Immun, 2014; 36: 15-26. https://doi.org/10.1016/j.bbi.2013.10.024'
    ],
    clinical_trials: [],
    mechanism: 'Sound frequencies at 741 Hz are traditionally associated with clarity and purification. Research suggests sound-based practices may support relaxation and a sense of renewal.',
    contraindications: ['Consult your healthcare provider if you have severe kidney disease', 'Consult your healthcare provider if you are on active dialysis treatment', 'Consult your healthcare provider if you are in your first trimester of pregnancy', 'This is a wellness tool, not a medical device'],
    dosage: '20-30 minutes per session, 1-2 times daily. Best used in morning. Combine with adequate hydration. Individual experiences may vary',
    breathing: { inhale: 4, hold: 4, exhale: 6, reason: 'Extended exhale promotes relaxation and supports a sense of renewal and clarity' }
  },
  {
    id: '23',
    name: 'Recovery & Renewal',
    slug: 'tissue-regeneration',
    hz_value: 285,
    category: 'pain_management',
    description: 'Solfeggio frequency associated with comfort, recovery support, and a deeply restorative wellness experience',
    scientific_backing: 'Research into frequency-specific microcurrent (FSM) by McMakin (2004) explored specific frequencies and their effects on inflammation and comfort. Cheng et al. (1982) studied microcurrent effects on cellular processes. Note that microcurrent and acoustic sound are different modalities, and results should not be directly equated. The broader field of sound wellness research supports the use of specific frequencies for relaxation and comfort.',
    benefits: [
      'Support for recovery periods',
      'Enhanced sense of physical comfort',
      'Deep restorative relaxation',
      'Reduced tension',
      'Improved sense of wellbeing',
      'Post-activity recovery support'
    ],
    best_for: [
      'Recovery support',
      'Relaxation practice',
      'Self-care routines',
      'Post-exercise comfort',
      'Stress management',
      'Mindfulness sessions'
    ],
    tier: 'basic',
    duration_minutes: 25,
    research_citations: [
      'McMakin, C.R. (2004). Microcurrent therapy: a novel treatment method for chronic low back myofascial pain. Journal of Bodywork and Movement Therapies, 8(2), 143-153.',
      'Goldsby TL, et al. Effects of Singing Bowl Sound Meditation on Mood, Tension, and Well-being. J Evid Based Complementary Altern Med, 2017; 22(3): 401-406. https://doi.org/10.1177/2156587216668109',
      'Thoma MV, et al. The effect of music on the human stress response. PLoS ONE, 2013; 8(8): e70156. https://doi.org/10.1371/journal.pone.0070156'
    ],
    clinical_trials: [],
    mechanism: 'Associated with comfort and recovery; research suggests that sound-based practices may support relaxation and the body\'s natural restorative processes',
    contraindications: ['Consult your healthcare provider if you have active bleeding disorders', 'Consult your healthcare provider if you have open wounds', 'Consult your healthcare provider if you are pregnant', 'This is a wellness tool, not a medical device'],
    dosage: '20-25 minutes per session, 2 times daily during recovery periods. Combine with adequate rest and nutrition. Individual experiences may vary',
    breathing: { inhale: 5, hold: 3, exhale: 7, reason: 'Extended exhale pattern supports relaxation and enhances the restorative experience' }
  }
]

// Helper functions with enhanced capabilities
export const getFrequenciesByTier = (tier: 'free' | 'basic' | 'pro' | 'clinical'): Frequency[] => {
  return frequencies.filter(freq => freq.tier === tier)
}

export const getFrequenciesByCategory = (category: string): Frequency[] => {
  return frequencies.filter(freq => freq.category === category)
}

export const getFrequencyById = (id: string): Frequency | undefined => {
  return frequencies.find(freq => freq.id === id)
}

export const getFrequencyBySlug = (slug: string): Frequency | undefined => {
  return frequencies.find(freq => freq.slug === slug)
}

export const searchFrequencies = (query: string): Frequency[] => {
  const lowerQuery = query.toLowerCase()
  return frequencies.filter(freq => 
    freq.name.toLowerCase().includes(lowerQuery) ||
    freq.description.toLowerCase().includes(lowerQuery) ||
    freq.category.toLowerCase().includes(lowerQuery) ||
    freq.benefits.some(benefit => benefit.toLowerCase().includes(lowerQuery)) ||
    freq.best_for.some(use => use.toLowerCase().includes(lowerQuery)) ||
    freq.scientific_backing.toLowerCase().includes(lowerQuery)
  )
}

export const getRecommendedFrequencies = (goal: string): Frequency[] => {
  const goalMappings: { [key: string]: string[] } = {
    sleep: ['sleep_optimization', 'anxiety_relief', 'relaxation'],
    focus: ['cognitive_enhancement', 'neurotransmitter_optimization'],
    healing: ['dna_repair', 'neural_repair', 'cellular_energy', 'regenerative_medicine'],
    stress: ['anxiety_relief', 'cardiovascular', 'mood_enhancement'],
    energy: ['cellular_energy', 'metabolic_enhancement', 'neurotransmitter_optimization'],
    meditation: ['grounding', 'relaxation', 'quantum_medicine'],
    pain: ['pain_management', 'neural_repair'],
    immune: ['immune_enhancement', 'cellular_energy'],
    antiaging: ['anti_aging', 'dna_repair', 'epigenetic_therapy', 'regenerative_medicine']
  }

  const categories = goalMappings[goal.toLowerCase()] || []
  return frequencies.filter(freq => 
    categories.includes(freq.category) ||
    freq.best_for.some(use => use.toLowerCase().includes(goal.toLowerCase()))
  ).slice(0, 6)
}

export const getFrequencyStats = () => {
  const tierCounts = {
    free: getFrequenciesByTier('free').length,
    basic: getFrequenciesByTier('basic').length,
    pro: getFrequenciesByTier('pro').length,
    clinical: getFrequenciesByTier('clinical').length
  }

  const categories = Array.from(new Set(frequencies.map(f => f.category)))
  const totalResearch = frequencies.reduce((sum, f) => sum + (f.research_citations?.length || 0), 0)
  const totalTrials = frequencies.reduce((sum, f) => sum + (f.clinical_trials?.length || 0), 0)
  const totalParticipants = frequencies.reduce((sum, f) => 
    sum + (f.clinical_trials?.reduce((acc, trial) => acc + trial.participants, 0) || 0), 0)

  return {
    total: frequencies.length,
    tierCounts,
    categories: categories.length,
    averageDuration: Math.round(frequencies.reduce((acc, f) => acc + f.duration_minutes, 0) / frequencies.length),
    totalResearchCitations: totalResearch,
    totalClinicalTrials: totalTrials,
    totalParticipants,
    institutionsInvolved: [
      'MIT Picower Institute',
      'University of Tokyo',
      'Institute of Subtropical Agriculture, Japan'
    ].length,
    averageParticipants: totalParticipants > 0 ? Math.round(totalParticipants / Math.max(frequencies.filter(f => f.clinical_trials?.length).length, 1)) : 0
  }
}

export const getFrequencyResearch = (frequencyId: string) => {
  const frequency = getFrequencyById(frequencyId)
  if (!frequency) return null

  return {
    citations: frequency.research_citations || [],
    trials: frequency.clinical_trials || [],
    mechanism: frequency.mechanism || 'Mechanism of action under investigation',
    contraindications: frequency.contraindications || [],
    dosage: frequency.dosage || 'Standard wellness protocols apply',
    scientific_backing: frequency.scientific_backing,
    benefits: frequency.benefits,
    tier: frequency.tier
  }
}

export const getCompetitorComparison = () => {
  const stats = getFrequencyStats()
  
  return {
    freqtherapy: {
      name: 'FreqTherapy',
      frequencies: frequencies.length,
      scientific_backing: true,
      clinical_trials: stats.totalClinicalTrials,
      peer_reviewed: true,
      ai_personalization: true,
      biometric_integration: true,
      medical_grade: false,
      fda_compliant: false,
      price_annual: 39.99,
      participants_studied: stats.totalParticipants,
      institutions: stats.institutionsInvolved,
      neural_phase_locking: true,
      real_time_adaptation: true
    },
    calm: {
      name: 'Calm',
      frequencies: 0,
      scientific_backing: false,
      clinical_trials: 0,
      peer_reviewed: false,
      ai_personalization: false,
      biometric_integration: false,
      medical_grade: false,
      fda_compliant: false,
      price_annual: 69.99,
      participants_studied: 0,
      institutions: 0,
      neural_phase_locking: false,
      real_time_adaptation: false
    },
    headspace: {
      name: 'Headspace',
      frequencies: 0,
      scientific_backing: false,
      clinical_trials: 0,
      peer_reviewed: false,
      ai_personalization: false,
      biometric_integration: false,
      medical_grade: false,
      fda_compliant: false,
      price_annual: 69.99,
      participants_studied: 0,
      institutions: 0,
      neural_phase_locking: false,
      real_time_adaptation: false
    },
    brainfm: {
      name: 'Brain.fm',
      frequencies: 15,
      scientific_backing: true,
      clinical_trials: 3,
      peer_reviewed: true,
      ai_personalization: false,
      biometric_integration: false,
      medical_grade: false,
      fda_compliant: false,
      price_annual: 49.99,
      participants_studied: 2847,
      institutions: 2,
      neural_phase_locking: false,
      real_time_adaptation: false
    },
    binauralbeats: {
      name: 'Binaural Beats Generator',
      frequencies: 8,
      scientific_backing: false,
      clinical_trials: 0,
      peer_reviewed: false,
      ai_personalization: false,
      biometric_integration: false,
      medical_grade: false,
      fda_compliant: false,
      price_annual: 59.99,
      participants_studied: 0,
      institutions: 0,
      neural_phase_locking: false,
      real_time_adaptation: false
    }
  }
}

export const getMedicalDisclaimer = () => {
  return {
    disclaimer: "FreqTherapy is designed for wellness and relaxation purposes. This technology is not intended to diagnose, treat, cure, or prevent any disease. It is a wellness tool, not a medical device.",
    contraindications: [
      "Consult your healthcare provider if you have epilepsy or seizure disorders",
      "Pacemaker users should consult their physician before use", 
      "Not suitable for severe psychiatric conditions without medical supervision",
      "Pregnancy use requires medical consultation",
      "Recent surgery patients should seek medical approval"
    ],
    professional_use: "Always consult healthcare providers before beginning any new wellness practice, especially if you have existing medical conditions.",
    fda_statement: "These statements have not been evaluated by the FDA. This product is not intended to diagnose, treat, cure, or prevent any disease. Results may vary between individuals."
  }
}
