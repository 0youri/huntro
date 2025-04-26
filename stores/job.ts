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
    link: string
  }>(null)
  const errorExtractedJob = ref<string | null>(null)

  const loading = ref(false)
  const generateGroqPrompt = (html: string) => `
    You are an AI assistant that extracts job offer information from HTML.

    From the content below, extract:
    - Title: the exact job title (remove location or extra info if present)
    - Company: the company name only
    - Location: the city name only (if none is found and the job is remote, output "Remote")

    Return the result in the following exact format:

    <Title>:<Company>:<Location>

    Only output the string — no JSON, no Markdown, no explanations.

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
    errorExtractedJob.value = null
    extractedJob.value = null
    if (url.includes('linkedin.com')) {
      errorExtractedJob.value = 'LinkedIn links are not supported'
      return
    } 
    // else if (url.includes('indeed.com')) {
    //   errorExtractedJob.value = 'Indeed links are not supported'
    //   return
    // }

    try {
      // Step 1: Extract relevant data from HTML using Cheerio
      const { data: extractData, error: extractError } = await useFetch('/api/extractRelevantHtml', {
        query: { url }
      })

      if (extractError.value || !extractData.value?.extracted) {
        errorExtractedJob.value = extractError.value?.data.message
        return
      }

      // Step 2: Send relevant content to Groq for parsing
      const { data: groqData, error: groqError } = await useFetch('/api/groq', {
        method: 'POST',
        body: { prompt: generateGroqPrompt(extractData.value.extracted) }
      })

      if (groqError.value || !groqData.value?.response) {
        errorExtractedJob.value = 'Failed to extract job info'
        return
      }

      const parts = groqData.value.response.trim()

      if (!parts.includes(':') || parts.split(':').length !== 3) {
        errorExtractedJob.value = 'Failed to extract job info'
        return
      }
      const [title, company, location] = parts.split(':')


      extractedJob.value = {
        title: title || '',
        company: company || '',
        location: location || '',
        link: url,
      }
    } catch (err: any) {
      errorExtractedJob.value = 'Failed to extract job info'
      return
    } finally {
      loading.value = false
    }
  }

  return {
    jobs, extractedJob, errorExtractedJob, loading,
    fetchJobs, addJob, deleteJob, updateJob, extractJobInfoFromUrl,
  }
})