<template>
  <div id="login">
    <h1>Sign In Plz</h1>
    <form>
      <input type='text' placeholder="Email" v-model="credentials.username"/>
      <input type='password' placeholder="Password" v-model="credentials.password"/>
      <button class="btn btn-primary" @click="submit($event)">Login</button>
    </form>
  </div>
</template>

<script>
import auth from '../auth'

export default {
  data() {
    return {
      credentials: {
        username: '',
        password: ''
      },
      user: auth.user,
      error: ''
    }
  },
  methods: {
    submit(event) {
      if (event) event.preventDefault()

      var credentials = {
        username: this.credentials.username,
        password: this.credentials.password
      }
      auth.login(this, credentials, 'workouts')
    }
  }
}
</script>
