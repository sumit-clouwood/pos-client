<template>
  <div
    id="name-email-modal"
    class="modal fade"
    role="dialog"
    data-keyboard="false"
  >
    <div class="modal-dialog modal-dialog-centered">
      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header" style="background-color: rgb(245, 245, 245)">
          <h4 class="modal-title">{{ _t('Change Name And Email') }}</h4>
        </div>
        <div class="modal-body">
          <form>
            <input
              type="text"
              autocomplete="off"
              class="field-input"
              :placeholder="_t('Name')"
              pattern="[A-Za-z]"
              v-model="name"
              required
            />
            <input
              type="text"
              autocomplete="off"
              class="field-input"
              :placeholder="_t('Email')"
              v-model="email"
              required
            />
          </form>
        </div>
        <div class="errors" v-for="(error, index) in formErrors" :key="index">
          <span class="error">{{ error }}</span>
        </div>
        <div
          class="modal-footer"
          style="
            justify-content: flex-end;  
            padding-bottom: 0.5rem; 
            padding-right: 0.5rem;"
        >
          <button
            type="button"
            @click="changeNameAndEmail()"
            class="btn btn-success font-weight-bold"
          >
            {{ _t('Submit') }}
          </button>
          <button
            type="button"
            class="btn btn-danger font-weight-bold"
            @click="resetForm()"
          >
            {{ _t('Close') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
/* global $ */

export default {
  props: {
    user: {
      default: null,
      required: true,
    },
  },
  data() {
    return {
      changeInProgress: false,
      email: this.user.email,
      name: this.user.name,
      errors: [],
    }
  },
  computed: {
    ...mapGetters('location', ['_t']),
    formErrors() {
      return this.errors
    },
  },
  methods: {
    changeNameAndEmail() {
      if (this.validateForm()) {
        if (!this.changeInProgress) {
          this.changeInProgress = true
          this.$store
            .dispatch('auth/changeNameEmail', {
              name: this.name,
              email: this.email,
            })
            .then(() => {
              this.resetForm()
            })
            .catch(error => {
              this.changeInProgress = false
              this.errors = error
            })
        }
      }
    },
    validateForm() {
      this.errors = []
      if (!this.name || !this.email) {
        this.errors.push('All fields are required')
        this.changeInProgress = false
        return false
      }
      return true
    },
    resetForm() {
      this.errors = []
      this.email = this.user.email
      this.name = this.user.name
      this.changeInProgress = false
      $('#name-email-modal').modal('hide')
    },
  },
}
</script>
<style lang="scss" scoped>
form {
  display: flex;
}
.error {
  color: red;
  font-family: 'ProximaNova-Regular';
  font-size: 12px;
  margin-left: 4rem;
}
.modal-title {
  font-weight: 500;
}
input {
  width: 550px;
  margin-top: 2rem;
  margin-right: 2rem;
  color: rgba(63, 74, 74, 0.8);
}
input:focus {
  border-style: none;
  border-bottom: 1px solid red;
  box-shadow: none;
}
.modal-footer {
  margin-top: 2rem;
  border-top: 1px solid rgba(63, 74, 74, 0.1);
}
.btn-danger {
  margin-left: 21px;
  height: 3.1875rem;
  background: #cc3232;
  color: white;
  width: 10%;
  border-style: none;
  font-size: 12.75px;
}
.btn-success {
  height: 3.1875rem;
  margin-left: 21px;
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

.field-input {
  font-family: 'ProximaNova-Regular';
  font-size: 16px;
  height: 2.5em;
  border: none;
  border-bottom: 1px solid rgba(63, 74, 74, 0.1);
  margin-left: 0.5rem;
  padding: 1rem;
}
.btn {
  margin-top: 2rem;
}
</style>
