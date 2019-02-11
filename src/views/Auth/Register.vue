<template>
  <layout>
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="card">
            <div class="card-header">Register</div>

            <div class="card-body">
              <errors :errors="form.errors"/>

              <form @submit.prevent="register">
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
                  <label for="password-confirm" class="col-md-4 col-form-label text-md-right">
                    Confirm Password
                  </label>

                  <div class="col-md-6">
                    <input id="password-confirm" type="password" class="form-control"
                           v-model="form.password_confirmation">
                  </div>
                </div>

                <div class="form-group row mb-0">
                  <div class="col-md-6 offset-md-4">
                    <button type="submit" class="btn btn-primary">Register</button>
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

  data() {
    return {
      form: {
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        errors: [],
      },
    };
  },

  mounted() {
    document.title = 'Register - MySocial';
  },

  methods: {
    ...mapMutations([
      'authenticate',
      'listenForEvents',
    ]),

    register() {
      this.form.errors = [];

      axios.post('/register', this.form)
        .then((response) => {
          this.authenticate(response.data);
          this.listenForEvents();
          this.$router.push('/home');
        })
        .catch((error) => {
          this.form.errors = this.formatErrors(error.response.data.errors);
        });
    },
  },
};
</script>
