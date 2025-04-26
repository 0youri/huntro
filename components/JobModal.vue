<template>
  <UModal
    :open="open"
    :title="isEdit ? 'Edit job application' : 'Add job application'"
    @update:open="$emit('update:open', $event)"
  >
    <template #body>
      <div v-if="!isEdit" class="mb-7">
        <UForm :state="state" @submit="extractJobInfoFromUrl(state.link)" class="flex flex-row gap-5">
          <UInput
            v-model="state.link"
            class="w-2/3"
            placeholder=""
            :loading="loading"
            :ui="{ base: 'peer' }"
          >
            <label class="pointer-events-none absolute left-0 -top-2.5 text-(--ui-text-highlighted) text-xs font-medium px-1.5 transition-all">
              <span class="inline-flex bg-(--ui-bg) px-1">Link to Offer</span>
            </label>
          </UInput>
          <UButton
            type="submit"
            class="w-1/3 justify-center"
            color="neutral"
            variant="subtle"
            icon="i-lucide-link"
            label="Extract job info"
          />
        </UForm>
        <span class="text-sm text-red-400 ml-2">{{ errorExtractedJob }}</span>
        <USeparator label="OR" />
      </div>
      <UForm :validate="validateJob" :state="job" @submit="$emit('submit'); $emit('update:open', false); state.link = ''">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <UFormField name="title" required>
            <UInput :disabled="loading" v-model="job.title" class="w-full" placeholder="" :ui="{ base: 'peer' }">
              <label class="pointer-events-none absolute left-0 -top-2.5 text-(--ui-text-highlighted) text-xs font-medium px-1.5 transition-all">
                <span class="inline-flex bg-(--ui-bg) px-1">Job Title</span>
              </label>
            </UInput>
          </UFormField>

          <UFormField name="company" required>
            <UInput :disabled="loading" v-model="job.company" class="w-full" placeholder="" :ui="{ base: 'peer' }">
              <label class="pointer-events-none absolute left-0 -top-2.5 text-(--ui-text-highlighted) text-xs font-medium px-1.5 transition-all">
                <span class="inline-flex bg-(--ui-bg) px-1">Company</span>
              </label>
            </UInput>
          </UFormField>

          <UFormField name="link" required>
            <UInput :disabled="loading" v-model="job.link" class="w-full" placeholder="" :ui="{ base: 'peer' }">
              <label class="pointer-events-none absolute left-0 -top-2.5 text-(--ui-text-highlighted) text-xs font-medium px-1.5 transition-all">
                <span class="inline-flex bg-(--ui-bg) px-1">Link to Offer</span>
              </label>
            </UInput>
          </UFormField>

          <UFormField name="location" required>
            <UInput :disabled="loading" v-model="job.location" class="w-full" placeholder="" :ui="{ base: 'peer' }">
              <label class="pointer-events-none absolute left-0 -top-2.5 text-(--ui-text-highlighted) text-xs font-medium px-1.5 transition-all">
                <span class="inline-flex bg-(--ui-bg) px-1">Location</span>
              </label>
            </UInput>
          </UFormField>
          
          <UFormField :disabled="loading" class="col-span-2" name="notes" required>
            <UInput v-model="job.notes" class="w-full" placeholder="" :ui="{ base: 'peer' }">
              <label class="pointer-events-none absolute left-0 -top-2.5 text-(--ui-text-highlighted) text-xs font-medium px-1.5 transition-all">
                <span class="inline-flex bg-(--ui-bg) px-1">Notes</span>
              </label>
            </UInput>
          </UFormField>
        </div>

        <div class="flex gap-5 mt-5">
          <UFormField name="date">
            <UPopover class="w-36">
              <UButton
                class="justify-center"
                :class="!calendarDate ? 'border-red-500 border' : ''"
                color="neutral"
                variant="subtle"
                icon="i-lucide-calendar"
              >
                {{ calendarDate ? df.format(calendarDate.toDate(getLocalTimeZone())) : 'Select a date' }}
              </UButton>
              <template #content>
                <UCalendar v-model="calendarDate" class="p-2" />
              </template>
            </UPopover>
          </UFormField>

          <UFormField name="status" required>
            <USelect
              v-model="job.status"
              :items="statusItems"
              value-key="value"
              placeholder="Select status"
              class="w-36"
            >
              <template #leading="{ modelValue, ui }">
                <UChip
                  v-if="modelValue"
                  v-bind="getChip(modelValue)"
                  inset
                  standalone
                  :size="(ui.itemLeadingChipSize() as ChipProps['size'])"
                  :class="ui.itemLeadingChip()"
                />
              </template>
            </USelect>
          </UFormField>
        </div>

        <div class="flex gap-2 justify-end mt-5">
          <UButton label="Cancel" color="neutral" variant="subtle" @click="$emit('update:open', false)" />
          <UButton type="submit" :label="isEdit ? 'Save changes' : 'Add job'" color="success" />
        </div>
      </UForm>
    </template>
  </UModal>
</template>

<script setup lang="ts">
  import { CalendarDate, DateFormatter, getLocalTimeZone } from '@internationalized/date'
  import type { FormError, SelectItem, ChipProps } from '@nuxt/ui'
  import type { Job } from '~/types/job'
  import { useJobStore } from '~/stores/job';

  const { extractJobInfoFromUrl } = useJobStore();
  const { extractedJob, errorExtractedJob, loading } = storeToRefs(useJobStore());

  const state = reactive({
    link: ''
  })
  const props = defineProps<{
    open: boolean
    job: Job        
    isEdit: boolean    
  }>()

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

  const calendarDate = shallowRef(
    new CalendarDate(props.job.applied_at.getFullYear(), props.job.applied_at.getMonth() + 1, props.job.applied_at.getDate())
  )

  watch(() => props.job.applied_at, (newVal) => {
    if (!newVal) return
    calendarDate.value = new CalendarDate(newVal.getFullYear(), newVal.getMonth() + 1, newVal.getDate())
  })

  watch(calendarDate, (newVal) => {
    if (!newVal) return

    const newDate = newVal.toDate(getLocalTimeZone())
    const currentDate = props.job.applied_at

    if (
      currentDate.getFullYear() !== newDate.getFullYear() ||
      currentDate.getMonth() !== newDate.getMonth() ||
      currentDate.getDate() !== newDate.getDate()
    ) {
      props.job.applied_at = newDate
    }
  })

  watch(extractedJob, (newVal) => {
    if (!newVal) return
    props.job.title = newVal.title
    props.job.company = newVal.company
    props.job.location = newVal.location
    props.job.link = newVal.link
  })

  const emit = defineEmits(['update:open', 'submit'])

  function validateJob(state: any): FormError[] {
    const errors = []
    if (!state.title) errors.push({ name: 'title', message: ' ' })
    if (!state.company) errors.push({ name: 'company', message: ' ' })
    if (!state.location) errors.push({ name: 'location', message: ' ' })
    if (!calendarDate.value) errors.push({ name: 'date', message: ' ' })
    return errors
  }

  function getChip(value: string) {
    return statusItems.value.find(item => item.value === value)?.chip
  }

  const df = new DateFormatter('fr-FR', {
    dateStyle: 'short'
  })
</script>