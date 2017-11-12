<template>
  <div id="workout-builder">
    <div v-if="!showAddExForm && !exToEdit">
      <div id="exerciseFinder">
        <label>Workout Name</label>
        <br>
        <input type="text" placeholder="Workout Name">
        <br>
        <ex-search-filter v-on:update-filters="filterExList"></ex-search-filter>
      </div>

      <div v-if="!wipExToEdit">
        <ex-list
          parent="workoutBuilder"
          v-bind:filters="listFilters"
          v-on:edit-exercise="editExerciseSetup">
        </ex-list>

        <div v-if="user.admin">
          <!-- button reads close if exercise module is open -->
          <div v-if="!exToEdit">
            <button @click="toggleAddExerciseForm($event)">
              <span v-if="!showAddExForm">Create Exercise</span>
              <span v-else>Cancel</span>
            </button>

            <div v-if="showAddExForm">
              <add-exercise-form @close-add-ex-form="toggleAddExerciseForm"></add-exercise-form>
            </div>
          </div>
        </div>

        <wb-wip style="display: inline-block; vertical-align: top;" v-on:edit-wip-ex="editWipEx"></wb-wip>
      </div>

      <div v-else>
        <wb-wip-ex-detail v-bind:exindex="newEx"></wb-wip-ex-detail>
        <button @click="closeExDetail">Save</button>
        <button @click="removeExFromWip">Cancel</button>
      </div>
    </div>

    <div v-if="user.admin">
      <div v-if="!showAddExForm && exToEdit">
        <edit-exercise-form
          v-bind:exercise="exToEdit"
          v-on:done-editing="clearExToEdit">
        </edit-exercise-form>
      </div>
    </div>
  </div>
</template>

<script>
import auth from '../auth'
import store from '../vuex/store'
import AddExerciseForm from './AddExerciseForm.vue'
import EditExerciseForm from './EditExerciseForm.vue'
import WbWip from './WbWip.vue'
import WbWipExDetail from './WbWipExDetail.vue'
import ExList from './ExList.vue'
import ExSearchFilter from './ExerciseSearchFilter.vue'

export default {
  data() {
    return {
      user: auth.user,
      showAddExForm: false,
      exToEdit: null,
      listFilters: null,
      wipExToEdit: null
    }
  },
  methods: {
    clearExToEdit(){
      this.exToEdit = null
    },
    closeExDetail(){
      store.dispatch('closeWorkoutExerciseDetailForm')
    },
    editExerciseSetup(ex){
      this.exToEdit = ex
    },
    editWipEx(ex){

    },
    filterExList(filters){
      this.listFilters = filters
    },
    removeExFromWip(){
      store.dispatch('removeExerciseFromWip', this.newEx)
      store.dispatch('closeWorkoutExerciseDetailForm')
    },
    toggleAddExerciseForm(event){
      if (event) event.preventDefault()
      // toggle add exercise form
      this.showAddExForm = !this.showAddExForm
    }
  },
  computed: {
    wbWip(){
      return store.state.wbWip
    },
    newEx(){
      return (store.state.wbWip.length - 1)
    }
  },
  components: {
    AddExerciseForm,
    EditExerciseForm,
    ExList,
    WbWip,
    WbWipExDetail,
    ExSearchFilter
  }
}
</script>
