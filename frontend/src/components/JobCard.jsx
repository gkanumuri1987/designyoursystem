import { Link } from 'react-router-dom'
import { ChevronRight, Dices } from 'lucide-react'

export default function JobCard({ job, onRefresh }) {
  const statusColors = {
    running: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
    pending: 'bg-yellow-100 text-yellow-800',
  }

  const getStepStatus = (step) => {
    if (step.completed) return 'green'
    if (step.running) return 'blue'
    return 'gray'
  }

  return (
    <Link to={`/jobs/${job.id}`}>
      <div className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-lg transition-shadow cursor-pointer">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">{job.pipelineName}</h3>
            <p className="text-sm text-slate-600 mt-1">
              Genre: {job.genre} | Language: {job.language}
            </p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[job.status]}`}>
            {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
          </span>
        </div>

        {/* Pipeline Steps */}
        <div className="mb-4">
          <p className="text-sm font-medium text-slate-600 mb-3">Pipeline Progress</p>
          <div className="space-y-2">
            {(job.steps || []).map((step, index) => (
              <div key={index} className="flex items-center gap-3">
                {step.running && <Dices className="w-4 h-4 text-blue-600 dice-spin" />}
                {step.completed && <span className="w-4 h-4 rounded-full bg-green-600" />}
                {!step.running && !step.completed && <span className="w-4 h-4 rounded-full bg-slate-300" />}
                <span className="text-sm text-slate-700">{step.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Meta Info */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          <div className="text-xs text-slate-600">
            Started: {new Date(job.createdAt).toLocaleDateString()}
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400" />
        </div>
      </div>
    </Link>
  )
}
