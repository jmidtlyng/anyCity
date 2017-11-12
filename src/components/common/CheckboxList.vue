<template>
  <div id="checkbox-list">
    <span v-for="input in inputs" :key="input.name">
    <input
      value="{{input.name}}"
      type="checkbox"
      v-model="input.status"
      checked="{{input.status}}"
    >
      {{input.name}}
    </input>
  </div>
</template>

<script>
export default {
  /* ------------------------------------------------------------------
    prop details:
    checkbox name ------> input.name
    checked ------> input.status
  ------------------------------------------------------------------ */
  props: {
    inputs: Array
  }
}
</script>
