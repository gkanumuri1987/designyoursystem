import express from 'express'
import { PrismaClient } from '@prisma/client'
import { authenticate } from '../middleware/auth.js'

const router = express.Router()
const prisma = new PrismaClient()

// Apply auth middleware
router.use(authenticate)

// List jobs
router.get('/', async (req, res) => {
  try {
    const jobs = await prisma.job.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' },
      include: { video: true }
    })

    res.json(jobs)
  } catch (error) {
    console.error('Error fetching jobs:', error)
    res.status(500).json({ message: 'Failed to fetch jobs' })
  }
})

// Get single job with details
router.get('/:id', async (req, res) => {
  try {
    const job = await prisma.job.findFirst({
      where: {
        id: req.params.id,
        userId: req.userId
      },
      include: {
        video: true,
        logs: {
          orderBy: { timestamp: 'asc' }
        }
      }
    })

    if (!job) {
      return res.status(404).json({ message: 'Job not found' })
    }

    res.json(job)
  } catch (error) {
    console.error('Error fetching job:', error)
    res.status(500).json({ message: 'Failed to fetch job' })
  }
})

// Get job logs
router.get('/:id/logs', async (req, res) => {
  try {
    const job = await prisma.job.findFirst({
      where: {
        id: req.params.id,
        userId: req.userId
      }
    })

    if (!job) {
      return res.status(404).json({ message: 'Job not found' })
    }

    const logs = await prisma.jobLog.findMany({
      where: { jobId: req.params.id },
      orderBy: { timestamp: 'asc' }
    })

    res.json(logs)
  } catch (error) {
    console.error('Error fetching logs:', error)
    res.status(500).json({ message: 'Failed to fetch logs' })
  }
})

// Cancel job
router.post('/:id/cancel', async (req, res) => {
  try {
    const job = await prisma.job.findFirst({
      where: {
        id: req.params.id,
        userId: req.userId
      }
    })

    if (!job) {
      return res.status(404).json({ message: 'Job not found' })
    }

    // Update job status
    await prisma.job.update({
      where: { id: req.params.id },
      data: { status: 'cancelled' }
    })

    res.json({ message: 'Job cancelled' })
  } catch (error) {
    console.error('Error cancelling job:', error)
    res.status(500).json({ message: 'Failed to cancel job' })
  }
})

export default router
