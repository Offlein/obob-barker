<script setup lang="ts" async>
import { useAppStore } from '@/stores/AppStore.ts'
import { ref } from 'vue'

const modal = ref<HTMLDialogElement>()
const store = useAppStore()

const useBackupQuestion = () => {
  store.useBackupQuestion()
}
</script>

<template>
  <dialog
    id="use_backup_modal"
    ref="modal"
    class="modal modal-middle"
  >
    <div class="modal-box w-[90%] md:w-[50%] p-2 max-w-[50rem] p-12">
      <strong>You're about to use a backup question!</strong>
      <div class="my-4">
        <p>
          Do this if you accidentally read the answer to a question -- or otherwise something went
          wrong that means this question cannot be used.
        </p>
        <p>
          Please <strong>let your OBOB organizers know</strong> that a backup question was used for
          this round so it may be invalidated for future use.
        </p>
      </div>
      <div class="border border-gray-400 p-4 my-4">
        Question #{{ store.activeQuestionKey.number }} will be removed and a backup question used.
      </div>
      <div class="mt-6 flex flex-wrap justify-center gap-x-4 gap-y-2">
        <div
          class="btn order-2 md:order-1"
          onclick="use_backup_modal.close()"
        >
          Never mind!
        </div>
        <div
          class="btn btn-accent order-1 md:order-2"
          @click="useBackupQuestion"
          onmouseup="use_backup_modal.close()"
        >
          Replace this question with a backup.
        </div>
      </div>
    </div>
  </dialog>
</template>

<style scoped>
@reference "tailwindcss";

p:not(:last-child) {
  @apply mb-4;
}
</style>
