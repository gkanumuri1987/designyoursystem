import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { jobs } from '../utils/api'
import PipelineStatus from '../components/PipelineStatus'
import LogViewer from '../components/LogViewer'
import { ArrowLeft, RefreshCw } from 'lucide-react'

export default function JobDetails() {
  const { jobId } = useParams()
  const navigate = useNavigate()
  const [job, setJob] = useState(null)
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [showLogs, setShowLogs] = useState(false)

  useEffect(() => {
    fetchJob()
    fetchLogs()
    // Poll for updates every 2 seconds
    const interval = setInterval(() => {
      fetchJob()
      if (showLogs) fetchLogs()
    }, 2000)
    return () => clearInterval(interval)
  }, [jobId, showLogs])

  const fetchJob = async () => {
    try {
      const response = await jobs.get(jobId)
      setJob(response.data)
    } catch (error) {
      console.error('Failed to fetch job:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchLogs = async () => {
    try {
      const response = await jobs.getLogs(jobId)
      setLogs(response.data || [])
    } catch (error) {
      console.error('Failed to fetch logs:', error)
    }
  }

  if (loading) return <div className="text-center py-8">Loading job details...</div>
  if (!job) return <div className="text-center py-8 text-red-600">Job not found</div>

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{job.pipelineName}</h1>
            <p className="text-slate-600">Job ID: {job.id}</p>
          </div>
        </div>
        <button
          onClick={fetchJob}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      {/* Pipeline Status */}
      <PipelineStatus job={job} />

      {/* Logs Section */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <button
          onClick={() => setShowLogs(!showLogs)}
          className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
        >
          <span className="font-semibold text-slate-900">Console Logs</span>
          <span className={`transform transition-transform ${showLogs ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </button>
        {showLogs && <LogViewer logs={logs} />}
      </div>

      {/* Video Output */}
      {job.videoUrl && (
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Generated Video</h2>
          <video
            src={job.videoUrl}
            controls
            className="w-full rounded-lg bg-black"
          />
          <div className="mt-4 space-y-2">
            <p><strong>Title (English):</strong> {job.videoTitleEn}</p>
            <p><strong>Title ({job.language}):</strong> {job.videoTitle}</p>
            <p><strong>Description:</strong> {job.videoDescription}</p>
          </div>
        </div>
      )}
    </div>
  )
}
