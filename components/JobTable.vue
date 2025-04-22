<template>
  <div class="flex flex-col flex-1 w-full">
    <div class="flex px-5 py-3.5 border-b border-(--ui-border-accented) space-x-4">
      <UInput v-model="globalFilter" class="max-w-sm" placeholder="Filter..." />
      <UButton label="Add job" color="success" variant="subtle" @click="modalAddJobState = true" />
      <ModalAddJob
        v-model:open="modalAddJobState"
        :newJob="newJob"
        :status-items="statusItems"
        @submit="addJob"
      />

      <ModalEditJob
        v-model:open="modalEditJobState"
        :job="selectedJob"
        :status-items="statusItems"
        @submit="updateJob"
      />
      
    </div>

    <UTable
      ref="table"
      v-model:global-filter="globalFilter"
      v-model:sorting="sorting"
      :data="data"
      :columns="columns"
    />

  </div>
</template>

<script setup lang="ts">
  import { h, resolveComponent, ref } from 'vue'
  import type { TableColumn, FormError, SelectItem, ChipProps } from '@nuxt/ui'
  import { DateFormatter, getLocalTimeZone, fromDate } from '@internationalized/date'
  import type { Row } from '@tanstack/vue-table'

  const UBadge = resolveComponent('UBadge')
  const UInput = resolveComponent('UInput')
  const USelect = resolveComponent('USelect')
  const ULink = resolveComponent('ULink')
  const UButton = resolveComponent('UButton')
  const UDropdownMenu = resolveComponent('UDropdownMenu')

  const modalAddJobState = ref(false)
  const modalEditJobState = ref(false)
  const selectedJob = ref<Job | null>(null)

  const newJob = reactive({
    title: '',
    company: '',
    status: 'Sent',
    link: '',
    applied_at: shallowRef(fromDate(new Date(), getLocalTimeZone())),
    notes: ''
  })

  type Job = {
    id: number
    title: string
    company: string
    status: string
    link: string
    applied_at: Date
    notes: string
  }

  const statusItems = ref([
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
      label: 'Rejected',
      value: 'Rejected',
      chip: { color: 'error' }
    },
    {
      label: 'Accepted',
      value: 'Accepted',
      chip: { color: 'success' }
    }
  ] satisfies SelectItem[])

  function getChip(value: string) {
    return statusItems.value.find(statusItems => statusItems.value === value)?.chip
  }
  const data = ref<Job[]>([
    {
      id: 1,
      title: 'Frontend Developer',
      company: 'Google',
      status: 'Sent',
      link: 'https://careers.google.com/jobs/12345',
      applied_at: new Date('2024-03-15'),
      notes: 'Waiting for reply.'
    },
  ])

  const validateJob = (state: any): FormError[] => {
    const errors = []
    if (!state.title) errors.push({ name: 'title', message: ' ' })
    if (!state.company) errors.push({ name: 'company', message: ' ' })
    return errors
  }

  const addJob = () => {
    const tempNewJob: Job = {
      id: Date.now(),
      title: newJob.title,
      company: newJob.company,
      status: newJob.status,
      link: newJob.link,
      applied_at: newJob.applied_at.toDate(),
      notes: newJob.notes
    }
    data.value = [...data.value, tempNewJob]
    modalAddJobState.value = false
  }

  const updateJob = () => {
    if (!selectedJob.value) return
    const index = data.value.findIndex(job => job.id === selectedJob.value!.id)
    if (index !== -1) {
      data.value[index] = { 
        ...selectedJob.value,
        applied_at: selectedJob.value.applied_at.toDate()
      }
      data.value = [...data.value]
    }
    modalEditJobState.value = false
  }


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
            label: 'Rejected',
            value: 'Rejected',
            chip: { color: 'error' }
          },
          {
            label: 'Accepted',
            value: 'Accepted',
            chip: { color: 'success' }
          }
        ]

        const getChip = (value: string) =>
          statusItems.find(item => item.value === value)?.chip

        return h(USelect, {
          modelValue: row.original.status,
          'onUpdate:modelValue': (value: string) => {
            row.original.status = value
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
        const date = new Date(row.getValue('applied_at'))
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
          const appliedAtDate = new Date(row.original.applied_at)
          selectedJob.value = { 
            ...row.original,
            applied_at: shallowRef(fromDate(appliedAtDate, getLocalTimeZone()))
          }

          modalEditJobState.value = true
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
    
  function deleteJob(id: number) {
    data.value = data.value.filter(job => job.id !== id)
  }
  const globalFilter = ref('')

  const df = new DateFormatter('fr-FR', {
    dateStyle: 'short'
  })

</script>
