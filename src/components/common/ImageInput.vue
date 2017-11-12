<template>
  <div id="image-input">
    <div class="Image-input__image-wrapper">
      <img v-show="imgPreview" :src="imgPreview">
    </div>

    <div class="Image-input__input-wrapper">
      Choose
      <input type="file" @change="previewThumbnail()" :name="inputname" accept="image/*">
    </div>
  </div>
</template>

<script>
export default {
  props: {
    inputname: String
  },
  data() {
    return {
      imgPreview: ''
    }
  },
  methods: {
    // credit: http://taha-sh.com/blog/quick-tip-how-to-use-vuejs-to-preview-images-before-uploading
    previewThumbnail(){
      var input = event.target

      if (input.files && input.files[0]) {
        var reader = new FileReader()
        var vm = this

        reader.onload = function(e) {
          // add the base64 encoded image to component
          vm.imgPreview = e.target.result
        }

        reader.readAsDataURL(input.files[0])
      }
    }
  }
}
</script>
