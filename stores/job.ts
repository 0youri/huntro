import { defineStore } from 'pinia'
import type { Job } from '~/types/job'
import { getLocalTimeZone, fromDate } from '@internationalized/date'

export const useJobStore = defineStore('jobStore', () => {
  
  // Imports
  const supabase = useSupabaseClient()

  // State
  const jobs = ref<Job[]>([])

  // Extract job information
  const extractedJob = ref<null | {
    title: string
    company: string
    location: string
  }>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const generateGroqPrompt = (html: string) => `
    You are an AI assistant that extracts structured data from job offer pages.

    From the HTML content below, extract only the following and return them in a compact JSON format:

    - "title": The exact job title (remove location or extra info if present).
    - "company": The company name only.
    - "location": Only the city name. If no city is specified and the offer mentions "remote" or "full remote", return "Remote".

    Only return a valid JSON object with keys: "title", "company", and "location". Do not include any extra text, explanations, or Markdown.

    HTML:
    ${html.slice(0, 8000)}
  `

  // Actions
  async function fetchJobs() {
    const { data, error } = await supabase
      .from('applications')
      .select()

      if (data) {
        const formatted = data.map(job => ({
          ...job,
          applied_at: new Date(job.applied_at)
        })) 
  
        jobs.value = formatted as Job[]
      }
  }

  async function addJob(job: Job) {
    const { error } = await supabase
      .from('applications')
      .insert({ 
        title: job.title,
        company: job.company,
        location: job.location,
        status: job.status,
        link: job.link,
        notes: job.notes,
        applied_at: job.applied_at,
        user_id: job.user_id,
       })

       if (!error) {
        jobs.value = [...jobs.value, job]
       } else {
        console.error('Error adding job:', error)
       }
  }

  async function deleteJob(id: number) {
    const { error } = await supabase
      .from('applications')
      .delete()
      .eq('id', id)
    if (!error) {
      jobs.value = jobs.value.filter(job => job.id !== id)
    } else {
      console.error('Error deleting job:', error)
    }
  }

  async function updateJob(job: Job) {
    const { error } = await supabase
      .from('applications')
      .update({
        title: job.title,
        company: job.company,
        location: job.location,
        status: job.status,
        link: job.link,
        notes: job.notes,
        applied_at: job.applied_at,
      })
      .eq('id', job.id)

    if (!error) {
      const index = jobs.value.findIndex(j => j.id === job.id)
      if (index !== -1) {
        jobs.value[index] = { ...job }
        jobs.value = [...jobs.value]
      }
    } else {
      console.error('Error updating job:', error)
    }
  }

  async function extractJobInfoFromUrl(url: string) {
    loading.value = true
    error.value = null
    extractedJob.value = null

    if (url.includes('linkedin.com')) {
      throw new Error('LinkedIn links are not supported. Please use other job boards.')
    }
    
    try {
      // Step 1: Extract relevant data from HTML using Cheerio
      const { data: extractData, error: extractError } = await useFetch('/api/extractRelevantHtml', {
        query: { url }
      })

      if (extractError.value || !extractData.value?.extracted) {
        throw new Error('Failed to extract relevant HTML content')
      }
      // console.log('Extracted data:', extractData.value.extracted)
      // Step 2: Send relevant content to Groq for parsing
      const { data: groqData, error: groqError } = await useFetch('/api/groq', {
        method: 'POST',
        body: { prompt: generateGroqPrompt(extractData.value.extracted) }
      })

      if (groqError.value || !groqData.value?.response) {
        throw new Error('Failed to extract job info using AI')
      }

      let parsed = {}
      const match = groqData.value.response.match(/```(?:json)?\s*([\s\S]*?)\s*```/)
      if (match) {
        parsed = JSON.parse(match[1].trim())
      } else {
        try {
          parsed = JSON.parse(groqData.value.response.trim())
        } catch (e) {
          throw new Error('Failed to parse Groq response')
        }
      }

      extractedJob.value = {
        title: parsed.title || '',
        company: parsed.company || '',
        location: parsed.location || ''
      }
    } catch (err: any) {
      error.value = err.message || 'Unknown error occurred'
    } finally {
      loading.value = false
    }
  }

  return {
    jobs, extractedJob,
    fetchJobs, addJob, deleteJob, updateJob, extractJobInfoFromUrl,
  }
})