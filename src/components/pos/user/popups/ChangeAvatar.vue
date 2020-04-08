<template>
  <div id="avatar-modal" class="modal fade" role="dialog" data-keyboard="false">
    <div class="modal-dialog modal-dialog-centered">
      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header" style="background-color: rgb(245, 245, 245)">
          <h4 class="modal-title">Change Avatar</h4>
        </div>
        <div class="modal-body stores-list-container">
          <button @click="selectFile" class="white--text upload-button">
            Upload Picture
          </button>
          <input
            style="display: none"
            id="fileUploader"
            type="file"
            accept="image/*"
            @change="changeImg()"
            ref="fileUpload"
          />
          <img :src="selectedImage" alt="Image" />
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="tables-btn-style"
            @click.prevent="changeImage()"
          >
            Submit
          </button>
          <button type="button" class="tables-btn-style" data-dismiss="modal">
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      selectedImage: '',
      uploadInProgress: false,
    }
  },
  methods: {
    selectFile() {
      this.$refs.fileUpload.click()
    },
    changeImg() {
      let reader = new FileReader()
      let that = this
      reader.onload = () => {
        that.selectedImage = reader.result
      }
      let res = reader.readAsDataURL(this.$refs.fileUpload.files[0])
      /* eslint-disable */
      console.log(res, this.$refs.fileUpload.files[0])
      return res
    },
    changeImage() {
      if (this.selectedImage) {
        if (!this.uploadInProgress) {
          this.uploadInProgress = true
          this.$store
            .dispatch('auth/changeAvatar', {
              avatar:this.selectedImage
            })
            .then(() => {
              this.resetForm()
            })
            .catch(error => {
              this.errors = error
            })
            .finally(() => {
              this.resetForm()
            })
        }
      }
    },
    resetForm(){
      this.selectedImage = ''
    }
  },
}
</script>
<style lang="scss" scoped>
img{
  max-width: 200px;
  max-height: 150px;
}
.modal-title {
  font-weight: 500;
}
.tables-btn-style {
  margin-left: 21px;
  background: #cc3232;
  color: white;
  width: 10%;
  border: none;
  font-size: 12.75px;
}

.modal-header {
  flex-direction: row;
  background-color: rgb(245, 245, 245);
}
.modal-dialog {
  max-width: 90% !important;
  min-height: 80% !important;
}
</style>
