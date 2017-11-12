<template>
  <div id="workout-link">
    <button>Test</button>
    <button v-if="user.admin">Edit</button>
    <button v-if="user.admin">Delete</button>
  </div>
</template>

<script>
import auth from '../auth'

export default {
  data() {
    return {
      user: auth.user
    }
  }
}
</script>
