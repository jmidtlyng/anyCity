<template>
  <div id="ex-list">
    <ul id="ExList" style="display:inline-block;">
      <li v-for="exercise in exercises" key="exercise._id">
        <button class="addToWbWipBtn" v-on:click="addToWbWip(exercise)" v-if="isBuilderList">+</button>{{ exercise.name }}
        <button v-on:click="editExercise(exercise)" v-if="isBuilderList">Edit</button>
      </li>
    </ul>
  </div>
</template>
<script>
import auth from '../auth'
import store from '../vuex/store'

export default{
  props: [
    'parent',
    'filters'
  ],
  data(){
    return{
      exercises: []
    }
  },
  watch: {
    filters: function(newFilters){
      this.exercises = auth.filterExercises(this.filters)
    }
  },
  ready: function(){
    var context = this
    auth.getExercises(this, function(){
      context.exercises = auth.filterExercises(context.filters)
    });
  },
  methods: {
    addToWbWip(exInfo){
      // form exercise object
      let exercise = { id: exInfo._id, name: exInfo.name, linkName: exInfo.linkName, reps: 0, sets: 0, min: 0, sec: 0, notes: '' }
      // place exercise in work in progress
      store.dispatch('addExerciseToWip', exercise)
    },
    editExercise(ex){
      // set id to components data to pass to child for editing
      this.$emit('edit-exercise', ex)
    }
  },
  computed: {
    isBuilderList(){
      return this.parent === 'workoutBuilder'
    }
  }
}
</script>
