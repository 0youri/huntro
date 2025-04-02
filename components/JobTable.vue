<template>
  <div class="flex flex-col flex-1 w-full">
    <div class="flex px-5 py-3.5 border-b border-(--ui-border-accented)">
      <UInput v-model="globalFilter" class="max-w-sm" placeholder="Filter..." />
    </div>

    <UTable
      ref="table"
      v-model:global-filter="globalFilter"
      v-model:sorting="sorting"
      :data="data"
      :columns="columns"
      class="px-5"
    />
  </div>
</template>

<script setup lang="ts">
import { h, resolveComponent, ref } from 'vue'
import type { TableColumn } from '@nuxt/ui'

const UBadge = resolveComponent('UBadge')
const UInput = resolveComponent('UInput')
const USelect = resolveComponent('USelect')
const ULink = resolveComponent('ULink')

type Job = {
  id: number
  title: string
  company: string
  status: string
  link: string
  applied_at: string
  notes: string
}

const data = ref<Job[]>([
  {
    id: 1,
    title: 'Frontend Developer',
    company: 'Google',
    status: 'Sent',
    link: 'https://careers.google.com/jobs/12345',
    applied_at: '2024-03-15',
    notes: 'Waiting for reply.'
  },
  {
    id: 2,
    title: 'Fullstack Engineer',
    company: 'Spotify',
    status: 'Interview',
    link: 'https://www.spotifyjobs.com/job/45678',
    applied_at: '2024-03-10',
    notes: 'First round completed.'
  },
  {
    id: 3,
    title: 'Product Manager',
    company: 'Notion',
    status: 'Rejected',
    link: 'https://www.notion.so/careers/pm',
    applied_at: '2024-02-28',
    notes: 'Got a rejection email.'
  },
  {
    id: 4,
    title: 'UX Designer',
    company: 'Figma',
    status: 'Accepted',
    link: 'https://figma.com/careers/ux-designer',
    applied_at: '2024-03-01',
    notes: 'Offer signed.'
  },
  {
    id: 5,
    title: 'Backend Developer',
    company: 'Amazon',
    status: 'Sent',
    link: 'https://www.amazon.jobs/en/jobs/56789',
    applied_at: '2024-03-18',
    notes: ''
  },
  {
    id: 6,
    title: 'Data Scientist Meta Meta',
    company: 'Meta Meta Meta',
    status: 'Interview',
    link: 'https://www.metacareers.com/jobs/23456',
    applied_at: '2024-03-05',
    notes: 'Second round scheduled.'
  },
  {
    id: 7,
    title: 'Mobile Developer',
    company: 'Uber',
    status: 'Rejected',
    link: 'https://www.uber.com/global/en/careers/list/78901',
    applied_at: '2024-02-20',
    notes: ''
  },
  {
    id: 8,
    title: 'DevOps Engineer',
    company: 'Netflix',
    status: 'Accepted',
    link: 'https://jobs.netflix.com/jobs/90123',
    applied_at: '2024-03-03',
    notes: 'Starting next month.'
  }
])

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
  }
]

const globalFilter = ref('')
</script>
