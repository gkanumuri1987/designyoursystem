import { useState, useEffect } from 'react'
import { useStore } from '../store'
import { jobs } from '../utils/api'
import JobCard from '../components/JobCard'
import StatsCard from '../components/StatsCard'
import { Zap, CheckCircle, AlertCircle, Clock } from 'lucide-react'

export default function Dashboard() {
  const [jobsList, setJobsList] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all, running, completed, failed

  useEffect(() => {
    fetchJobs()
    // Poll for updates every 3 seconds
    const interval = setInterval(fetchJobs, 3000)
    return () => clearInterval(interval)
  }, [])

  const fetchJobs = async () => {
    try {
      const response = await jobs.list()
      setJobsList(response.data || [])
    } catch (error) {
      console.error('Failed to fetch jobs:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredJobs = jobsList.filter(job => {
    if (filter === 'all') return true
    if (filter === 'running') return job.status === 'running'
    if (filter === 'completed') return job.status === 'completed'
    if (filter === 'failed') return job.status === 'failed'
    return true
  })

  const stats = {
    total: jobsList.length,
    running: jobsList.filter(j => j.status === 'running').length,
    completed: jobsList.filter(j => j.status === 'completed').length,
    failed: jobsList.filter(j => j.status === 'failed').length,
  }

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          icon={Zap}
          label="Total Jobs"
          value={stats.total}
          color="blue"
        />
        <StatsCard
          icon={Clock}
          label="Running"
          value={stats.running}
          color="yellow"
        />
        <StatsCard
          icon={CheckCircle}
          label="Completed"
          value={stats.completed}
          color="green"
        />
        <StatsCard
          icon={AlertCircle}
          label="Failed"
          value={stats.failed}
          color="red"
        />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <div className="flex gap-2 flex-wrap">
          {['all', 'running', 'completed', 'failed'].map(filterOption => (
            <button
              key={filterOption}
              onClick={() => setFilter(filterOption)}
              className={`px-4 py-2 rounded-lg transition-colors capitalize ${
                filter === filterOption
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {filterOption}
            </button>
          ))}
        </div>
      </div>

      {/* Jobs List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-900">Pipeline Jobs</h2>
        {loading ? (
          <div className="text-center py-8 text-slate-600">Loading jobs...</div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-8 text-slate-600">No jobs found</div>
        ) : (
          <div className="space-y-4">
            {filteredJobs.map(job => (
              <JobCard key={job.id} job={job} onRefresh={fetchJobs} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
