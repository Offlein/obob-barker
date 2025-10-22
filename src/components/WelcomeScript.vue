<script setup lang="ts" async>
</script>

<template>
  <dialog id="welcome_modal" class="modal modal-middle">
    <div class="modal-box w-[90%] max-w-[50rem] p-12 text-xl">
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
</template>


<style scoped>
@reference "tailwindcss";

p:not(:last-child) {
  @apply mb-8;
}
</style>
