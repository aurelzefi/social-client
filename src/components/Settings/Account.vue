<template>
  <div class="card">
    <div class="card-header">Account</div>

    <div class="card-body">
      <div class="alert alert-success" v-if="form.success">
        The account information has been successfully changed.
      </div>

      <errors :errors="form.errors"/>

      <form @submit.prevent="update">
        <div class="form-group row">
          <label for="name" class="col-md-4 col-form-label text-md-right">
            Name
          </label>

          <div class="col-md-6">
            <input id="name" type="text" class="form-control" v-model="form.name">
          </div>
        </div>

        <div class="form-group row">
          <label for="email" class="col-md-4 col-form-label text-md-right">
            E-Mail Address
          </label>

          <div class="col-md-6">
            <input id="email" type="email" class="form-control" v-model="form.email">
          </div>
        </div>

        <div class="form-group row mb-0">
          <div class="col-md-6 offset-md-4">
            <button type="submit" class="btn btn-primary">
              Update Account
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import Errors from '../Errors.vue';

export default {
  components: { Errors },

  /**
   * The component's data.
   */
  data() {
    return {
      form: {
        name: '',
        email: '',
        errors: [],
        success: false,
      },
    };
  },

  /**
   * Mount the component.
   */
  mounted() {
    this.form.name = this.user.name;
    this.form.email = this.user.email;
  },

  /**
   * The component's computed properties.
   */
  computed: mapState([
    'user',
  ]),

  methods: {
    /**
     * The mutations from the store.
     */
    ...mapMutations([
      'setUser',
    ]),

    /**
     * Update the account information for the user.
     */
    update() {
      this.form.errors = [];
      this.form.success = false;

      axios.put('/user', this.form)
        .then((response) => {
          this.setUser(response.data);
          this.form.errors = [];
          this.form.success = true;
        })
        .catch((error) => {
          this.form.success = false;
          this.form.errors = this.formatErrors(error.response.data.errors);
        });
    },
  },
};
</script>
