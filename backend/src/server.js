import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'

import authRoutes from './routes/auth.js'
import pipelineRoutes from './routes/pipelines.js'
import jobRoutes from './routes/jobs.js'
import videoRoutes from './routes/videos.js'
import { initializeScheduler } from './services/scheduler.js'

dotenv.config()

const app = express()
const prisma = new PrismaClient()

// Middleware
app.use(cors())
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/pipelines', pipelineRoutes)
app.use('/api/jobs', jobRoutes)
app.use('/api/videos', videoRoutes)

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err)
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
    status: err.status || 500
  })
})

// Initialize
const PORT = process.env.PORT || 3000

async function start() {
  try {
    // Test database connection
    await prisma.$connect()
    console.log('Database connected')

    // Initialize scheduler
    initializeScheduler()
    console.log('Scheduler initialized')

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`)
    })
  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}

start()

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect()
  process.exit(0)
})
