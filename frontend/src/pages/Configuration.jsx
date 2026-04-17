import { useState, useEffect } from 'react'
import { pipelines } from '../utils/api'
import PipelineForm from '../components/PipelineForm'
import PipelineList from '../components/PipelineList'
import { Plus } from 'lucide-react'

export default function Configuration() {
  const [pipelinesList, setPipelinesList] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingPipeline, setEditingPipeline] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPipelines()
  }, [])

  const fetchPipelines = async () => {
    try {
      const response = await pipelines.list()
      setPipelinesList(response.data || [])
    } catch (error) {
      console.error('Failed to fetch pipelines:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (formData) => {
    try {
      if (editingPipeline) {
        await pipelines.update(editingPipeline.id, formData)
      } else {
        await pipelines.create(formData)
      }
      fetchPipelines()
      setShowForm(false)
      setEditingPipeline(null)
    } catch (error) {
      console.error('Failed to save pipeline:', error)
    }
  }

  const handleDelete = async (pipelineId) => {
    if (window.confirm('Are you sure you want to delete this pipeline?')) {
      try {
        await pipelines.delete(pipelineId)
        fetchPipelines()
      } catch (error) {
        console.error('Failed to delete pipeline:', error)
      }
    }
  }

  const handleEdit = (pipeline) => {
    setEditingPipeline(pipeline)
    setShowForm(true)
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingPipeline(null)
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Pipeline Configuration</h1>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            New Pipeline
          </button>
        )}
      </div>

      {showForm ? (
        <PipelineForm
          pipeline={editingPipeline}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      ) : (
        <PipelineList
          pipelines={pipelinesList}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  )
}
