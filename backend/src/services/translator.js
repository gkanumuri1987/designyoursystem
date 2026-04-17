import { addLog } from './logger.js'

export async function translateContent(content, languages, jobId) {
  const translations = {}

  try {
    for (const language of languages) {
      if (language === 'English') {
        translations[language] = content
        continue
      }

      await addLog(jobId, 'info', `Translating to ${language}...`)

      // Placeholder for translation API integration
      // In production, this would use Google Translate API, DeepL, etc.

      translations[language] = {
        title: `${content.title} (${language})`,
        description: `${content.description} (translated to ${language})`,
        script: content.script,
        scenes: content.scenes
      }

      await addLog(jobId, 'success', `Translated to ${language}`)
    }

    return translations
  } catch (error) {
    await addLog(jobId, 'error', `Translation error: ${error.message}`)
    throw error
  }
}
