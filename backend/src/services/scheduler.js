import cron from 'node-cron'
import { PrismaClient } from '@prisma/client'
import { executePipeline } from './pipelineExecutor.js'

const prisma = new PrismaClient()
const activeJobs = new Map()

export function initializeScheduler() {
  console.log('Initializing pipeline scheduler...')

  // Schedule check every minute
  const job = cron.schedule('* * * * *', async () => {
    try {
      const pipelines = await prisma.pipeline.findMany({
        where: { enabled: true }
      })

      for (const pipeline of pipelines) {
        if (shouldExecute(pipeline)) {
          console.log(`Scheduled execution triggered for pipeline: ${pipeline.name}`)
          executePipeline(pipeline, pipeline.userId)
        }
      }
    } catch (error) {
      console.error('Scheduler error:', error)
    }
  })

  activeJobs.set('schedule-check', job)
}

function shouldExecute(pipeline) {
  const lastRun = pipeline.lastRunAt ? new Date(pipeline.lastRunAt) : null
  const now = new Date()

  switch (pipeline.schedule) {
    case 'daily':
      if (!lastRun) return true
      const daysDiff = (now - lastRun) / (1000 * 60 * 60 * 24)
      return daysDiff >= 1

    case 'weekly':
      if (!lastRun) return true
      const weeksDiff = (now - lastRun) / (1000 * 60 * 60 * 24 * 7)
      return weeksDiff >= 1

    case 'monthly':
      if (!lastRun) return true
      const monthsDiff = (now - lastRun) / (1000 * 60 * 60 * 24 * 30)
      return monthsDiff >= 1

    case 'once':
    default:
      return false
  }
}

export function stopScheduler() {
  for (const [key, job] of activeJobs) {
    job.stop()
    activeJobs.delete(key)
  }
  console.log('Scheduler stopped')
}
