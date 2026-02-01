<script setup lang="ts" async>
import { useAppStore } from '@/stores/AppStore.ts'
import html2pdf from 'html2pdf.js'
import { computed, ref } from 'vue'

const scoreSheetContent = ref<HTMLDivElement>()

const store = useAppStore()

type Html2PdfOptions = typeof html2pdf extends {
  (element: HTMLElement, options?: infer O): unknown
}
  ? O
  : never

const exportPdf = () => {
  const options: Html2PdfOptions = {
    margin: 0.5,
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
    filename: 'obob-score-' + store.roundTime + '.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'legal', orientation: 'portrait' },
  }
  html2pdf().from(scoreSheetContent.value!).set(options).save()
}

const total = computed(() => {
  const team1 = subtotalInWhichBook.value.team1 + subtotalContent.value.team1
  const team2 = subtotalInWhichBook.value.team2 + subtotalContent.value.team2
  return { team1, team2 }
})

const subtotalInWhichBook = computed(() => {
  let team1 = 0
  let team2 = 0
  if (store.questionSet) {
    for (const q of store.questionSet!.inWhichBook!) {
      team1 += q.score[1]?.points ?? 0
      team2 += q.score[2]?.points ?? 0
    }
  }
  return { team1, team2 }
})

const subtotalContent = computed(() => {
  let team1 = 0
  let team2 = 0
  if (store.questionSet) {
    for (const q of store.questionSet.content!) {
      team1 += q.score[1]?.points ?? 0
      team2 += q.score[2]?.points ?? 0
    }
  }
  return { team1, team2 }
})
</script>

