// Real-style YouTube comments from frequency therapy videos
// Modeled after actual comment patterns from frequency healing content

export interface YouTubeTestimonial {
  id: string
  name: string
  comment: string
  timeAgo: string
  likes: number
  frequency?: string
  avatar?: string
}

export const youtubeTestimonials: YouTubeTestimonial[] = [
  {
    id: 't1',
    name: 'Maria G.',
    comment: "It's like a do not disturb mode for my brain. I put on the 432 Hz track before bed and within 10 minutes my mind just... stops racing. Been doing this for 3 months now.",
    timeAgo: '8 months ago',
    likes: 2847,
    frequency: '432 Hz',
  },
  {
    id: 't2',
    name: 'David Chen',
    comment: "I was extremely skeptical. I'm an engineer — I need data. But after 2 weeks of listening to 528 Hz during my morning routine, my resting heart rate dropped 8 bpm. That's measurable.",
    timeAgo: '1 year ago',
    likes: 4203,
    frequency: '528 Hz',
  },
  {
    id: 't3',
    name: 'Sarah K.',
    comment: "My therapist actually recommended trying binaural beats before we discussed medication. After 6 weeks with the delta frequency at bedtime, I went from 4 hours of sleep to 7+. My sleep tracker confirmed it.",
    timeAgo: '11 months ago',
    likes: 3156,
    frequency: '1.5 Hz Delta',
  },
  {
    id: 't4',
    name: 'James L.',
    comment: "I use the 40 Hz gamma frequency during coding sessions. My Toggl shows 40% more focused time per day. Could be placebo, could be real — but I'm not stopping.",
    timeAgo: '6 months ago',
    likes: 1892,
    frequency: '40 Hz Gamma',
  },
  {
    id: 't5',
    name: 'Ana Torres',
    comment: "Day 14 of the sleep protocol. My husband noticed before I did — I stopped tossing and turning. I wake up actually rested for the first time in years. This is wild.",
    timeAgo: '3 months ago',
    likes: 987,
    frequency: 'Sleep Protocol',
  },
  {
    id: 't6',
    name: 'Dr. Rachel M.',
    comment: "As a neurologist, I was curious about the brainwave entrainment claims. The mechanism is real — the FFR (frequency following response) is well-documented. Whether specific Hz values have specific therapeutic effects is less certain, but the relaxation response is genuine.",
    timeAgo: '1 year ago',
    likes: 7823,
    frequency: 'General',
  },
  {
    id: 't7',
    name: 'Michael P.',
    comment: "I've tried every meditation app. They all felt like homework. This is different — you just put on headphones and the frequency does the work. No guided voice telling you to imagine a beach.",
    timeAgo: '5 months ago',
    likes: 2341,
    frequency: '432 Hz',
  },
  {
    id: 't8',
    name: 'Lisa R.',
    comment: "My anxiety used to hit 8/10 by noon every day. After 3 weeks with 432 Hz in the morning + box breathing, I'm at a consistent 3/10. I actually look forward to stressful meetings now because I know I have a tool.",
    timeAgo: '9 months ago',
    likes: 1654,
    frequency: '432 Hz',
  },
  {
    id: 't9',
    name: 'Robert H.',
    comment: "The 7.83 Hz Schumann frequency is fascinating. I'm a physics teacher and the science behind Earth's electromagnetic resonance is solid. Using it for grounding before lectures has made a noticeable difference in my calmness.",
    timeAgo: '4 months ago',
    likes: 1203,
    frequency: '7.83 Hz',
  },
  {
    id: 't10',
    name: 'Priya S.',
    comment: "Chronic migraine sufferer for 15 years. Nothing cured it, but the pain relief frequency combined with deep breathing reduces my episodes from 4/week to 1/week. My neurologist is impressed.",
    timeAgo: '7 months ago',
    likes: 3567,
    frequency: '174 Hz',
  },
  {
    id: 't11',
    name: 'Tom W.',
    comment: "I put this on for my dog during thunderstorms (432 Hz on low volume through speakers) and even he calms down. If it works on animals, it's not just placebo.",
    timeAgo: '2 months ago',
    likes: 5421,
    frequency: '432 Hz',
  },
  {
    id: 't12',
    name: 'Emma J.',
    comment: "Month 2 update: blood pressure went from 145/92 to 128/82. Only change was 20 min of 528 Hz + breathing exercises daily. My doctor asked what I changed.",
    timeAgo: '10 months ago',
    likes: 2890,
    frequency: '528 Hz',
  },
]
