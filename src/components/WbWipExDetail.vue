<template>
  <div id="wb-wip-ex-detail">
    <div>
      <label>Exercise Name</label>
      <input type="text" v-model="exercise.name">
      <br/>
      <label>sets</label>
      <input type="number" v-model="exercise.sets" min="0">
      <br/>
      <label>reps</label>
      <input type="number" v-model="exercise.reps" min="0">
      <br/>
      <label>Duration:</label>
      <br/>
      <label>min-</label>
      <input type="number" v-model="exercise.min" min="0">
      <label>sec-</label>
      <input type="number" v-model="exercise.sec" min="0" max="59">
      <br/>
      <label>Notes:</label>
      <br/>
      <textarea placeholder="add notes here" v-model="exercise.notes"></textarea>
    </div>
    <button @click="saveAndClose">Save & Close</button>
  </div>
</template>
<script>
import store from '../vuex/store'

export default {
  props: [
    'exercise'
  ],
  methods: {
    saveAndClose(){
      this.$emit('close-edit')
    }
  }
}
</script>
