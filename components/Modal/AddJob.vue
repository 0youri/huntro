<template>
  <UModal :open="open" title="Add job application" @update:open="$emit('update:open', $event)">
    <template #body>
      <UForm :validate="validateJob" :state="newJob" @submit="$emit('submit')">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <UFormField name="title" required>
            <UInput v-model="newJob.title" class="w-full" placeholder="" :ui="{ base: 'peer' }">
              <label class="pointer-events-none absolute left-0 -top-2.5 text-(--ui-text-highlighted) text-xs font-medium px-1.5 transition-all">
                <span class="inline-flex bg-(--ui-bg) px-1">Job Title</span>
              </label>
            </UInput>
          </UFormField>

          <UFormField name="company" required>
            <UInput v-model="newJob.company" class="w-full" placeholder="" :ui="{ base: 'peer' }">
              <label class="pointer-events-none absolute left-0 -top-2.5 text-(--ui-text-highlighted) text-xs font-medium px-1.5 transition-all">
                <span class="inline-flex bg-(--ui-bg) px-1">Company</span>
              </label>
            </UInput>
          </UFormField>

          <UFormField name="link" required>
            <UInput v-model="newJob.link" class="w-full" placeholder="" :ui="{ base: 'peer' }">
              <label class="pointer-events-none absolute left-0 -top-2.5 text-(--ui-text-highlighted) text-xs font-medium px-1.5 transition-all">
                <span class="inline-flex bg-(--ui-bg) px-1">Link to Offer</span>
              </label>
            </UInput>
          </UFormField>

          <UFormField name="notes" required>
            <UInput v-model="newJob.notes" class="w-full" placeholder="" :ui="{ base: 'peer' }">
              <label class="pointer-events-none absolute left-0 -top-2.5 text-(--ui-text-highlighted) text-xs font-medium px-1.5 transition-all">
                <span class="inline-flex bg-(--ui-bg) px-1">Notes</span>
              </label>
            </UInput>
          </UFormField>
        </div>

        <div class="flex gap-5 mt-5">
          <UFormField name="date" class="relative">
            <label class="pointer-events-none absolute left-0 -top-2.5 text-(--ui-text-highlighted) text-xs font-medium px-1.5 transition-all">
              <span class="inline-flex px-1">Date</span>
            </label>
            <UPopover class="static w-36">
              <UButton class="justify-center" color="neutral" variant="subtle" icon="i-lucide-calendar">
                {{ newJob.applied_at ? df.format(newJob.applied_at.toDate()) : 'Select a date' }}
              </UButton>
              <template #content>
                <UCalendar v-model="newJob.applied_at" class="p-2" />
              </template>
            </UPopover>
          </UFormField>

          <UFormField name="status" class="relative" required>
            <label class="pointer-events-none absolute z-10 left-0 -top-2.5 text-(--ui-text-highlighted) text-xs font-medium px-1.5 transition-all">
              <span class="inline-flex px-1">Status</span>
            </label>
            <USelect
              v-model="newJob.status"
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
          <UButton type="submit" label="Add job" color="success" variant="solid" />
        </div>
      </UForm>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { DateFormatter } from '@internationalized/date'
import type { FormError, SelectItem, ChipProps } from '@nuxt/ui'

const props = defineProps<{
  open: boolean
  newJob: any
  statusItems: SelectItem[]
}>()

const emit = defineEmits(['update:open', 'submit'])

function validateJob(state: any): FormError[] {
  const errors = []
  if (!state.title) errors.push({ name: 'title', message: ' ' })
  if (!state.company) errors.push({ name: 'company', message: ' ' })
  return errors
}

function getChip(value: string) {
  return props.statusItems.find(item => item.value === value)?.chip
}

const df = new DateFormatter('fr-FR', {
  dateStyle: 'short'
})
</script>