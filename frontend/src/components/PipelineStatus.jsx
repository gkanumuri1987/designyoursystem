import { Dices, CheckCircle, AlertCircle } from 'lucide-react'

export default function PipelineStatus({ job }) {
  const steps = job.steps || []

  const getStatusIcon = (step) => {
    if (step.completed) {
      return <CheckCircle className="w-5 h-5 text-green-600" />
    }
    if (step.running) {
      return <Dices className="w-5 h-5 text-blue-600 dice-spin" />
    }
    if (step.error) {
      return <AlertCircle className="w-5 h-5 text-red-600" />
    }
    return <div className="w-5 h-5 rounded-full bg-slate-300" />
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6">
      <h2 className="text-xl font-semibold text-slate-900 mb-6">Pipeline Progress</h2>

      <div className="space-y-4">
        {steps.map((step, index) => (
          <div key={index}>
            {/* Step Header */}
            <div className="flex items-center gap-4 mb-2">
              {getStatusIcon(step)}
              <div className="flex-1">
                <h3 className="font-medium text-slate-900">{step.name}</h3>
                {step.error && (
                  <p className="text-sm text-red-600 mt-1">{step.error}</p>
                )}
              </div>
              {step.completed && (
                <span className="text-xs font-medium text-green-600">Completed</span>
              )}
              {step.running && (
                <span className="text-xs font-medium text-blue-600">Running</span>
              )}
            </div>

            {/* Progress Bar */}
            {step.running && (
              <div className="ml-9 h-1 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all"
                  style={{ width: `${step.progress || 0}%` }}
                />
              </div>
            )}

            {/* Divider */}
            {index < steps.length - 1 && !step.completed && !step.error && (
              <div className="ml-2 h-4 border-l-2 border-slate-300 my-2" />
            )}
            {index < steps.length - 1 && (step.completed || step.error) && (
              <div className="ml-2 h-4 border-l-2 border-green-300 my-2" />
            )}
          </div>
        ))}
      </div>

      {/* Overall Status */}
      <div className="mt-6 pt-6 border-t border-slate-200">
        <div className="flex items-center justify-between">
          <span className="font-medium text-slate-900">Overall Status</span>
          <span
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              job.status === 'completed'
                ? 'bg-green-100 text-green-800'
                : job.status === 'failed'
                ? 'bg-red-100 text-red-800'
                : 'bg-blue-100 text-blue-800'
            }`}
          >
            {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
          </span>
        </div>
      </div>
    </div>
  )
}
