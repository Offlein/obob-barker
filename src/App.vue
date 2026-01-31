<script setup lang="ts" async>
import { useAppStore } from '@/stores/AppStore.ts'
import ObobConfig from '@/views/ObobConfig.vue'
import ObobGameplay from '@/views/ObobGameplay.vue'
import WelcomeScriptModal from '@/components/WelcomeScriptModal.vue'
import ScoreBoardModal from '@/components/ScoreBoardModal.vue'
import UseBackupModal from '@/components/UseBackupModal.vue'

const store = useAppStore()
</script>

<template>
  <div
    class="bg-base-300 w-full h-full"
    :class="{ gameMode: store.showConfig === false }"
  >
    <div class="root-background" />
    <Suspense>
      <div class="pt-24 overflow-hidden">
        <div class="bob-barker" />

        <div
          class="z-[1] relative mx-auto max-w-[60rem] w-9/10"
          onmouseup="if (welcome_script_modal.open) { welcome_script_modal.close() }"
        >
          <div class="">
            <ObobConfig v-if="store.showConfig" />
            <ObobGameplay v-else />
          </div>

          <ScoreBoardModal />
          <WelcomeScriptModal />
          <UseBackupModal />
        </div>
      </div>
    </Suspense>
  </div>
</template>

<style scoped>
@reference 'tailwindcss';

.root-background {
  @apply bg-[url(/curtain-tile.png)] w-full h-full fixed;
  transition: opacity 2s;
}
.gameMode .root-background {
  opacity: 0;
}
.gameMode .bob-barker {
  mix-blend-mode: normal;
  opacity: 0.05;
  transition: all 1s;
}

.bob-barker {
  @apply z-[0] w-1/2 h-full fixed left-0 bottom-0 bg-contain bg-bottom-left bg-no-repeat bg-[url(/bob-barker-white.svg)];
}
</style>
