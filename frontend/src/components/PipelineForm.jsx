import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

const GENRES = [
  'Kids Moral',
  'Spiritual Hindu',
  'Muslim',
  'Christianity',
  'Horror',
  'Health',
]

const LANGUAGES = [
  'English', 'Spanish', 'French', 'German', 'Chinese', 'Hindi', 'Arabic'
]

const AI_MODELS = {
  'Gemini': ['Flash', 'Pro'],
  'Anthropic': ['Claude 3 Opus', 'Claude 3 Sonnet', 'Claude 3 Haiku'],
  'OpenAI': ['GPT-4', 'GPT-3.5 Turbo']
}

const SCHEDULES = [
  { value: 'once', label: 'Run Once' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
]

export default function PipelineForm({ pipeline, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    genre: '',
    languages: [],
    aiProvider: '',
    aiModel: '',
    schedule: 'once',
    description: '',
  })

  const [subModels, setSubModels] = useState([])

  useEffect(() => {
    if (pipeline) {
      setFormData(pipeline)
    }
  }, [pipeline])

  useEffect(() => {
    if (formData.aiProvider && AI_MODELS[formData.aiProvider]) {
      setSubModels(AI_MODELS[formData.aiProvider])
      setFormData(prev => ({ ...prev, aiModel: AI_MODELS[formData.aiProvider][0] }))
    }
  }, [formData.aiProvider])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  const handleLanguageToggle = (language) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter(l => l !== language)
        : [...prev.languages, language]
    }))
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-900">
          {pipeline ? 'Edit Pipeline' : 'Create New Pipeline'}
        </h2>
        <button
          onClick={onCancel}
          className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Pipeline Name */}
        <div>
          <label className="block text-sm font-medium text-slate-900 mb-2">
            Pipeline Name
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="e.g., Kids Moral Stories"
          />
        </div>

        {/* Genre Selection */}
        <div>
          <label className="block text-sm font-medium text-slate-900 mb-2">
            Genre
          </label>
          <select
            required
            value={formData.genre}
            onChange={(e) => setFormData(prev => ({ ...prev, genre: e.target.value }))}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="">Select a genre</option>
            {GENRES.map(genre => (
              <option key={genre} value={genre}>{genre}</option>
            ))}
          </select>
        </div>

        {/* Languages */}
        <div>
          <label className="block text-sm font-medium text-slate-900 mb-2">
            Languages
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {LANGUAGES.map(language => (
              <label key={language} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.languages.includes(language)}
                  onChange={() => handleLanguageToggle(language)}
                  className="w-4 h-4 rounded border-slate-300"
                />
                <span className="text-sm text-slate-700">{language}</span>
              </label>
            ))}
          </div>
        </div>

        {/* AI Provider */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">
              AI Provider
            </label>
            <select
              required
              value={formData.aiProvider}
              onChange={(e) => setFormData(prev => ({ ...prev, aiProvider: e.target.value }))}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="">Select provider</option>
              {Object.keys(AI_MODELS).map(provider => (
                <option key={provider} value={provider}>{provider}</option>
              ))}
            </select>
          </div>

          {/* AI Model */}
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">
              Model
            </label>
            <select
              required
              value={formData.aiModel}
              onChange={(e) => setFormData(prev => ({ ...prev, aiModel: e.target.value }))}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              disabled={!formData.aiProvider}
            >
              <option value="">Select model</option>
              {subModels.map(model => (
                <option key={model} value={model}>{model}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Schedule */}
        <div>
          <label className="block text-sm font-medium text-slate-900 mb-2">
            Execution Schedule
          </label>
          <select
            value={formData.schedule}
            onChange={(e) => setFormData(prev => ({ ...prev, schedule: e.target.value }))}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            {SCHEDULES.map(schedule => (
              <option key={schedule.value} value={schedule.value}>
                {schedule.label}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-slate-900 mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            rows="4"
            placeholder="Describe your pipeline..."
          />
        </div>

        {/* Actions */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            {pipeline ? 'Update Pipeline' : 'Create Pipeline'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-slate-200 text-slate-900 px-4 py-2 rounded-lg hover:bg-slate-300 transition-colors font-medium"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
