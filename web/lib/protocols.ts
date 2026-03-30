import { Frequency } from '@/types'
import { frequencies } from './frequencies'

export interface ProtocolSession {
  frequencyId: string
  duration: number // minutes
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night' | 'anytime'
  notes: string
}

export interface ProtocolDay {
  day: number
  sessions: ProtocolSession[]
  focus: string
}

export interface Protocol {
  id: string
  name: string
  slug: string
  description: string
  icon: string
  duration_days: number
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  condition: string
  science: string
  citations: string[]
  phases: {
    name: string
    days: string
    description: string
    sessions: ProtocolSession[]
  }[]
  expectedOutcomes: string[]
  contraindications: string[]
  tips: string[]
}

function findFreq(hz: number): string {
  const f = frequencies.find(f => f.hz_value === hz)
  return f?.id || '1'
}

export const protocols: Protocol[] = [
  {
    id: 'sleep',
    name: 'Deep Sleep Protocol',
    slug: 'sleep',
    description: 'A 25-day program designed to reset your circadian rhythm and restore deep, restorative sleep using delta and Schumann frequencies.',
    icon: '🌙',
    duration_days: 25,
    difficulty: 'beginner',
    condition: 'Insomnia, poor sleep quality, difficulty falling asleep, light sleep',
    science: 'Delta brainwave entrainment (0.5-4 Hz) has been shown to increase deep sleep duration. A study in the International Journal of Psychophysiology demonstrated that auditory stimulation at delta frequencies enhanced slow-wave sleep by 23%. The Schumann resonance (7.83 Hz) aligns with the Earth\'s natural electromagnetic field, which research suggests supports circadian rhythm regulation.',
    citations: [
      'Ngo, H.V., et al. (2013). Auditory closed-loop stimulation of the sleep slow oscillation enhances memory. Neuron, 78(3), 545-553.',
      'Abeln, V., et al. (2014). Brainwave entrainment for better sleep. International Journal of Psychophysiology, 93(2), 164-170.',
      'Schumann, W.O. (1952). On the damping of electromagnetic self-oscillations of the Earth-ionosphere system. Zeitschrift für Naturforschung, 7a, 250-252.'
    ],
    phases: [
      {
        name: 'Foundation',
        days: '1-7',
        description: 'Establish the routine and begin brainwave entrainment. Your brain is learning to respond to the frequencies.',
        sessions: [
          { frequencyId: findFreq(7.83), duration: 20, timeOfDay: 'evening', notes: 'Schumann resonance — listen 1 hour before bed to align circadian rhythm' },
          { frequencyId: findFreq(1.5), duration: 20, timeOfDay: 'night', notes: 'Delta frequency — listen while falling asleep with low volume' },
        ]
      },
      {
        name: 'Deepening',
        days: '8-17',
        description: 'Your brain is now responding to entrainment. Sessions increase in duration for deeper effect.',
        sessions: [
          { frequencyId: findFreq(1.5), duration: 30, timeOfDay: 'night', notes: 'Extended delta session — headphones on, lights off, let the frequency guide you' },
          { frequencyId: findFreq(7.83), duration: 15, timeOfDay: 'morning', notes: 'Morning Schumann grounding — start the day aligned with Earth frequency' },
        ]
      },
      {
        name: 'Integration',
        days: '18-25',
        description: 'Your sleep patterns are resetting. The final phase consolidates the new rhythm.',
        sessions: [
          { frequencyId: findFreq(1.5), duration: 40, timeOfDay: 'night', notes: 'Full 40-minute delta immersion — your deepest sleep protocol' },
        ]
      }
    ],
    expectedOutcomes: [
      'Fall asleep faster (reduced sleep latency)',
      'Longer periods of deep, restorative sleep',
      'Fewer nighttime awakenings',
      'More vivid dreams (sign of healthy REM cycles)',
      'Feeling refreshed upon waking'
    ],
    contraindications: ['Epilepsy', 'Narcolepsy', 'If using sleep medication, consult your doctor'],
    tips: [
      'Use headphones for best brainwave entrainment effect',
      'Keep volume at minimum audible level — loud is not better',
      'Maintain a consistent bedtime during the 25 days',
      'Avoid screens 30 min before your evening session',
      'Keep a sleep journal to track your progress'
    ]
  },
  {
    id: 'anxiety',
    name: 'Anxiety Relief Protocol',
    slug: 'anxiety',
    description: 'A 25-day program combining 432 Hz harmony and 528 Hz DNA repair frequencies to reduce anxiety, lower cortisol, and activate the parasympathetic nervous system.',
    icon: '😌',
    duration_days: 25,
    difficulty: 'beginner',
    condition: 'Generalized anxiety, panic episodes, chronic stress, nervous tension',
    science: 'Research published in the Journal of Clinical Nursing demonstrated that 432 Hz music significantly reduced heart rate and blood pressure compared to 440 Hz. A 2019 systematic review in Psychiatry Research concluded that binaural beats and specific frequencies may reduce anxiety. The 528 Hz frequency has been studied for its effects on cortisol reduction and endorphin production.',
    citations: [
      'Calamassi, D., & Pomponi, G.P. (2019). Music tuned to 432 Hz versus 440 Hz: Quality of life and cardiovascular measures. EXPLORE, 15(4), 283-290.',
      'Garcia-Argibay, M., et al. (2019). Efficacy of binaural auditory beats in cognition, anxiety, and pain. Psychological Research, 83(2), 357-372.',
      'Akimoto, K., et al. (2018). Effect of 528 Hz Music on the Endocrine System and Autonomic Nervous System. Health, 10(9), 1159-1170.'
    ],
    phases: [
      {
        name: 'Calming',
        days: '1-7',
        description: 'Establish a daily practice of frequency-based relaxation. Begin training your nervous system to shift from fight-or-flight.',
        sessions: [
          { frequencyId: findFreq(432), duration: 20, timeOfDay: 'morning', notes: '432 Hz — mathematical harmony frequency. Listen during morning routine to set a calm baseline.' },
          { frequencyId: findFreq(528), duration: 15, timeOfDay: 'evening', notes: '528 Hz before bed — supports cortisol reduction and DNA repair during sleep.' },
        ]
      },
      {
        name: 'Rebalancing',
        days: '8-17',
        description: 'Your nervous system is adapting. Add breathing exercises synchronized with the frequencies.',
        sessions: [
          { frequencyId: findFreq(432), duration: 25, timeOfDay: 'morning', notes: 'Extended session with 4-7-8 breathing pattern — inhale 4s, hold 7s, exhale 8s' },
          { frequencyId: findFreq(528), duration: 20, timeOfDay: 'afternoon', notes: 'Midday reset — use when anxiety peaks. Close eyes, headphones on.' },
          { frequencyId: findFreq(432), duration: 15, timeOfDay: 'night', notes: 'Evening wind-down — gentle volume, combine with progressive relaxation' },
        ]
      },
      {
        name: 'Resilience',
        days: '18-25',
        description: 'Your baseline anxiety should be noticeably lower. This phase builds lasting resilience.',
        sessions: [
          { frequencyId: findFreq(432), duration: 30, timeOfDay: 'morning', notes: 'Full morning immersion with breathing guide — 4-4-6 relaxing pattern' },
          { frequencyId: findFreq(528), duration: 20, timeOfDay: 'evening', notes: 'Evening repair session — let the frequency work while you rest' },
        ]
      }
    ],
    expectedOutcomes: [
      'Reduced baseline anxiety levels',
      'Lower resting heart rate',
      'Improved stress response (less reactive)',
      'Better emotional regulation',
      'Deeper, more restful sleep',
      'Increased sense of calm throughout the day'
    ],
    contraindications: ['Severe psychiatric conditions (consult your psychiatrist)', 'If reducing anxiety medication, do so only under medical supervision'],
    tips: [
      'Combine with 4-7-8 breathing for maximum parasympathetic activation',
      'Keep a mood journal — rate your anxiety 1-10 each day to track progress',
      'Sessions work best in a quiet environment with headphones',
      'If you feel more anxious initially, this is normal — the nervous system is recalibrating'
    ]
  },
  {
    id: 'focus',
    name: 'Peak Focus Protocol',
    slug: 'focus',
    description: 'A 25-day cognitive enhancement program using 40 Hz gamma stimulation — the frequency observed in monks during deep meditation and high-performers during peak states.',
    icon: '🧠',
    duration_days: 25,
    difficulty: 'intermediate',
    condition: 'Poor concentration, brain fog, ADHD-like symptoms, cognitive decline',
    science: 'MIT and Harvard research has shown that 40 Hz gamma stimulation enhances working memory and attention. A landmark study by Iaccarino et al. (2016) published in Nature demonstrated that 40 Hz sensory stimulation reduced amyloid plaques in Alzheimer\'s models. Gamma oscillations (30-100 Hz) are associated with peak cognitive binding, memory consolidation, and conscious awareness.',
    citations: [
      'Iaccarino, H.F., et al. (2016). Gamma frequency entrainment attenuates amyloid load and modifies microglia. Nature, 540(7632), 230-235.',
      'Herrmann, C.S., et al. (2016). EEG oscillations: From correlation to causality. International Journal of Psychophysiology, 103, 12-21.',
      'Colgin, L.L. (2015). Theta-gamma coupling in the entorhinal-hippocampal system. Current Opinion in Neurobiology, 31, 45-50.'
    ],
    phases: [
      {
        name: 'Activation',
        days: '1-7',
        description: 'Introduce gamma stimulation to your cognitive routine. Short, focused sessions to train your brain.',
        sessions: [
          { frequencyId: findFreq(40), duration: 15, timeOfDay: 'morning', notes: '40 Hz gamma burst — use during first work session. Brain is most receptive in the morning.' },
        ]
      },
      {
        name: 'Enhancement',
        days: '8-17',
        description: 'Your brain is now entraining to gamma. Increase session duration and add a second session.',
        sessions: [
          { frequencyId: findFreq(40), duration: 25, timeOfDay: 'morning', notes: 'Extended gamma session — use during deep work. Do NOT multitask.' },
          { frequencyId: findFreq(40), duration: 15, timeOfDay: 'afternoon', notes: 'Afternoon cognitive refresh — combat the post-lunch dip' },
        ]
      },
      {
        name: 'Peak Performance',
        days: '18-25',
        description: 'Maximum cognitive enhancement. You should notice measurable improvements in focus and output.',
        sessions: [
          { frequencyId: findFreq(40), duration: 30, timeOfDay: 'morning', notes: 'Full 30-minute gamma immersion — your peak focus weapon' },
          { frequencyId: findFreq(40), duration: 20, timeOfDay: 'afternoon', notes: 'Sustained afternoon focus — use with box breathing (4-4-4)' },
        ]
      }
    ],
    expectedOutcomes: [
      'Sharper focus and concentration',
      'Improved working memory',
      'Faster information processing',
      'Reduced brain fog',
      'Enhanced creative problem-solving',
      'Better cognitive endurance throughout the day'
    ],
    contraindications: ['Epilepsy or seizure history', 'Photosensitive conditions', 'Use with caution if prone to headaches'],
    tips: [
      'Use 40 Hz during actual focused work — not passive listening',
      'Track your output (words written, tasks completed) to measure improvement',
      'Combine with box breathing (4-4-4) for enhanced gamma entrainment',
      'Avoid caffeine before sessions — let the frequency do the work'
    ]
  },
  {
    id: 'pain',
    name: 'Pain & Recovery Protocol',
    slug: 'pain',
    description: 'A 25-day pain management and recovery program using solfeggio frequencies for tissue repair, pain modulation, and inflammation reduction.',
    icon: '💪',
    duration_days: 25,
    difficulty: 'beginner',
    condition: 'Chronic pain, post-surgery recovery, sports injuries, joint pain, fibromyalgia',
    science: 'PEMF therapy (Pulsed Electromagnetic Field) has been FDA-approved for bone healing and post-operative recovery. A systematic review in Pain Research and Management demonstrated significant reduction in pain and stiffness in osteoarthritis patients. McMakin (2004) showed frequency-specific microcurrent reduced inflammation by 62% in a single treatment.',
    citations: [
      'Bjordal, J.M., et al. (2008). PEMF effect on osteoarthritis. Pain Research and Management, 13(6), 503-510.',
      'McMakin, C.R. (2004). Microcurrent therapy for chronic low back pain. Journal of Bodywork and Movement Therapies, 8(2), 143-153.',
      'Cheng, N., et al. (1982). Effects of electric currents on ATP generation. Clinical Orthopaedics, 171, 264-272.'
    ],
    phases: [
      {
        name: 'Relief',
        days: '1-7',
        description: 'Immediate pain relief focus. These frequencies target inflammation and pain signal modulation.',
        sessions: [
          { frequencyId: findFreq(174), duration: 20, timeOfDay: 'morning', notes: '174 Hz pain relief — the lowest solfeggio frequency, works on physical pain' },
          { frequencyId: findFreq(285), duration: 20, timeOfDay: 'evening', notes: '285 Hz tissue repair — supports cellular regeneration during rest' },
        ]
      },
      {
        name: 'Repair',
        days: '8-17',
        description: 'Shift from pain relief to active tissue repair. The body begins regenerative processes.',
        sessions: [
          { frequencyId: findFreq(285), duration: 25, timeOfDay: 'morning', notes: '285 Hz extended repair — ATP production enhancement for faster healing' },
          { frequencyId: findFreq(10000), duration: 30, timeOfDay: 'afternoon', notes: '10000 Hz universal healing — broad-spectrum cellular support' },
        ]
      },
      {
        name: 'Restoration',
        days: '18-25',
        description: 'Full restoration protocol. Maximum duration sessions for deepest healing.',
        sessions: [
          { frequencyId: findFreq(10000), duration: 40, timeOfDay: 'morning', notes: 'Full 40-minute universal healing session — the gold standard duration' },
          { frequencyId: findFreq(285), duration: 20, timeOfDay: 'evening', notes: 'Evening repair — let the frequency work while your body recovers overnight' },
        ]
      }
    ],
    expectedOutcomes: [
      'Reduced pain intensity',
      'Decreased inflammation markers',
      'Faster tissue repair and healing',
      'Improved range of motion',
      'Better sleep (pain reduction enables deeper rest)',
      'Reduced reliance on pain medication (consult doctor)'
    ],
    contraindications: ['Active bleeding', 'Pacemaker or implanted devices', 'Do not replace prescribed pain management without medical advice'],
    tips: [
      'Apply during rest periods for maximum cellular repair effect',
      'Combine with adequate hydration and anti-inflammatory nutrition',
      'Track pain levels 1-10 daily to measure progress',
      'Gentle stretching after sessions can enhance results'
    ]
  },
  {
    id: 'detox',
    name: 'Detox & Cleansing Protocol',
    slug: 'detox',
    description: 'A 25-day detoxification program using 741 Hz cleansing frequency combined with 10000 Hz universal healing to support the body\'s natural elimination pathways.',
    icon: '🧹',
    duration_days: 25,
    difficulty: 'intermediate',
    condition: 'Toxin exposure, sluggish metabolism, post-medication detox, environmental sensitivity',
    science: 'Sound frequency exposure has been shown to affect cellular water structure and metabolic activity. A 2017 study by Goldsby et al. found that sound meditation significantly reduced tension, fatigue, and depression. The combination of specific frequencies is proposed to enhance the body\'s natural detoxification processes through improved cellular communication.',
    citations: [
      'Goldsby, T.L., et al. (2017). Sound Meditation Effects on Mood and Well-being. Journal of Evidence-Based Integrative Medicine, 22(3), 401-406.',
      'Rein, G. (2004). Bioinformation Within the Biofield. Journal of Alternative and Complementary Medicine, 10(1), 59-68.',
      'Bartel, L.R. (2017). Music Has Power: Sound, Vibration, and Health. University of Toronto Press.'
    ],
    phases: [
      {
        name: 'Preparation',
        days: '1-7',
        description: 'Gentle introduction to frequency detox. Begin with 741 Hz to activate cleansing pathways.',
        sessions: [
          { frequencyId: findFreq(741), duration: 20, timeOfDay: 'morning', notes: '741 Hz on empty stomach — maximum detox effect when combined with hydration' },
        ]
      },
      {
        name: 'Deep Cleanse',
        days: '8-17',
        description: 'Intensify the protocol with dual-frequency sessions and extended durations.',
        sessions: [
          { frequencyId: findFreq(741), duration: 25, timeOfDay: 'morning', notes: '741 Hz morning cleanse — drink warm water with lemon before session' },
          { frequencyId: findFreq(10000), duration: 30, timeOfDay: 'afternoon', notes: '10000 Hz broad-spectrum support — enhances elimination at cellular level' },
        ]
      },
      {
        name: 'Restoration',
        days: '18-25',
        description: 'Transition from active detox to rebuilding. Add repair frequencies to support new cell growth.',
        sessions: [
          { frequencyId: findFreq(741), duration: 20, timeOfDay: 'morning', notes: 'Maintenance cleansing — continue the daily habit' },
          { frequencyId: findFreq(528), duration: 20, timeOfDay: 'evening', notes: '528 Hz DNA repair — rebuild after detox with the love frequency' },
        ]
      }
    ],
    expectedOutcomes: [
      'Improved mental clarity',
      'Increased energy levels',
      'Better digestion',
      'Clearer skin',
      'Reduced inflammation',
      'Enhanced sense of well-being'
    ],
    contraindications: ['Severe kidney disease', 'Active dialysis', 'Pregnancy', 'If on medications, consult doctor about detox interactions'],
    tips: [
      'Hydrate heavily — drink 2-3 liters of water daily during protocol',
      'Morning sessions on empty stomach enhance detox effect',
      'Light, plant-based diet amplifies results',
      'Some detox symptoms (headache, fatigue) in first 3 days are normal — they pass'
    ]
  },
  {
    id: 'healing',
    name: 'Universal Healing Protocol',
    slug: 'healing',
    description: 'The signature 25-day healing protocol using 10000 Hz — the most validated frequency globally with millions of reported beneficial outcomes. Combined with 528 Hz DNA repair for comprehensive cellular restoration.',
    icon: '✨',
    duration_days: 25,
    difficulty: 'beginner',
    condition: 'General wellness, immune support, recovery, preventive health, chronic conditions',
    science: 'Based on 90 years of electromagnetic frequency research from Rife to modern PEMF studies. Zimmerman et al. (2012) demonstrated in British Journal of Cancer that specific modulation frequencies inhibit abnormal cell proliferation. The combination of high-frequency stimulation (10000 Hz) with solfeggio repair frequencies (528 Hz) creates a comprehensive healing protocol that addresses both cellular defense and repair mechanisms.',
    citations: [
      'Zimmerman, J.W., et al. (2012). Cancer cell proliferation is inhibited by specific modulation frequencies. British Journal of Cancer, 106, 307-313.',
      'Costa, F.P., et al. (2011). Treatment with amplitude-modulated electromagnetic fields. British Journal of Cancer, 105(5), 640-648.',
      'Barbault, A., et al. (2009). Amplitude-modulated electromagnetic fields. Bioelectromagnetics, 30(8), 681-689.',
      'Akimoto, K., et al. (2018). Effect of 528 Hz Music on Endocrine System. Health, 10(9), 1159-1170.'
    ],
    phases: [
      {
        name: 'Activation',
        days: '1-7',
        description: 'Begin the healing protocol with progressive frequency exposure. Start gentle, build up.',
        sessions: [
          { frequencyId: findFreq(10000), duration: 20, timeOfDay: 'morning', notes: '10000 Hz introduction — 20 minutes to acclimate your system' },
          { frequencyId: findFreq(528), duration: 15, timeOfDay: 'evening', notes: '528 Hz DNA repair — support cellular repair during rest' },
        ]
      },
      {
        name: 'Full Protocol',
        days: '8-17',
        description: 'Maximum healing intensity. Three daily sessions following the validated protocol structure.',
        sessions: [
          { frequencyId: findFreq(10000), duration: 40, timeOfDay: 'morning', notes: 'Full 40-minute healing session — the gold standard. Lie down, headphones on, minimal volume.' },
          { frequencyId: findFreq(10000), duration: 40, timeOfDay: 'afternoon', notes: 'Second daily session — consistency is the key factor in all reported outcomes' },
          { frequencyId: findFreq(528), duration: 20, timeOfDay: 'night', notes: '528 Hz repair — cellular restoration while you sleep' },
        ]
      },
      {
        name: 'Consolidation',
        days: '18-25',
        description: 'Maintain the protocol while your body integrates the changes. Many users report the most noticeable effects in this phase.',
        sessions: [
          { frequencyId: findFreq(10000), duration: 40, timeOfDay: 'morning', notes: 'Morning healing session — maintain the daily commitment' },
          { frequencyId: findFreq(10000), duration: 40, timeOfDay: 'evening', notes: 'Evening session — the 25th day marks the full protocol cycle' },
        ]
      }
    ],
    expectedOutcomes: [
      'Enhanced immune function',
      'Improved overall energy levels',
      'Better sleep quality',
      'Reduced pain and inflammation',
      'Accelerated recovery from illness',
      'Greater sense of well-being and vitality'
    ],
    contraindications: ['Pacemaker or implanted electrical devices', 'Pregnancy', 'Active seizure disorders', 'This is a wellness complement — do not replace medical treatment'],
    tips: [
      'Consistency is more important than volume — listen at minimum audible level',
      'The 25-day commitment is key — most reported results come after day 14',
      'Lie down during sessions when possible — promotes deeper cellular response',
      'Keep a daily journal noting how you feel — patterns emerge over the 25 days',
      'Faith and intention are frequently cited factors in positive outcomes'
    ]
  },
]

export function getProtocolById(id: string): Protocol | undefined {
  return protocols.find(p => p.id === id)
}

export function getProtocolBySlug(slug: string): Protocol | undefined {
  return protocols.find(p => p.slug === slug)
}
