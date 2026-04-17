import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Configuration from './pages/Configuration'
import Videos from './pages/Videos'
import JobDetails from './pages/JobDetails'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="configure" element={<Configuration />} />
          <Route path="videos" element={<Videos />} />
          <Route path="jobs/:jobId" element={<JobDetails />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
