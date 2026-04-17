import { PrismaClient } from '@prisma/client'
import { v4 as uuidv4 } from 'uuid'
import { addLog } from './logger.js'
import { generateVideoWithAI } from './videoGenerator.js'
import { translateContent } from './translator.js'

const prisma = new PrismaClient()

const PIPELINE_STEPS = [
  { id: 'content', name: 'Generate Content' },
  { id: 'translate', name: 'Translate Content' },
  { id: 'generate', name: 'Generate Video' },
  { id: 'postprocess', name: 'Post Processing' },
  { id: 'upload', name: 'Upload & Archive' },
]

export async function executePipeline(pipeline, userId) {
  const jobId = uuidv4()

  try {
    // Create job record
    const job = await prisma.job.create({
      data: {
        id: jobId,
        userId,
        pipelineId: pipeline.id,
        pipelineName: pipeline.name,
        genre: pipeline.genre,
        language: pipeline.languages[0],
        status: 'running',
        steps: PIPELINE_STEPS.map(step => ({
          id: step.id,
          name: step.name,
          running: false,
          completed: false,
          progress: 0,
          error: null
        }))
      }
    })

    await addLog(jobId, 'info', `Pipeline execution started: ${pipeline.name}`)

    let currentJob = job
    let videoData = null

    // Step 1: Generate Content
    try {
      await updateStepStatus(jobId, 'content', true)
      await addLog(jobId, 'info', 'Step 1: Generating content with AI...')

      const content = await generateContent(pipeline, jobId)
      videoData = { ...videoData, content }

      await updateStepStatus(jobId, 'content', false, true)
      await addLog(jobId, 'success', 'Content generated successfully')
    } catch (error) {
      await updateStepStatus(jobId, 'content', false, false, error.message)
      await addLog(jobId, 'error', `Content generation failed: ${error.message}`)
      throw error
    }

    // Step 2: Translate Content
    try {
      await updateStepStatus(jobId, 'translate', true)
      await addLog(jobId, 'info', `Step 2: Translating to ${pipeline.languages.join(', ')}...`)

      const translations = await translateContent(videoData.content, pipeline.languages, jobId)
      videoData = { ...videoData, translations }

      await updateStepStatus(jobId, 'translate', false, true)
      await addLog(jobId, 'success', 'Translation completed')
    } catch (error) {
      await updateStepStatus(jobId, 'translate', false, false, error.message)
      await addLog(jobId, 'error', `Translation failed: ${error.message}`)
      throw error
    }

    // Step 3: Generate Video
    try {
      await updateStepStatus(jobId, 'generate', true)
      await addLog(jobId, 'info', 'Step 3: Generating video...')

      const videoUrl = await generateVideoWithAI(
        videoData.content,
        videoData.translations,
        pipeline,
        jobId
      )
      videoData = { ...videoData, videoUrl }

      await updateStepStatus(jobId, 'generate', false, true)
      await addLog(jobId, 'success', 'Video generation completed')
    } catch (error) {
      await updateStepStatus(jobId, 'generate', false, false, error.message)
      await addLog(jobId, 'error', `Video generation failed: ${error.message}`)
      throw error
    }

    // Step 4: Post Processing
    try {
      await updateStepStatus(jobId, 'postprocess', true)
      await addLog(jobId, 'info', 'Step 4: Post-processing video...')

      // Add branding, watermarks, subtitles, etc.
      await new Promise(resolve => setTimeout(resolve, 2000))

      await updateStepStatus(jobId, 'postprocess', false, true)
      await addLog(jobId, 'success', 'Post-processing completed')
    } catch (error) {
      await updateStepStatus(jobId, 'postprocess', false, false, error.message)
      await addLog(jobId, 'error', `Post-processing failed: ${error.message}`)
      throw error
    }

    // Step 5: Upload & Archive
    try {
      await updateStepStatus(jobId, 'upload', true)
      await addLog(jobId, 'info', 'Step 5: Uploading and archiving...')

      // Create video records for each language
      for (const language of pipeline.languages) {
        const titleData = videoData.translations[language] || videoData.content
        const video = await prisma.video.create({
          data: {
            userId,
            jobId,
            genre: pipeline.genre,
            title: titleData.title,
            titleEn: videoData.content.title,
            description: titleData.description,
            url: videoData.videoUrl,
            language,
            postedOn: []
          }
        })

        await addLog(jobId, 'info', `Video archived for ${language}`)
      }

      await updateStepStatus(jobId, 'upload', false, true)
      await addLog(jobId, 'success', 'Upload and archiving completed')
    } catch (error) {
      await updateStepStatus(jobId, 'upload', false, false, error.message)
      await addLog(jobId, 'error', `Upload failed: ${error.message}`)
      throw error
    }

    // Mark job as completed
    await prisma.job.update({
      where: { id: jobId },
      data: { status: 'completed', completedAt: new Date() }
    })

    await addLog(jobId, 'success', 'Pipeline execution completed successfully')

    // Update pipeline's last run time
    await prisma.pipeline.update({
      where: { id: pipeline.id },
      data: { lastRunAt: new Date() }
    })

  } catch (error) {
    console.error('Pipeline execution failed:', error)

    await prisma.job.update({
      where: { id: jobId },
      data: {
        status: 'failed',
        error: error.message,
        completedAt: new Date()
      }
    })

    await addLog(jobId, 'error', `Pipeline execution failed: ${error.message}`)
  }
}

async function generateContent(pipeline, jobId) {
  // This would call the AI model to generate initial content
  // For now, returning mock data
  await addLog(jobId, 'info', `Using ${pipeline.aiProvider} - ${pipeline.aiModel}`)

  return {
    title: `${pipeline.genre} Story - ${new Date().toLocaleDateString()}`,
    description: `A ${pipeline.genre.toLowerCase()} story generated by AI`,
    script: `[Generated script for ${pipeline.genre}]`,
    scenes: [
      { duration: 10, description: 'Scene 1' },
      { duration: 15, description: 'Scene 2' }
    ]
  }
}

async function updateStepStatus(jobId, stepId, running, completed = false, error = null) {
  const job = await prisma.job.findUnique({ where: { id: jobId } })
  const steps = (job.steps || []).map(step => {
    if (step.id === stepId) {
      return {
        ...step,
        running: running && !completed && !error,
        completed: completed && !error,
        error: error
      }
    }
    return step
  })

  await prisma.job.update({
    where: { id: jobId },
    data: { steps }
  })
}
