import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function addLog(jobId, level, message) {
  try {
    await prisma.jobLog.create({
      data: {
        jobId,
        level,
        message,
        timestamp: new Date()
      }
    })

    // Also log to console
    const timestamp = new Date().toISOString()
    console.log(`[${timestamp}] [${level.toUpperCase()}] [Job: ${jobId}] ${message}`)
  } catch (error) {
    console.error('Failed to create log:', error)
  }
}