<template>
  <dialog
    id="scoresheet_modal"
    class="modal modal-middle"
    v-if="store.questionSet && store.backupQuestionSet"
  >
    <div class="modal-box w-[90%] max-h-[90vh] max-w-[50rem] px-12 pt-10 pb-12 text-md">
      <div ref="scoreSheetContent">
        <div class="flex gap-x-4 mb-2">
          <div class="w-3/4">
            <div class="flex gap-x-4">
              <div class="font-bold w-22">Date/Time:</div>
              <div>{{ store.roundTime }}</div>
            </div>
            <div class="flex gap-x-4">
              <div class="font-bold w-22">Moderator:</div>
              <div>{{ store.moderatorName }}</div>
            </div>
          </div>
          <div>
            <div class="flex gap-x-4">
              <div class="font-bold w-28 text-right">Question Set:</div>
              <div>{{ store.questionSet!.number }}</div>
            </div>
            <div class="flex gap-x-4">
              <div class="font-bold w-28 text-right">Backup Set:</div>
              <div>{{ store.backupQuestionSet!.number }}</div>
            </div>
          </div>
        </div>
        <table class="w-full">
          <thead>
            <tr>
              <th class="col"></th>
              <th
                colspan="2"
                class="bg-team1-50 col w-1/2"
              >
                {{ store.team1.name }}
              </th>
              <th
                colspan="2"
                class="bg-team2-50 col w-1/2"
              >
                {{ store.team2.name }}
              </th>
            </tr>
            <tr class="text-sm">
              <th class="col bg-gray-400"></th>
              <th class="col bg-gray-400 text-gray-50">Incorrect Response</th>
              <th class="col bg-gray-400 text-gray-50">Points</th>
              <th class="col bg-gray-400 text-gray-50">Points</th>
              <th class="col bg-gray-400 text-gray-50">Incorrect Response</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th class="col text-center bg-gray-300 text-slate-600 py-1 text-md">#</th>
              <td
                colspan="4"
                class="col text-center bg-gray-300 text-slate-600 py-1 text-md"
              >
                "In Which Book" Questions
              </td>
            </tr>
            <tr
              v-for="q of store.questionSet?.inWhichBook"
              :key="q.type + q.number"
            >
              <td class="col">
                <div>Q{{ q.number }}.</div>
                <div
                  class="text-xs text-error"
                  v-if="q.backupReplacement"
                >
                  (Backup #{{ q.backupReplacement.number }})
                </div>
              </td>
              <td class="col bg-team1-50 answer team1">
                <span
                  v-if="q.score[1].points < 5 && q.score[1].wrongAnswer"
                  class="w-full"
                >
                  {{ q.score[1].wrongAnswer }}
                </span>
              </td>
              <td class="col points team1 bg-team1-100">
                {{ q.score[1].points > 0 ? q.score[1].points : '' }}
              </td>
              <td class="col points team2 bg-team2-100">
                {{ q.score[2].points > 0 ? q.score[2].points : '' }}
              </td>
              <td class="col answer team2 bg-team2-50">
                <div v-if="q.score[2].points < 5 && q.score[2].wrongAnswer">
                  {{ q.score[2].wrongAnswer }}
                </div>
              </td>
            </tr>
            <tr>
              <td class="col">Subtotal:</td>
              <td class="bg-team1-50 text-team1-content col"></td>
              <td class="bg-team1-100 text-team1-content col">{{ subtotalContent.team1 }}</td>
              <td class="bg-team2-100 text-team2-content col">{{ subtotalContent.team2 }}</td>
              <td class="bg-team2-50 text-team2-content col"></td>
            </tr>
            <tr>
              <th class="col text-center bg-gray-300 text-slate-600 py-1 text-md">#</th>
              <td
                colspan="4"
                class="col text-center bg-gray-300 text-slate-600 py-1 text-md"
              >
                "Content" Questions
              </td>
            </tr>
            <tr
              v-for="q of store.questionSet?.content"
              :key="q.type + q.number"
            >
              <td class="col">
                <div>Q{{ q.number }}.</div>
                <div
                  class="text-xs text-error"
                  v-if="q.backupReplacement"
                >
                  (Backup #{{ q.backupReplacement.number }})
                </div>
              </td>
              <td class="col bg-team1-50 answer team1">
                <span
                  v-if="q.score[1].points < 5 && q.score[1].wrongAnswer"
                  class="w-full"
                >
                  {{ q.score[1].wrongAnswer }}
                </span>
              </td>
              <td class="col points team1 bg-team1-100">
                {{ q.score[1].points > 0 ? q.score[1].points : '' }}
              </td>
              <td class="col points team2 bg-team2-100">
                {{ q.score[2].points > 0 ? q.score[2].points : '' }}
              </td>
              <td class="col answer team2 bg-team2-50">
                <div v-if="q.score[2].points < 5 && q.score[2].wrongAnswer">
                  {{ q.score[2].wrongAnswer }}
                </div>
              </td>
            </tr>
            <tr>
              <td class="col">Subtotal:</td>
              <td class="bg-team1-50 text-team1-content col"></td>
              <td class="bg-team1-100 text-team1-content col">{{ subtotalContent.team1 }}</td>
              <td class="bg-team2-100 text-team2-content col">{{ subtotalContent.team2 }}</td>
              <td class="bg-team2-50 text-team2-content col"></td>
            </tr>
            <tr>
              <th class="col bg-gray-500"></th>
              <td
                colspan="4"
                class="bg-gray-500 text-gray-50 col uppercase"
              >
                Final scores
              </td>
            </tr>
            <tr>
              <td
                class="col"
                colspan="2"
              >
                Final:
              </td>
              <td class="bg-team1-100 text-team1-content col">
                <span>{{ total.team1 }}</span>
                <span
                  v-if="total.team1 > total.team2"
                  class="ml-4 badge badge-primary relative -top-0.5"
                  >Winner!</span
                >
                <span
                  v-if="total.team1 === total.team2"
                  class="ml-4 badge badge-neutral relative -top-0.5"
                  >Tie</span
                >
              </td>
              <td class="bg-team2-100 text-team2-content col">
                <span>{{ total.team2 }}</span>
                <span
                  v-if="total.team2 > total.team1"
                  class="ml-4 badge badge-primary relative -top-0.5"
                  >Winner!</span
                >
                <span
                  v-if="total.team1 === total.team2"
                  class="ml-4 badge badge-neutral relative -top-0.5"
                  >Tie</span
                >
              </td>
              <td class="bg-white text-team2-content col"></td>
            </tr>
            <tr>
              <td
                colspan="2"
                class="text-center"
              >
                Spokesperson Signed off?
              </td>
              <td class="bg-team1-100 text-team1-content col">
                <input
                  type="checkbox"
                  v-model="store.signoff.team1"
                  class="checkbox checkbox-sm"
                />
              </td>
              <td class="bg-team2-100 text-team2-content col">
                <input
                  type="checkbox"
                  v-model="store.signoff.team2"
                  class="checkbox checkbox-sm"
                />
              </td>
              <td class="bg-white text-team2-content col"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="flex justify-center mt-0 gap-4">
      <div
        class="btn"
        onmouseup="if (scoresheet_modal.open) { scoresheet_modal.close() }"
      >
        Close Popup
      </div>
      <div
        class="btn btn-primary"
        @click="exportPdf"
      >
        Export Score Sheet
      </div>
    </div>
  </dialog>
</template>

<style scoped>
@reference "tailwindcss";

th.col {
}

table {
  @apply border border-gray-300;
}
thead tr:first-child th {
  @apply border-t border-gray-300;
}
.col {
  @apply px-4 py-2 max-w-1/2 w-1/4 text-center border-b border-gray-400 h-10;
}
.col.team1 {
  @apply border-purple-300;
}
.col.team2 {
  @apply border-orange-300;
}
</style>
