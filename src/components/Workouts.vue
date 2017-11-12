<template>
  <div id="workouts-list">
    <login v-if="!user.authenticated"></login>
    <div v-if="user.authenticated">
      <button @click="openWorkoutBuilder()">Create a workout</button>
      <workout-link></workout-link>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Login from './Login.vue'
import WorkoutLink from './WorkoutLink.vue'
import auth from '../auth'
import VueRouter from 'vue-router'
// allow the router
Vue.use(VueRouter)
// instantiate the vue router
export var router = new VueRouter()

export default {
  data() {
    return {
      user: auth.user
    }
  },
  methods: {
    openWorkoutBuilder() {
      router.go('/workoutBuilder')
    }
  },
  components: {
    Login,
    WorkoutLink
  }
}
</script>
