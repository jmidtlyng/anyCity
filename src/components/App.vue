<template>
  <div id="app">
    <nav class="navbar navbar-default">
      <div class="container">
        <ul class="nav navbar-nav">
          <!-- header links dependent on auth status -->
          <li v-if="!user.authenticated"><a v-link="'login'">Login</a></li>
          <li v-if="user.authenticated"><a v-link="'logout'" @click="logout()">Logout</a></li>
          <li v-if="user.authenticated"><a v-link="'workouts'">Workouts</a></li>
        </ul>
      </div>
    </nav>
    <div class="container">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import auth from '../auth'
import store from '../vuex/store'

export default {
  data() {
    return {
      user: auth.user
    }
  },
  methods: {
    logout() {
      auth.logout()
    }
  }
}
</script>
