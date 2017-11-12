<template>
  <div id="wb-wip">
    <ul id="wbWipExList" style="display:inline-block;">
      <li v-for="(index, exercise) in wbWip">
        <workout-wip-item v-bind:exercise="wbWip[index]"></workout-wip-item>
      </li>
    </ul>
    <button id="createWorkoutBtn" @click="createWorkout" v-if="hasWbWip" style="display: block; margin: auto;">Create Workout</button>
  </div>
</template>
<script>
import auth from '../auth'
import store from '../vuex/store'
import WorkoutWipItem from './WorkoutWipItem.vue'

export default {
  methods: {
    createWorkout(){

    }
  },
  computed: {
    wbWip(){
      return store.state.wbWip
    },
    hasWbWip(){
      if(this.wbWip.length > 0){
        return true
      }else{
        return false
      }
    }
  },
  components: {
    WorkoutWipItem
  }
}
</script>
