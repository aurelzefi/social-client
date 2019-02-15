<template>
  <div class="card">
    <div class="card-header">Password</div>

    <div class="card-body">
      <div class="alert alert-success" v-if="form.success">
        The password has been successfully changed.
      </div>

      <errors :errors="form.errors"/>

      <form @submit.prevent="update">
        <div class="form-group row">
          <label for="current-password" class="col-md-4 col-form-label text-md-right">
            Current Password
          </label>

          <div class="col-md-6">
            <input id="current-password" type="password" class="form-control"
                   v-model="form.password">
          </div>
        </div>

        <div class="form-group row">
          <label for="new-password" class="col-md-4 col-form-label text-md-right">
            New Password
          </label>

          <div class="col-md-6">
            <input id="new-password" type="password" class="form-control"
                   v-model="form.new_password">
          </div>
        </div>

        <div class="form-group row">
          <label for="new-password-confirm" class="col-md-4 col-form-label text-md-right">
            Confirm New Password
          </label>

          <div class="col-md-6">
            <input id="new-password-confirm" type="password" class="form-control"
                   v-model="form.new_password_confirmation">
          </div>
        </div>

        <div class="form-group row mb-0">
          <div class="col-md-6 offset-md-4">
            <button type="submit" class="btn btn-primary">
              Update
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import Errors from '../../components/Errors.vue';

export default {
  components: { Errors },

  /**
   * The component's data.
   */
  data() {
    return {
      form: {
        password: '',
        new_password: '',
        new_password_confirmation: '',
        errors: [],
        success: false,
      },
    };
  },

  /**
   * Mount the component.
   */
  mounted() {
    document.title = 'Password Settings - MySocial';
  },

  methods: {
    /**
     * Update the password for the user.
     */
    update() {
      this.form.errors = [];
      this.form.success = false;

      axios.put('/user/password', this.form)
        .then(() => {
          this.form.errors = [];
          this.form.success = true;

          this.form.password = '';
          this.form.new_password = '';
          this.form.new_password_confirmation = '';
        })
        .catch((error) => {
          this.form.success = false;
          this.form.errors = this.formatErrors(error.response.data.errors);
        });
    },
  },
};
</script>
