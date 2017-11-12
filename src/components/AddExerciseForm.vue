<template>
  <div id="add-exercise-form">
    <h3>Add Exercise</h3>
    <form enctype="multipart/form-data" @submit.prevent="createExercise($event)" method="POST">
      <input type="text" placeholder="Exercise Name" v-model="exName">
      <label>Select exercise types:</label>
      <checkbox-list v-bind:inputs="exTypeList"></checkbox-list>
      <image-input image-src="" v-bind:inputname="'exGifUploader'"></image-input>
      <br>
      <div v-if="formValidationMessage">
        {{ formValidationMessage }}
      </div>
      <br/>
      <input type="submit" value="Save">
    </form>
  </div>
</template>

<script>
import auth from '../auth'
import store from '../vuex/store'
import ImageInput from './common/ImageInput.vue'
import CheckboxList from './common/CheckboxList.vue'

export default {
  data() {
    return {
      exName: '',
      formValidationMessage: '',
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
    createExercise(event){
      // get image from input
      var exImg = event.target.exGifUploader.files[0]

      // set ex types from child type selector to local variable
      var selectedExTypes = []
      for(var i = 0; i < this.exTypeList.length; i++){
        if(this.exTypeList[i].status){
          selectedExTypes.push(this.exTypeList[i].name)
        }
      }
      // if name is missing for exercise throw user warning
      if(!this.exName){
        this.formValidationMessage = "Please enter an exercise name"
      }
      // if no types are chosen, require one to be selected
      else if (selectedExTypes.length === 0){
        this.formValidationMessage = "Please mark at least one exercise type"
      }
      // if name is entered but image/gif is missing throw user warning
      else if(!exImg){
        this.formValidationMessage = "Please add an image or GIF"
      } else {
        // exercise name
        var exName = this.exName

        // make file name
        var imgName = exName.replace(/\s/g,'') + Math.floor(1000 + Math.random() * 9000) + '.' + exImg.name.split('.').pop()

        // create form data and get file input for image
        var formData = new FormData()

        formData.append('name', exName)
        formData.append('types', JSON.stringify(selectedExTypes))
        formData.append('image', exImg, imgName)

        // pass object to database
        auth.createExercise(this, formData)
        // hide add exercise modal
        this.$emit('close-add-ex-form')
      }
    }
  },
  components: {
    ImageInput,
    CheckboxList
  }
}
</script>
