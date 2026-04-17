import { Copy, Download } from 'lucide-react'
import { useRef, useEffect } from 'react'

export default function LogViewer({ logs }) {
  const logRef = useRef(null)

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight
    }
  }, [logs])

  const handleCopy = () => {
    const text = logs.map(log => log.message).join('\n')
    navigator.clipboard.writeText(text)
    alert('Logs copied to clipboard!')
  }

  const handleDownload = () => {
    const text = logs.map(log => `[${log.timestamp}] ${log.level}: ${log.message}`).join('\n')
    const element = document.createElement('a')
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text))
    element.setAttribute('download', 'pipeline-logs.txt')
    element.click()
  }

  return (
    <div className="space-y-4 p-4 bg-slate-50 rounded-lg">
      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-3 py-1 text-sm bg-slate-200 text-slate-900 rounded hover:bg-slate-300 transition-colors"
        >
          <Copy className="w-4 h-4" />
          Copy
        </button>
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-3 py-1 text-sm bg-slate-200 text-slate-900 rounded hover:bg-slate-300 transition-colors"
        >
          <Download className="w-4 h-4" />
          Download
        </button>
      </div>

      {/* Log Output */}
      <div
        ref={logRef}
        className="bg-slate-900 text-slate-100 p-4 rounded font-mono text-sm h-96 overflow-y-auto space-y-1"
      >
        {logs.length === 0 ? (
          <div className="text-slate-600">No logs available</div>
        ) : (
          logs.map((log, index) => (
            <div key={index} className="whitespace-pre-wrap break-words">
              <span className="text-blue-400">[{log.timestamp}]</span>
              {' '}
              <span
                className={
                  log.level === 'error'
                    ? 'text-red-400'
                    : log.level === 'warn'
                    ? 'text-yellow-400'
                    : log.level === 'success'
                    ? 'text-green-400'
                    : 'text-slate-300'
                }
              >
                {log.level.toUpperCase()}
              </span>
              {': '}
              <span>{log.message}</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
