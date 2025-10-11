<script setup lang="ts" async>
import PdfLoader from '@/components/PdfLoader.vue'
import ObobQuestions from '@/components/ObobQuestions.vue'
import TeamData from '@/components/TeamData.vue'
import { useAppStore } from '@/stores/AppStore.ts'

const store = useAppStore()

</script>

<template>
  <Suspense>
    <div
      class="mx-auto max-w-[60rem] w-9/10"
      onmouseup="if (welcome_modal.open) { welcome_modal.close() }"
    >
      <h1 class="text-xl thing">OBOB Barker</h1>

      <div class="">
        <div v-if="store.showConfig" class="card shadow">
          <Transition>
            <div class="hero bg-base-200 py-8" v-if="store.configScreen === 'file'">
              <div class="hero-content text-center flex-col">
                <PdfLoader />
                <Transition>
                  <div
                    class="mx-auto text-center mt-6"
                    v-if="store.questionSet"
                  >
                    <button
                      class="btn btn-primary btn-lg"
                      @click="store.configScreen = 'teams'"
                    >OK! Let's add the teams
                    </button>
                  </div>
                </Transition>
              </div>
            </div>
          </Transition>
          <Transition>
            <div
              class="card shadow bg-base-200 p-16"
              v-if="store.configScreen === 'teams'"
            >
              <div class="flex flex-col gap-y-4 w-3/4 justify-center items-center mx-auto">
                <TeamData
                  :team-number="1"
                  :is-gameplay="false"
                  class="w-full"
                />
                <TeamData
                  :team-number="2"
                  :is-gameplay="false"
                  class="w-full"
                />
              </div>

              <div class="mx-auto text-center mt-6">
                <button
                  class="btn btn-primary btn-lg"
                  @click="store.showConfig = false"
                  :disabled="!store.team1.name || !store.team2.name"
                >Start
                </button>
              </div>
            </div>
          </Transition>

          <div class="bg-neutral p-8 text-white mx-auto w-full flex justify-center">
            <ul class="steps w-3/4 mx-auto text-center">
              <li class="step step-accent cursor-pointer" @click="store.configScreen = 'file'">
                Choose Questions
              </li>
              <li class="step"
                  :class="{ 'step-accent cursor-pointer' : store.configScreen === 'teams'}">Set up
                Teams
              </li>
            </ul>
          </div>
        </div>

        <div
          v-else
          class="flex w-full gap-x-8"
        >
          <div
            class="fieldset mt-13 flex flex-col w-1/3"
          >
            <TeamData :team-number="1" />
            <div class="divider divider-horizontal" />
            <TeamData :team-number="2" />

            <div
              class="btn btn-neutral mt-2"
              onclick="welcome_modal.showModal()"
            >
              Show Welcome Speech
            </div>
          </div>

          <ObobQuestions
            class="w-2/3"
          />
        </div>
      </div>

      <dialog id="welcome_modal" class="modal modal-middle">
        <div class="modal-box w-3/8 max-w-[90%] p-12 text-xl">
          <p>You are all pros at this point, so we’ll just go over a few quick reminders about
            rules & guidelines, and then get straight to play.</p>
          <p>“In Which Book” questions are worth 5 points for the full title and full name
            of the author. If only one part is answered correctly then partial points will be
            given (3 points for the book title, 2 points for the author/s).
          </p>
          <p>
            “Content” questions are worth 5 points each. For those that require 2 part
            answers:
          </p>
          <ul>
            <li>3 points are awarded for a correct response to one part and 2 points are awarded for
              the second correct response.
            </li>
            <li>If only one part is answered correctly, 3 points will be given.</li>
          </ul>
          <p>Once the question has been asked, you will have 15 seconds to confer as a team
            - this is the time for your “Huddle!” Put your heads together and whisper to each
            other to confirm your answer and make sure your spokesperson is confident in
            the answer they should give. This quiet huddle is an important skill to practice in
            case you make it to Regionals.</p>
          <p>Once the timer goes off, you’ll be asked for your response: REMEMBER only
            the spokesperson for your team can give the team’s answer - no help from
            any other team members or you will lose points.</p>
          <p> As a reminder this year there IS points pick-up, or “stealing” points - teams
            may pick up full or partial points when another team answers incorrectly. So talk
            quietly in your huddle!!</p>
          <p>At the end, you’ll have a chance to consider and make a challenge - only one
            per team, and only for an answer your team gave that you feel was actually
            correct. Any challenges or concerns about the score need to be addressed
            during this battle, and can’t be adjusted later. So we encourage you to
            make a challenge, if you feel like an answer you gave was judged unfairly.</p>
          <ul>
            <li>If your team has made a challenge, your team can reference 1-2 copies of the book.
            </li>
          </ul>
          <p>You will have 2 minutes to find the evidence in the book that supports your challenge.
            After the final score is announced and each spokesperson has signed off on
            the scores, we’ll let you know what happens next with the battle schedule.</p>
          <p>
            For those who are here as audience members, please remember to keep
            distractions to a minimum. Thank you!</p>

          <p>This is a big day, teams. Tensions can run high during this final round, so this is
            a good time to remember how far you’ve come, and how the hard work of
            everyone competing is what makes this fun. Let’s all take good care of ourselves
            and each other, with kindness and respect.</p>
          <p>
            OKAY – shake off some energy, or take a deep breath...and let’s go!
          </p>
        </div>
      </dialog>
    </div>
  </Suspense>
</template>

<style scoped>
@reference "tailwindcss";

p:not(:last-child) {
  @apply mb-8;
}
</style>
