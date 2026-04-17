import express from 'express'
import { PrismaClient } from '@prisma/client'
import { authenticate } from '../middleware/auth.js'

const router = express.Router()
const prisma = new PrismaClient()

// Apply auth middleware
router.use(authenticate)

// List videos
router.get('/', async (req, res) => {
  try {
    const { genre, language } = req.query

    const where = { userId: req.userId }
    if (genre && genre !== 'all') where.genre = genre
    if (language) where.language = language

    const videos = await prisma.video.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    })

    res.json(videos)
  } catch (error) {
    console.error('Error fetching videos:', error)
    res.status(500).json({ message: 'Failed to fetch videos' })
  }
})

// Get single video
router.get('/:id', async (req, res) => {
  try {
    const video = await prisma.video.findFirst({
      where: {
        id: req.params.id,
        userId: req.userId
      }
    })

    if (!video) {
      return res.status(404).json({ message: 'Video not found' })
    }

    res.json(video)
  } catch (error) {
    console.error('Error fetching video:', error)
    res.status(500).json({ message: 'Failed to fetch video' })
  }
})

// Delete video
router.delete('/:id', async (req, res) => {
  try {
    const video = await prisma.video.findFirst({
      where: {
        id: req.params.id,
        userId: req.userId
      }
    })

    if (!video) {
      return res.status(404).json({ message: 'Video not found' })
    }

    // Delete video file from storage (implement as needed)
    // deleteFile(video.url)

    await prisma.video.delete({
      where: { id: req.params.id }
    })

    res.json({ message: 'Video deleted' })
  } catch (error) {
    console.error('Error deleting video:', error)
    res.status(500).json({ message: 'Failed to delete video' })
  }
})

// Get videos by genre
router.get('/genre/:genre', async (req, res) => {
  try {
    const videos = await prisma.video.findMany({
      where: {
        userId: req.userId,
        genre: req.params.genre
      },
      orderBy: { createdAt: 'desc' }
    })

    res.json(videos)
  } catch (error) {
    console.error('Error fetching videos:', error)
    res.status(500).json({ message: 'Failed to fetch videos' })
  }
})

export default router
