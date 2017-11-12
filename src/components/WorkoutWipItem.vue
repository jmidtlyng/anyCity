<template>
  <div id="workout-wip-item">
    {{ exercise.name }}
    <span v-if="exercise.sets > 0">{{ exercise.sets }} x </span>
    <span v-if="exercise.reps > 0">{{ exercise.reps }}</span>
    <span v-if="exercise.min > 0">{{ exercise.min }}</span>
    <span v-if="exercise.min == 0 && exercise.sec > 0">0</span>
    <span v-if="exercise.min > 0 && exercise.sec == 0">:00</span>
    <span v-if="exercise.sec > 0">:</span>
    <span v-if="exercise.sec > 0 && exercise.sec < 10">0</span>
    <span v-if="exercise.sec > 0">{{ exercise.sec }}</span>

    <button @click="toggleEdit" v-if="!editing">Edit</button>

    <wb-wip-ex-detail v-bind:exercise="exercise" v-if="editing" v-on:close-edit="toggleEdit"></wb-wip-ex-detail>

    <button class="workoutBuilderRemoveExBtn" @click="removeFromWbWip">Remove</button>
    <button class="workoutBuilderExCopyBtn" @click="copyInWip" v-if="!editing">Copy</button>

    <div v-if="exercise.notes.length > 0">
      <span> *</span>
      <span>{{ exercise.notes }}</span>
    </div>
  </div>
</template>
<script>
import store from '../vuex/store'
import WbWipExDetail from './WbWipExDetail.vue'

export default {
  props: [
    'exercise',
  ],
  data(){
    return{
      editing: false
    }
  },
  methods: {
    removeFromWbWip(){
      store.dispatch('removeExerciseFromWip', this.exercise)
    },
    copyInWip(){
      // form exercise object
      let exCopy = { id: (this.exercise._id + "_copy_" + Math.round(9999 * Math.random())), name: this.exercise.name, linkName: this.exercise.linkName, reps: this.exercise.reps, sets: this.exercise.sets, min: this.exercise.min, sec: this.exercise.sec, notes:  this.exercise.notes }
      store.dispatch('addExerciseToWip', exCopy);
    },
    toggleEdit(){
      this.editing = !this.editing
    }
  },
  components: {
    WbWipExDetail
  }
}
</script>
