<script setup lang="ts" async>
import ObobQuestions from '@/components/ObobQuestions.vue'
import TeamData from '@/components/TeamData.vue'
import IconClearOctagon from '~icons/mdi/clear-octagon'
import { ref } from 'vue'
import { useAppStore } from '@/stores/AppStore.ts'

const restartModal = ref<HTMLDialogElement>()
const store = useAppStore()

const handleRestartConfirmation = () => {
  store.resetApp()
  restartModal.value?.removeAttribute('open')
}
</script>

<template>
  <div class="flex w-full gap-x-8">
    <div class="fieldset mt-13 flex flex-col w-1/3">
      <TeamData :team-number="1" />
      <div class="divider divider-horizontal" />
      <TeamData :team-number="2" />

      <div class="flex flex-col items-center">
        <div class="flex flex-wrap leading-4 gap-x-4 gap-y-2 justify-center mt-2">
          <div
            class="btn btn-neutral cursor-pointer"
            onclick="welcome_script_modal.showModal()"
          >
            Welcome Script
          </div>
          <div
            class="btn btn-neutral cursor-pointer"
            onclick="scoresheet_modal.showModal()"
          >
            Score Sheet
          </div>
        </div>

        <div
          class="hover:bg-red-700 hover:text-white mt-2 p-1 rounded-lg w-52 group transition-colors duration-500 cursor-pointer"
          onclick="restart_confirm.showModal()"
        >
          <div class="flex justify-center items-center text-center gap-x-1">
            <IconClearOctagon class="text-[1rem]" />
            Reset / Start Over
          </div>
          <div class="transition-opacity duration-500 delay-250 opacity-0 group-hover:opacity-100 text-center">Confirmation will be required.</div>
        </div>
      </div>
    </div>

    <ObobQuestions class="w-2/3" />

    <dialog
      id="restart_confirm"
      ref="restartModal"
      class="modal"
    >
      <div class="modal-box text-center">
        <form method="dialog">
          <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>
        <h3 class="text-lg font-bold text-error">Are you sure you want to <strong>start over</strong>?</h3>
        <p class="py-4">Any progress in this round will be lost.</p>

        <div class="flex gap-x-8 justify-center items-center">
          <div
            class="cursor-pointer hover:underline"
            onclick="restart_confirm.close()"
          >
            Oops! Nevermind.
          </div>
          <div
            class="btn btn-warning"
            @click="handleRestartConfirmation"
          >
            I'm sure!
          </div>
        </div>
      </div>
    </dialog>
  </div>
</template>

<style scoped></style>
