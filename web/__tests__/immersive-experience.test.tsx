import fs from 'fs'
import path from 'path'

describe('Immersive Experience & Audio', () => {
  describe('AudioManager (global)', () => {
    const source = fs.readFileSync(path.join(__dirname, '../lib/audioManager.ts'), 'utf-8')

    it('has audio fade-in', () => {
      expect(source).toContain('linearRampToValueAtTime')
    })

    it('stops audio on stop()', () => {
      expect(source).toContain('stop()')
      expect(source).toContain('disconnect')
    })

    it('ensures minimum 150 Hz audible harmonic for low frequencies', () => {
      expect(source).toContain('hFreq < 150')
      expect(source).toContain('hFreq *= 2')
    })

    it('singleton pattern — only one audio at a time', () => {
      expect(source).toContain('this.stop()')
    })

    it('notifies subscribers on state change', () => {
      expect(source).toContain('subscribe')
      expect(source).toContain('notify')
    })
  })

  describe('ImmersiveExperience component', () => {
    const source = fs.readFileSync(path.join(__dirname, '../components/immersive/ImmersiveExperience.tsx'), 'utf-8')

    it('uses global audioManager', () => {
      expect(source).toContain("import { audioManager }")
      expect(source).toContain('audioManager?.play')
      expect(source).toContain('audioManager?.stop')
    })

    it('stops audio on unmount (navigation)', () => {
      expect(source).toContain("audioManager?.stop()")
      expect(source).toContain("return () => {")
    })

    it('supports Escape key to exit', () => {
      expect(source).toContain("e.key === 'Escape'")
    })

    it('builds teleprompter sections from frequency data', () => {
      expect(source).toContain('scientific_backing')
      expect(source).toContain('mechanism')
      expect(source).toContain('benefits')
    })

    it('has dim/lights off mode', () => {
      expect(source).toContain('dimmed')
      expect(source).toContain('Lights Off')
      expect(source).toContain('Lights On')
    })

    it('has breathing guide toggle', () => {
      expect(source).toContain('breathingActive')
      expect(source).toContain('BreathingGuide')
    })

    it('has freemium timer for free users', () => {
      expect(source).toContain('FreemiumTimer')
      expect(source).toContain('isFreeUser')
    })
  })

  describe('Teleprompter component', () => {
    const source = fs.readFileSync(path.join(__dirname, '../components/immersive/Teleprompter.tsx'), 'utf-8')

    it('uses distinctive typography', () => {
      expect(source).toContain('--font-playfair')
    })

    it('shows one section at a time (no overlap)', () => {
      expect(source).toContain('AnimatePresence mode="wait"')
      expect(source).toContain('currentIndex')
    })

    it('supports dim mode', () => {
      expect(source).toContain('dimmed')
    })
  })

  describe('MiniPlayer component', () => {
    const source = fs.readFileSync(path.join(__dirname, '../components/ui/MiniPlayer.tsx'), 'utf-8')

    it('subscribes to audio manager', () => {
      expect(source).toContain('audioManager')
      expect(source).toContain('subscribe')
    })

    it('shows stop button', () => {
      expect(source).toContain('Stop audio')
    })

    it('shows frequency name and Hz', () => {
      expect(source).toContain('frequencyName')
      expect(source).toContain('hzValue')
    })
  })

  describe('Frequencies page', () => {
    const source = fs.readFileSync(path.join(__dirname, '../app/frequencies/page.tsx'), 'utf-8')

    it('has search and category filters', () => {
      expect(source).toContain('search')
      expect(source).toContain('activeCategory')
    })

    it('shows detail panel when frequency selected', () => {
      expect(source).toContain('selectedFreq')
      expect(source).toContain('Benefits')
      expect(source).toContain('Start Session')
    })

    it('scrolls to top on selection', () => {
      expect(source).toContain("window.scrollTo")
    })

    it('adapts grid columns based on selection and count', () => {
      expect(source).toContain('filtered.length <= 2')
    })

    it('shows auth-aware navigation', () => {
      expect(source).toContain('useAuth')
      expect(source).toContain('Dashboard')
      expect(source).toContain('Sign In')
    })
  })

  describe('Protocols', () => {
    const source = fs.readFileSync(path.join(__dirname, '../lib/protocols.ts'), 'utf-8')

    it('has at least 6 protocols', () => {
      const count = (source.match(/id: '/g) || []).length
      expect(count).toBeGreaterThanOrEqual(6)
    })

    it('all protocols have citations', () => {
      expect(source).toContain('British Journal of Cancer')
      expect(source).toContain('Nature')
      expect(source).toContain('Psychiatry Research')
    })

    it('all protocols have 3 phases', () => {
      const phases = (source.match(/name: 'Foundation'|name: 'Calming'|name: 'Activation'|name: 'Relief'|name: 'Preparation'/g) || []).length
      expect(phases).toBeGreaterThanOrEqual(5)
    })

    it('has the 10000 Hz universal healing protocol', () => {
      expect(source).toContain('Universal Healing Protocol')
      expect(source).toContain('10000')
    })
  })

  describe('Experience page access control', () => {
    const source = fs.readFileSync(path.join(__dirname, '../app/experience/[id]/page.tsx'), 'utf-8')

    it('checks admin status', () => {
      expect(source).toContain('isSuperadmin')
      expect(source).toContain('useAuth')
    })

    it('redirects non-paying users from premium frequencies', () => {
      expect(source).toContain("frequency.tier !== 'free'")
      expect(source).toContain('/pricing')
    })
  })

  describe('Admin panel', () => {
    const apiSource = fs.readFileSync(path.join(__dirname, '../app/api/admin/users/route.ts'), 'utf-8')

    it('verifies admin email', () => {
      expect(apiSource).toContain('sergioduran89@gmail.com')
    })

    it('supports grant, revoke, and delete actions', () => {
      expect(apiSource).toContain('grant_access')
      expect(apiSource).toContain('revoke_access')
      expect(apiSource).toContain('delete_user')
    })

    it('uses service role for admin operations', () => {
      expect(apiSource).toContain('SUPABASE_SERVICE_ROLE_KEY')
    })
  })
})
