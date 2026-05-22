import { create } from 'zustand'

const useDashboardStore = create((set) => ({
  // state
  city: '',
  lat: null,
  lng: null,
  iss_position: null,
  iss_passes: null,
  asteroids: null,
  weather: null,
  apod: null,
  moon: null,
  verdict: null,
  loading: false,
  error: null,
  streamStatus: {},   // tracks which sections have arrived

  // actions
  setCity: (city) => set({ city }),

  setError: (error) => set({ error, loading: false }),

  resetDashboard: () => set({
    iss_position: null,
    iss_passes: null,
    asteroids: null,
    weather: null,
    apod: null,
    moon: null,
    verdict: null,
    error: null,
    streamStatus: {},
  }),

  setLoading: (loading) => set({ loading }),

  // called by SSE consumer as each section arrives
  setSectionData: (section, data) => set((state) => ({
    [section]: data,
    streamStatus: { ...state.streamStatus, [section]: true },
  })),

  setGeocode: (city, lat, lng) => set({ city, lat, lng }),
}))

export default useDashboardStore