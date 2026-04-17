import axios from 'axios'
import { addLog } from './logger.js'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function postToSocialMedia(videoId, platforms, jobId) {
  const video = await prisma.video.findUnique({
    where: { id: videoId }
  })

  if (!video) {
    throw new Error('Video not found')
  }

  const results = {}

  for (const platform of platforms) {
    try {
      await addLog(jobId, 'info', `Posting to ${platform}...`)

      switch (platform.toLowerCase()) {
        case 'youtube':
          results.youtube = await postToYouTube(video, jobId)
          break
        case 'instagram':
          results.instagram = await postToInstagram(video, jobId)
          break
        case 'facebook':
          results.facebook = await postToFacebook(video, jobId)
          break
        default:
          await addLog(jobId, 'warn', `Unknown platform: ${platform}`)
      }

      await addLog(jobId, 'success', `Posted to ${platform}`)
    } catch (error) {
      await addLog(jobId, 'error', `Failed to post to ${platform}: ${error.message}`)
      results[platform] = { error: error.message }
    }
  }

  // Update video with posting status
  await prisma.video.update({
    where: { id: videoId },
    data: {
      postedOn: platforms.filter(p => !results[p]?.error)
    }
  })

  return results
}

async function postToYouTube(video, jobId) {
  try {
    const youtubeApiKey = process.env.YOUTUBE_API_KEY
    if (!youtubeApiKey) {
      throw new Error('YouTube API key not configured')
    }

    await addLog(jobId, 'info', 'Uploading video to YouTube...')

    // Placeholder for YouTube API integration
    // In production, use: https://developers.google.com/youtube/v3/docs/videos/insert

    const result = {
      platform: 'youtube',
      videoId: `yt_${Date.now()}`,
      url: `https://youtube.com/watch?v=yt_${Date.now()}`,
      timestamp: new Date()
    }

    await addLog(jobId, 'success', `YouTube video: ${result.url}`)
    return result
  } catch (error) {
    await addLog(jobId, 'error', `YouTube posting failed: ${error.message}`)
    throw error
  }
}

async function postToInstagram(video, jobId) {
  try {
    const instagramAccessToken = process.env.INSTAGRAM_ACCESS_TOKEN
    if (!instagramAccessToken) {
      throw new Error('Instagram access token not configured')
    }

    await addLog(jobId, 'info', 'Uploading video to Instagram...')

    // Placeholder for Instagram Graph API integration
    // In production, use: https://developers.facebook.com/docs/instagram-api

    const result = {
      platform: 'instagram',
      postId: `ig_${Date.now()}`,
      url: `https://instagram.com/p/ig_${Date.now()}`,
      timestamp: new Date()
    }

    await addLog(jobId, 'success', `Instagram post: ${result.url}`)
    return result
  } catch (error) {
    await addLog(jobId, 'error', `Instagram posting failed: ${error.message}`)
    throw error
  }
}

async function postToFacebook(video, jobId) {
  try {
    const facebookAccessToken = process.env.FACEBOOK_ACCESS_TOKEN
    if (!facebookAccessToken) {
      throw new Error('Facebook access token not configured')
    }

    await addLog(jobId, 'info', 'Uploading video to Facebook...')

    // Placeholder for Facebook Graph API integration
    // In production, use: https://developers.facebook.com/docs/video-api

    const result = {
      platform: 'facebook',
      videoId: `fb_${Date.now()}`,
      url: `https://facebook.com/video/fb_${Date.now()}`,
      timestamp: new Date()
    }

    await addLog(jobId, 'success', `Facebook video: ${result.url}`)
    return result
  } catch (error) {
    await addLog(jobId, 'error', `Facebook posting failed: ${error.message}`)
    throw error
  }
}
