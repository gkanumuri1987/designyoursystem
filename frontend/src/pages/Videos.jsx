import { useState, useEffect } from 'react'
import { videos } from '../utils/api'
import VideoGallery from '../components/VideoGallery'
import { Filter } from 'lucide-react'

const GENRES = [
  'Kids Moral',
  'Spiritual Hindu',
  'Muslim',
  'Christianity',
  'Horror',
  'Health',
]

export default function Videos() {
  const [videosList, setVideosList] = useState([])
  const [selectedGenre, setSelectedGenre] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchVideos()
  }, [])

  const fetchVideos = async () => {
    try {
      const response = await videos.list()
      setVideosList(response.data || [])
    } catch (error) {
      console.error('Failed to fetch videos:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredVideos = selectedGenre === 'all'
    ? videosList
    : videosList.filter(v => v.genre === selectedGenre)

  const handleDelete = async (videoId) => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      try {
        await videos.delete(videoId)
        fetchVideos()
      } catch (error) {
        console.error('Failed to delete video:', error)
      }
    }
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-slate-900">Generated Videos</h1>

      {/* Genre Filter */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex items-center gap-4 mb-4">
          <Filter className="w-5 h-5 text-slate-600" />
          <span className="font-semibold text-slate-900">Filter by Genre</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedGenre('all')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedGenre === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Genres
          </button>
          {GENRES.map(genre => (
            <button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedGenre === genre
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      {/* Videos Gallery */}
      {loading ? (
        <div className="text-center py-8 text-slate-600">Loading videos...</div>
      ) : filteredVideos.length === 0 ? (
        <div className="text-center py-8 text-slate-600">No videos found</div>
      ) : (
        <VideoGallery
          videos={filteredVideos}
          onDelete={handleDelete}
        />
      )}
    </div>
  )
}
