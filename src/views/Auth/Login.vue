<template>
  <layout>
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="card">
            <div class="card-header">Login</div>

            <div class="card-body">
              <errors :errors="form.errors"/>

              <form @submit.prevent="login">
                <div class="form-group row">
                  <label for="email" class="col-md-4 col-form-label text-md-right">
                    E-Mail Address
                  </label>

                  <div class="col-md-6">
                    <input id="email" type="email" class="form-control" v-model="form.email">
                  </div>
                </div>

                <div class="form-group row">
                  <label for="password" class="col-md-4 col-form-label text-md-right">
                    Password
                  </label>

                  <div class="col-md-6">
                    <input id="password" type="password" class="form-control"
                           v-model="form.password">
                  </div>
                </div>

                <div class="form-group row">
                  <div class="col-md-6 offset-md-4">
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" name="remember" id="remember">
                      <label class="form-check-label" for="remember">Remember Me</label>
                    </div>
                  </div>
                </div>

                <div class="form-group row mb-0">
                  <div class="col-md-8 offset-md-4">
                    <button type="submit" class="btn btn-primary">Login</button>
                    <a class="btn btn-link" href="/">Forgot Your Password?</a>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </layout>
</template>

<script>
import { mapMutations } from 'vuex';
import Layout from '../../layouts/Main.vue';
import Errors from '../../components/Errors.vue';

export default {
  components: { Layout, Errors },

  /**
   * The component's data.
   */
  data() {
    return {
      form: {
        email: '',
        password: '',
        errors: [],
      },
    };
  },

  /**
   * Mount the component.
   */
  mounted() {
    document.title = 'Login - MySocial';
  },

  methods: {
    /**
     * Map the mutations from the store.
     */
    ...mapMutations([
      'authenticate',
      'listenForEvents',
    ]),

    /**
     * Log the user into the application.
     */
    login() {
      this.form.errors = [];

      axios.post('/login', this.form)
        .then((response) => {
          this.authenticate(response.data);
          this.listenForEvents();
          this.$router.push(this.redirectPath());
        })
        .catch((error) => {
          this.form.errors = this.formatErrors(error.response.data.errors);
        });
    },

    /**
     * Get the after login redirect path.
     */
    redirectPath() {
      return this.$route.query.redirect ? this.$route.query.redirect : '/home';
    },
  },
};
</script>
