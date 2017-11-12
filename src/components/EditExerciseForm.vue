<template>
  <div id="edit-exercise-form">
    <h3>Edit {{ exercise.name }}</h3>

    <button @click="cancelExEdit($event)">Cancel</button>

    <form enctype="multipart/form-data" @submit.prevent="editExercise($event)" method="POST">
      <input name="updateName" type="text" placeholder="{{exercise.name}}">

      <label>Select exercise types:</label>
      <checkbox-list v-bind:inputs="exTypeList"></checkbox-list>

      <label>Live Visual:</label>
      <br>
      <img v-bind:src="currentImage">
      <br>

      <label>Upload New Visual:</label>
      <br>
      <image-input image-src="" v-bind:inputname="'exGifUploader'"></image-input>
      <br>

      <div v-if="formValidationMessage">
        {{ formValidationMessage }}
      </div>
      <br/>

      <div v-if="!deletingExercise">
        <input type="submit" value="Save">
        <button @click="toggleExDelete($event)">Delete Exercise</button>
      </div>

      <div v-if="deletingExercise">
        Are you sure you want to delete {{ exercise.name }}?
        If you confirm this cannot be undone.
        <br/>
        <button @click="toggleExDelete($event)">Cancel</button>
        <button @click="deleteExercise($event)">Delete Exercise</button>
      </div>
    </form>
  </div>
</template>
<script>
import auth from '../auth'
import store from '../vuex/store'
import ImageInput from './common/ImageInput.vue'
import CheckboxList from './common/CheckboxList.vue'

export default{
  props: {
    exercise: Object
  },
  data(){
    return{
      formValidationMessage: '',
      deletingExercise: false,
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
    cancelExEdit(){
      this.$emit('done-editing')
    },
    editExercise(event){
      if (event) event.preventDefault()

      var name = event.target.updateName.value
      var newImg = event.target.exGifUploader.files[0]
      var ogTypes = this.exercise.types
      var selectedExTypes = []

      // set ex types from child type selector to local variable
      for(var i = 0; i < this.exTypeList.length; i++){
        if(this.exTypeList[i].status){
          selectedExTypes.push(this.exTypeList[i].name)
        }
      }

      var updateNameFlag = name ? (name !== this.exercise.name) : false

      var updateTypesFlag = function() {
        if(selectedExTypes.length != ogTypes.length) {
          return true
        }

        for(var i = 0; i < selectedExTypes.length; i++) {
          if (selectedExTypes[i] != ogTypes[i]) {
            return true
          }
        }

        return false
      }()

      // has anything changed
      if(!updateNameFlag && !updateTypesFlag && !newImg){
        // throw eror if nothing has been changed
        this.formValidationMessage = "Nothing has changed"
      } else {
        // create form data and get file input for image
        var formData = new FormData()

        formData.append('id', this.exercise._id)

        // if data has changed; pass to form data
        if(updateNameFlag){
          formData.append('name', name)
        }
        if(updateTypesFlag){
          formData.append('types', JSON.stringify(selectedExTypes))
        }
        if(newImg){
          if(!updateNameFlag) {
            name = this.exercise.name
          }
          var imgName = name.replace(/\s/g,'') + Math.floor(1000 + Math.random() * 9000) + '.' + newImg.name.split('.').pop()
          formData.append('image', newImg, imgName)
        }

        // pass object to database
        auth.updateExercise(this, formData)
        this.emit('done-editing')
      }
    },
    toggleExDelete(event) {
      if (event) event.preventDefault()
      this.deletingExercise = !this.deletingExercise
    },
    deleteExercise(event) {
      if (event) event.preventDefault()
      auth.deleteExercise(this, this.exercise._id)
      this.emit('done-editing')
    }
  },
  components: {
    ImageInput,
    CheckboxList
  },
  ready: function(){
    /*
      loop all exercise passed from parent in props and add to the array, then
      check the respective matching checkbox
    */
    for(var i = 0; i < this.exercise.types.length; i++) {
      var matchVal = this.exercise.types[i]

      this.exTypeList.find(function(item, index) {
        if(item.name === matchVal) {
          item.status = true
        }
      })
    }
  },
  computed: {
    currentImage(){
      // convert link data to image link
      var imageLnk = "https://s3-us-west-2.amazonaws.com/any-city-fitness/exercise-gifs/" + this.exercise.linkName
      return imageLnk
    }
  }
}
</script>
