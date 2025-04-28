<template>
  <div class="flex flex-col flex-1 w-full">
    <div class="flex px-2.5 lg:px-12.5 py-3.5 border-b border-(--ui-border-accented) space-x-4">
      <UInput v-model="globalFilter" class="max-w-sm" placeholder="Filter..." />
      <UButton label="Add job" color="success" variant="subtle" @click="openAddJobModal" />
      <JobModal
        v-model:open="jobModal"
        :job="currentJob"
        :isEdit="isEditMode"
        @submit="isEditMode ? updateJob(currentJob) : addJob(currentJob)"
      />
    </div>

    <UTable
      ref="table"
      v-model:global-filter="globalFilter"
      v-model:sorting="sorting"
      :data="jobs"
      :columns="columns"
      class="lg:px-10"
    />

  </div>
</template>

<script setup lang="ts">
  import { h, resolveComponent, ref } from 'vue'
  import type { TableColumn } from '@nuxt/ui'
  import { getLocalTimeZone, fromDate } from '@internationalized/date'
  import type { Row } from '@tanstack/vue-table'
  import type { Job } from '~/types/job'
  import { useJobStore } from '~/stores/job'

  const user = useSupabaseUser()

  const UInput = resolveComponent('UInput')
  const USelect = resolveComponent('USelect')
  const ULink = resolveComponent('ULink')
  const UButton = resolveComponent('UButton')
  const UDropdownMenu = resolveComponent('UDropdownMenu')
  const { fetchJobs, addJob, deleteJob, updateJob } = useJobStore();
  const { jobs } = storeToRefs(useJobStore());


  onMounted( async () => {
    fetchJobs()
  })

  const globalFilter = ref('')
  const jobModal = ref(false)
  const isEditMode = ref(false)
  const currentJob = ref<Job>(emptyJob())

  const sorting = ref([
    {
      id: 'applied_at',
      desc: true
    }
  ])

  const columns: TableColumn<Job>[] = [
    {
      accessorKey: 'title',
      header: 'Title',
    },
    {
      accessorKey: 'company',
      header: 'Company'
    },
    {
      accessorKey: 'location',
      header: 'Location'
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const statusItems = [
          {
            label: 'Sent',
            value: 'Sent',
            chip: { color: 'info' }
          },
          {
            label: 'Interview',
            value: 'Interview',
            chip: { color: 'warning' }
          },
          {
            label: 'Declined',
            value: 'Declined',
            chip: { color: 'error' }
          },
          {
            label: 'Offer',
            value: 'Offer',
            chip: { color: 'success' }
          }
        ]

        const getChip = (value: string) =>
          statusItems.find(item => item.value === value)?.chip

        return h(USelect, {
          modelValue: row.original.status,
          'onUpdate:modelValue': (value: string) => {
            row.original.status = value
            updateJob(row.original)
          },
          items: statusItems,
          valueKey: 'value',
          color: 'neutral',
          class: 'w-36 capitalize'
        }, {
          leading: ({ modelValue, ui }: any) =>
            modelValue ? h(resolveComponent('UChip'), {
              ...getChip(modelValue),
              inset: true,
              standalone: true,
              size: ui.itemLeadingChipSize(),
              class: ui.itemLeadingChip()
            }) : null
        })
      }
    },
    {
      accessorKey: 'applied_at',
      header: 'Applied At',
      cell: ({ row }) => {
        const date: Date = row.getValue('applied_at')
        const day = String(date.getDate()).padStart(2, '0')
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const year = date.getFullYear()
        return `${day}/${month}/${year}`
      }
    },
    {
      accessorKey: 'notes',
      header: 'Notes',
      cell: ({ row }) => {
        return h(UInput, {
          modelValue: row.getValue('notes'),
          placeholder: 'Add notes...',
          class: 'w-52 md:w-full',
          color: 'neutral',
          'onUpdate:modelValue': (value: string) => {
            row.original.notes = value
            updateJob(row.original)
          }
        })
      }
    },
    {
      accessorKey: 'link',
      header: '',
      cell: ({ row }) => {
        const url = row.getValue('link')
        if (!url) {
          return h('span', {
            class: 'font-medium text-gray-600 cursor-not-allowed'
          }, 'No Offer')
        }
        return h(ULink, {
          to: url,
          external: true,
          title: `Open offer: ${url}`,
          target: '_blank',
          class: 'font-medium text-blue-600 hover:text-blue-400 dark:text-blue-400 dark:hover:text-blue-200 transition-colors'
        }, {
          default: () => [
            h('span', 'View Offer'),
          ]
        })
      }
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        return h(
          'div',
          { class: 'text-right' },
          h(
            UDropdownMenu,
            {
              content: {
                align: 'end'
              },
              items: getRowItems(row),
              'aria-label': 'Actions dropdown'
            },
            () =>
              h(UButton, {
                icon: 'i-lucide-ellipsis-vertical',
                color: 'neutral',
                variant: 'ghost',
                class: 'ml-auto',
                'aria-label': 'Actions dropdown'
              })
          )
        )
      }
    }

  ]

  function getRowItems(row: Row<Job>) {
    return [
      {
        label: 'Edit',
        icon: 'i-lucide-edit',
        onSelect: () => {
          openEditJobModal(row.original)
        }
      },
      {
        label: 'Delete',
        icon: 'i-lucide-trash',
        color: 'error',
        onSelect: () => {
          deleteJob(row.original.id)
        }
      }
    ]
  }
    
  function emptyJob(): Job {
    const today = fromDate(new Date(), getLocalTimeZone()).toDate()
    return {
      id: Date.now(),
      title: '',
      company: '',
      location: '',
      link: '',
      notes: '',
      applied_at: today,
      status: 'Sent',
      user_id: user.value.id
    }
  }

  function openAddJobModal() {
    currentJob.value = emptyJob()
    isEditMode.value = false
    jobModal.value = true
  }

  function openEditJobModal(job: Job) {
    currentJob.value = job
    isEditMode.value = true
    jobModal.value = true
  }
  
</script>
