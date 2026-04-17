import { pipelines } from '../utils/api'
import { Edit2, Trash2, Play } from 'lucide-react'

export default function PipelineList({ pipelines: pipelinesList, loading, onEdit, onDelete }) {
  const handleExecute = async (pipelineId, e) => {
    e.stopPropagation()
    try {
      await pipelines.execute(pipelineId)
      alert('Pipeline execution started!')
    } catch (error) {
      alert('Failed to execute pipeline: ' + error.message)
    }
  }

  if (loading) {
    return <div className="text-center py-8 text-slate-600">Loading pipelines...</div>
  }

  if (pipelinesList.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
        <p className="text-slate-600">No pipelines created yet. Create one to get started!</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {pipelinesList.map(pipeline => (
        <div
          key={pipeline.id}
          className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">{pipeline.name}</h3>
              <p className="text-sm text-slate-600 mt-1">{pipeline.genre}</p>
            </div>
            <span className="px-2 py-1 rounded text-xs font-medium bg-slate-100 text-slate-700">
              {pipeline.schedule}
            </span>
          </div>

          <p className="text-sm text-slate-600 mb-4">{pipeline.description}</p>

          <div className="mb-4 space-y-1 text-sm">
            <p className="text-slate-600">
              <strong>Provider:</strong> {pipeline.aiProvider} - {pipeline.aiModel}
            </p>
            <p className="text-slate-600">
              <strong>Languages:</strong> {pipeline.languages.join(', ')}
            </p>
          </div>

          <div className="flex gap-2 pt-4 border-t border-slate-200">
            <button
              onClick={(e) => handleExecute(pipeline.id, e)}
              className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
            >
              <Play className="w-4 h-4" />
              Run Now
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onEdit(pipeline)
              }}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              <Edit2 className="w-4 h-4" />
              Edit
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onDelete(pipeline.id)
              }}
              className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
