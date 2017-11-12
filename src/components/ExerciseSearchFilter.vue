<template>
  <div id="ex-search-filter">
    <label>Search: </label>
    <input type="text" placeholder="Burpees" v-model="exSearchVal" v-on:keyup="fetchMatchingExercises">
    <br/>
    <label>Filter by exercise types:</label>
    <checkbox-list v-on:change="fetchMatchingExercises" v-bind:inputs="exTypeList"></checkbox-list>
  </div>
</template>
<script>
import store from '../vuex/store'
import CheckboxList from './common/CheckboxList.vue'

export default {
  data(){
    return{
      exSearchVal: '',
      exTypeList: [
        { 'name' : 'Legs', 'status' : false },
        { 'name' : 'Back', 'status' : false },
        { 'name' : 'Chest', 'status' : false },
        { 'name' : 'Shoulders', 'status' : false },
        { 'name' : 'Arms', 'status' : false },
        { 'name' : 'Core', 'status' : false },
        { 'name' : 'Cardio', 'status' : false }
      ]
    }
  },
  methods: {
    fetchMatchingExercises(){
      var filters = {
        search: this.exSearchVal,
        types: this.exTypeList
      }
      this.$emit('update-filters', filters)
    }
  },
  components: {
    CheckboxList
  }
}
</script>
