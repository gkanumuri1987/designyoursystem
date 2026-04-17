import express from 'express'
import { PrismaClient } from '@prisma/client'
import { authenticate } from '../middleware/auth.js'
import { executePipeline } from '../services/pipelineExecutor.js'

const router = express.Router()
const prisma = new PrismaClient()

// Apply auth middleware
router.use(authenticate)

// List pipelines
router.get('/', async (req, res) => {
  try {
    const pipelines = await prisma.pipeline.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' }
    })
    res.json(pipelines)
  } catch (error) {
    console.error('Error fetching pipelines:', error)
    res.status(500).json({ message: 'Failed to fetch pipelines' })
  }
})

// Get single pipeline
router.get('/:id', async (req, res) => {
  try {
    const pipeline = await prisma.pipeline.findFirst({
      where: {
        id: req.params.id,
        userId: req.userId
      }
    })

    if (!pipeline) {
      return res.status(404).json({ message: 'Pipeline not found' })
    }

    res.json(pipeline)
  } catch (error) {
    console.error('Error fetching pipeline:', error)
    res.status(500).json({ message: 'Failed to fetch pipeline' })
  }
})

// Create pipeline
router.post('/', async (req, res) => {
  try {
    const { name, description, genre, languages, aiProvider, aiModel, schedule } = req.body

    if (!name || !genre || !languages || !aiProvider || !aiModel) {
      return res.status(400).json({ message: 'Missing required fields' })
    }

    const pipeline = await prisma.pipeline.create({
      data: {
        userId: req.userId,
        name,
        description: description || '',
        genre,
        languages,
        aiProvider,
        aiModel,
        schedule: schedule || 'once'
      }
    })

    res.status(201).json(pipeline)
  } catch (error) {
    console.error('Error creating pipeline:', error)
    res.status(500).json({ message: 'Failed to create pipeline' })
  }
})

// Update pipeline
router.put('/:id', async (req, res) => {
  try {
    const { name, description, genre, languages, aiProvider, aiModel, schedule, enabled } = req.body

    // Verify ownership
    const pipeline = await prisma.pipeline.findFirst({
      where: {
        id: req.params.id,
        userId: req.userId
      }
    })

    if (!pipeline) {
      return res.status(404).json({ message: 'Pipeline not found' })
    }

    const updated = await prisma.pipeline.update({
      where: { id: req.params.id },
      data: {
        name: name || undefined,
        description: description || undefined,
        genre: genre || undefined,
        languages: languages || undefined,
        aiProvider: aiProvider || undefined,
        aiModel: aiModel || undefined,
        schedule: schedule || undefined,
        enabled: enabled !== undefined ? enabled : undefined
      }
    })

    res.json(updated)
  } catch (error) {
    console.error('Error updating pipeline:', error)
    res.status(500).json({ message: 'Failed to update pipeline' })
  }
})

// Delete pipeline
router.delete('/:id', async (req, res) => {
  try {
    const pipeline = await prisma.pipeline.findFirst({
      where: {
        id: req.params.id,
        userId: req.userId
      }
    })

    if (!pipeline) {
      return res.status(404).json({ message: 'Pipeline not found' })
    }

    await prisma.pipeline.delete({
      where: { id: req.params.id }
    })

    res.json({ message: 'Pipeline deleted' })
  } catch (error) {
    console.error('Error deleting pipeline:', error)
    res.status(500).json({ message: 'Failed to delete pipeline' })
  }
})

// Execute pipeline
router.post('/:id/execute', async (req, res) => {
  try {
    const pipeline = await prisma.pipeline.findFirst({
      where: {
        id: req.params.id,
        userId: req.userId
      }
    })

    if (!pipeline) {
      return res.status(404).json({ message: 'Pipeline not found' })
    }

    // Start execution
    executePipeline(pipeline, req.userId)

    res.json({ message: 'Pipeline execution started', pipelineId: pipeline.id })
  } catch (error) {
    console.error('Error executing pipeline:', error)
    res.status(500).json({ message: 'Failed to execute pipeline' })
  }
})

export default router
