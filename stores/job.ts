import { defineStore } from 'pinia'
import type { Job } from '~/types/job'
import { getLocalTimeZone, fromDate } from '@internationalized/date'

export const useJobStore = defineStore('jobStore', () => {
  
  // Imports
  const supabase = useSupabaseClient()

  // State
  const jobs = ref<Job[]>([])

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

  return {
    jobs,
    fetchJobs, addJob, deleteJob, updateJob,
  }
})