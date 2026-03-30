/**
 * Panel State (Zustand Store) Tests
 * Tests the core panel state management: frequency activation, 4-channel limit,
 * volume control, spatial audio, and layer stacking
 */
import { usePanelStore } from '@/lib/panelState'
import { Frequency } from '@/types'

// Create a test frequency
const makeFreq = (id: string, name: string, hz: number): Frequency => ({
  id,
  name,
  hz_value: hz,
  category: 'relaxation',
  description: `Test frequency ${name}`,
  scientific_backing: 'Test backing',
  benefits: ['test'],
  best_for: ['testing'],
  tier: 'free',
  duration_minutes: 30,
})

const freq1 = makeFreq('f1', 'Alpha Wave', 10)
const freq2 = makeFreq('f2', 'Theta Wave', 6)
const freq3 = makeFreq('f3', 'Delta Wave', 2)
const freq4 = makeFreq('f4', 'Beta Wave', 20)
const freq5 = makeFreq('f5', 'Gamma Wave', 40)

describe('Panel State Store', () => {
  beforeEach(() => {
    // Reset store state between tests
    usePanelStore.setState({
      activeFrequencies: [],
      masterVolume: 0.7,
      isPlaying: false,
      spatialEnabled: false,
      layoutMode: 'desktop',
      panelView: 'both',
      sidebarCollapsed: false,
      selectedCategory: null,
      searchQuery: '',
      libraryScrollPosition: 0,
    })
  })

  describe('Frequency Activation', () => {
    test('can activate a frequency', () => {
      usePanelStore.getState().activateFrequency(freq1)
      const state = usePanelStore.getState()
      expect(state.activeFrequencies).toHaveLength(1)
      expect(state.activeFrequencies[0].frequency.id).toBe('f1')
      expect(state.activeFrequencies[0].volume).toBe(0.7)
      expect(state.activeFrequencies[0].active).toBe(true)
    })

    test('can activate multiple frequencies', () => {
      const store = usePanelStore.getState()
      store.activateFrequency(freq1)
      store.activateFrequency(freq2)
      store.activateFrequency(freq3)
      expect(usePanelStore.getState().activeFrequencies).toHaveLength(3)
    })

    test('enforces 4-channel limit', () => {
      const store = usePanelStore.getState()
      store.activateFrequency(freq1)
      store.activateFrequency(freq2)
      store.activateFrequency(freq3)
      store.activateFrequency(freq4)
      store.activateFrequency(freq5) // 5th should replace oldest
      
      const state = usePanelStore.getState()
      expect(state.activeFrequencies).toHaveLength(4)
      // freq5 should be present (just added)
      expect(state.activeFrequencies.some(af => af.frequency.id === 'f5')).toBe(true)
    })

    test('reactivating existing frequency updates it instead of duplicating', () => {
      const store = usePanelStore.getState()
      store.activateFrequency(freq1)
      store.activateFrequency(freq1) // same again
      
      expect(usePanelStore.getState().activeFrequencies).toHaveLength(1)
    })

    test('can deactivate a frequency', () => {
      const store = usePanelStore.getState()
      store.activateFrequency(freq1)
      store.activateFrequency(freq2)
      store.deactivateFrequency('f1')
      
      const state = usePanelStore.getState()
      expect(state.activeFrequencies).toHaveLength(1)
      expect(state.activeFrequencies[0].frequency.id).toBe('f2')
    })
  })

  describe('Volume Control', () => {
    test('can set master volume', () => {
      usePanelStore.getState().setMasterVolume(0.5)
      expect(usePanelStore.getState().masterVolume).toBe(0.5)
    })

    test('master volume clamps to 0-1 range', () => {
      usePanelStore.getState().setMasterVolume(1.5)
      expect(usePanelStore.getState().masterVolume).toBeLessThanOrEqual(1)
      
      usePanelStore.getState().setMasterVolume(-0.5)
      expect(usePanelStore.getState().masterVolume).toBeGreaterThanOrEqual(0)
    })

    test('can update individual frequency volume', () => {
      usePanelStore.getState().activateFrequency(freq1)
      usePanelStore.getState().updateFrequencyVolume('f1', 0.3)
      
      const af = usePanelStore.getState().activeFrequencies[0]
      expect(af.volume).toBe(0.3)
    })

    test('frequency volume clamps to 0-1 range', () => {
      usePanelStore.getState().activateFrequency(freq1)
      usePanelStore.getState().updateFrequencyVolume('f1', 2.0)
      
      const af = usePanelStore.getState().activeFrequencies[0]
      expect(af.volume).toBeLessThanOrEqual(1)
    })
  })

  describe('Playback Control', () => {
    test('togglePlayback switches state', () => {
      expect(usePanelStore.getState().isPlaying).toBe(false)
      usePanelStore.getState().togglePlayback()
      expect(usePanelStore.getState().isPlaying).toBe(true)
      usePanelStore.getState().togglePlayback()
      expect(usePanelStore.getState().isPlaying).toBe(false)
    })

    test('startPlayback sets playing', () => {
      usePanelStore.getState().startPlayback()
      expect(usePanelStore.getState().isPlaying).toBe(true)
    })

    test('stopPlayback stops playing', () => {
      usePanelStore.getState().startPlayback()
      usePanelStore.getState().stopPlayback()
      expect(usePanelStore.getState().isPlaying).toBe(false)
    })
  })

  describe('Layout Management', () => {
    test('setLayoutMode changes mode', () => {
      usePanelStore.getState().setLayoutMode('mobile')
      expect(usePanelStore.getState().layoutMode).toBe('mobile')
    })

    test('mobile mode auto-collapses sidebar', () => {
      usePanelStore.getState().setLayoutMode('mobile')
      expect(usePanelStore.getState().sidebarCollapsed).toBe(true)
      expect(usePanelStore.getState().panelView).toBe('library')
    })

    test('toggleSidebar works', () => {
      expect(usePanelStore.getState().sidebarCollapsed).toBe(false)
      usePanelStore.getState().toggleSidebar()
      expect(usePanelStore.getState().sidebarCollapsed).toBe(true)
    })
  })

  describe('Spatial Audio', () => {
    test('toggleSpatial enables/disables spatial', () => {
      expect(usePanelStore.getState().spatialEnabled).toBe(false)
      usePanelStore.getState().toggleSpatial()
      expect(usePanelStore.getState().spatialEnabled).toBe(true)
    })

    test('can update spatial position for active frequency', () => {
      usePanelStore.getState().activateFrequency(freq1)
      usePanelStore.getState().updateSpatialPosition('f1', { x: 0.5, y: 0.3, z: 0.8 })
      
      const af = usePanelStore.getState().activeFrequencies[0]
      expect(af.spatialPosition).toEqual({ x: 0.5, y: 0.3, z: 0.8 })
    })

    test('can set movement pattern', () => {
      usePanelStore.getState().activateFrequency(freq1)
      usePanelStore.getState().setMovementPattern('f1', 'circular', 2)
      
      const af = usePanelStore.getState().activeFrequencies[0]
      expect(af.movementPattern).toBe('circular')
      expect(af.movementSpeed).toBe(2)
    })
  })

  describe('Layer Stacking', () => {
    test('can toggle ambient layer', () => {
      usePanelStore.getState().activateFrequency(freq1)
      usePanelStore.getState().toggleLayer('f1', 'ambient')
      
      const af = usePanelStore.getState().activeFrequencies[0]
      expect(af.layers?.ambient).toBe(true)
    })

    test('can toggle binaural layer', () => {
      usePanelStore.getState().activateFrequency(freq1)
      usePanelStore.getState().toggleLayer('f1', 'binaural')
      
      const af = usePanelStore.getState().activeFrequencies[0]
      expect(af.layers?.binaural).toBe(true)
    })

    test('can set binaural frequency', () => {
      usePanelStore.getState().activateFrequency(freq1)
      usePanelStore.getState().setBinauralFrequency('f1', 6) // Theta
      
      const af = usePanelStore.getState().activeFrequencies[0]
      expect(af.layers?.binauralFreq).toBe(6)
    })
  })

  describe('Library State', () => {
    test('can set category filter', () => {
      usePanelStore.getState().setSelectedCategory('relaxation')
      expect(usePanelStore.getState().selectedCategory).toBe('relaxation')
    })

    test('can clear category filter', () => {
      usePanelStore.getState().setSelectedCategory('relaxation')
      usePanelStore.getState().setSelectedCategory(null)
      expect(usePanelStore.getState().selectedCategory).toBeNull()
    })

    test('can set search query', () => {
      usePanelStore.getState().setSearchQuery('alpha')
      expect(usePanelStore.getState().searchQuery).toBe('alpha')
    })
  })

  describe('Reset', () => {
    test('clearActiveFrequencies removes all', () => {
      usePanelStore.getState().activateFrequency(freq1)
      usePanelStore.getState().activateFrequency(freq2)
      usePanelStore.getState().clearActiveFrequencies()
      
      expect(usePanelStore.getState().activeFrequencies).toHaveLength(0)
    })

    test('resetMixer clears frequencies and stops playback', () => {
      usePanelStore.getState().activateFrequency(freq1)
      usePanelStore.getState().startPlayback()
      usePanelStore.getState().resetMixer()
      
      expect(usePanelStore.getState().activeFrequencies).toHaveLength(0)
      expect(usePanelStore.getState().isPlaying).toBe(false)
    })
  })
})
