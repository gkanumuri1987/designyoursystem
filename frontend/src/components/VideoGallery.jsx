import { Trash2, Download } from 'lucide-react'

export default function VideoGallery({ videos, onDelete }) {
  const handleDownload = (videoUrl, videoTitle) => {
    const a = document.createElement('a')
    a.href = videoUrl
    a.download = `${videoTitle}.mp4`
    a.click()
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {videos.map(video => (
        <div
          key={video.id}
          className="bg-white rounded-lg border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow"
        >
          {/* Video Thumbnail */}
          <div className="relative bg-black h-48">
            <video
              src={video.url}
              controls
              className="w-full h-full"
            />
          </div>

          {/* Video Info */}
          <div className="p-4 space-y-3">
            <div>
              <p className="text-xs text-slate-500 mb-1">Genre: {video.genre}</p>
              <h3 className="font-semibold text-slate-900">{video.titleEn}</h3>
              <p className="text-sm text-slate-600 mt-1">{video.title}</p>
            </div>

            <div className="text-sm text-slate-600 line-clamp-2">
              {video.description}
            </div>

            <div className="text-xs text-slate-500">
              Created: {new Date(video.createdAt).toLocaleDateString()}
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-3 border-t border-slate-200">
              <button
                onClick={() => handleDownload(video.url, video.titleEn)}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
              <button
                onClick={() => onDelete(video.id)}
                className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
