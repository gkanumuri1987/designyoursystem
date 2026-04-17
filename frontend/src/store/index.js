import { create } from 'zustand'

export const useStore = create((set) => ({
  // Auth
  user: null,
  setUser: (user) => set({ user }),

  // Pipeline Configuration
  pipelines: [],
  setPipelines: (pipelines) => set({ pipelines }),
  addPipeline: (pipeline) => set((state) => ({
    pipelines: [...state.pipelines, pipeline]
  })),

  // Jobs
  jobs: [],
  setJobs: (jobs) => set({ jobs }),
  updateJob: (jobId, updates) => set((state) => ({
    jobs: state.jobs.map(job => job.id === jobId ? { ...job, ...updates } : job)
  })),

  // Videos
  videos: [],
  setVideos: (videos) => set({ videos }),

  // Loading and Error
  loading: false,
  setLoading: (loading) => set({ loading }),
  error: null,
  setError: (error) => set({ error }),
}))
