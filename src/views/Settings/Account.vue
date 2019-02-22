<template>
  <div>
    <div class="card mb-4">
      <div class="card-header">Avatar</div>

      <div class="card-body">
        <div class="alert alert-success" v-if="avatarForm.success">
          The avatar has been successfully changed.
        </div>

        <errors :errors="avatarForm.errors"/>

        <form @submit.prevent="updateAvatar">
          <div class="form-group text-center">
            <input type="file" class="d-none" ref="file" @change="handleFile">

            <a class="action-link" @click="openFileBrowser">
              <img class="rounded-circle" height="200" width="200"
                   :src="avatar(user)" alt="Your Avatar">
            </a>
          </div>

          <div class="form-group mb-0 text-center">
              <button type="submit" class="btn btn-primary">Update Avatar</button>
          </div>
        </form>
      </div>
    </div>

    <div class="card mb-4">
      <div class="card-header">Account</div>

      <div class="card-body">
        <div class="alert alert-success" v-if="accountForm.success">
          The account information has been successfully changed.
        </div>

        <errors :errors="accountForm.errors"/>

        <form @submit.prevent="updateAccount">
          <div class="form-group row">
            <label for="name" class="col-md-4 col-form-label text-md-right">
              Name
            </label>

            <div class="col-md-6">
              <input id="name" type="text" class="form-control" v-model="accountForm.name">
            </div>
          </div>

          <div class="form-group row">
            <label for="email" class="col-md-4 col-form-label text-md-right">
              E-Mail Address
            </label>

            <div class="col-md-6">
              <input id="email" type="email" class="form-control" v-model="accountForm.email">
            </div>
          </div>

          <div class="form-group row mb-0">
            <div class="col-md-6 offset-md-4">
              <button type="submit" class="btn btn-primary">Update Account</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import Errors from '../../components/Errors.vue';

export default {
  components: { Errors },

  /**
   * The component's data.
   */
  data() {
    return {
      avatarForm: {
        file: null,
        errors: [],
        success: false,
      },

      accountForm: {
        name: '',
        email: '',
        errors: [],
        success: false,
      },
    };
  },

  /**
   * The component's computed properties.
   */
  computed: mapState([
    'user',
  ]),

  /**
   * Mount the component.
   */
  mounted() {
    document.title = 'Account Settings - MySocial';

    this.accountForm.name = this.user.name;
    this.accountForm.email = this.user.email;
  },

  methods: {
    /**
     * Map the mutations from the store.
     */
    ...mapMutations([
      'setUser',
    ]),

    /**
     * Update the avatar for the user.
     */
    updateAvatar() {
      this.avatarForm.errors = [];
      this.avatarForm.success = false;

      const formData = new FormData();

      formData.append('avatar', this.avatarForm.file);

      axios.post('/user/avatar', formData)
        .then((response) => {
          this.setUser(response.data);
          this.avatarForm.success = true;
        })
        .catch((error) => {
          this.avatarForm.success = false;
          this.avatarForm.errors = this.formatErrors(error.response.data.errors);
        });
    },

    /**
     * Update the account data for the user.
     */
    updateAccount() {
      this.accountForm.errors = [];
      this.accountForm.success = false;

      axios.put('/user', this.accountForm)
        .then((response) => {
          this.setUser(response.data);
          this.accountForm.errors = [];
          this.accountForm.success = true;
        })
        .catch((error) => {
          this.accountForm.success = false;
          this.accountForm.errors = this.formatErrors(error.response.data.errors);
        });
    },

    /**
     * Open the file browser to choose the avatar.
     */
    openFileBrowser() {
      this.$refs.file.click();
    },

    /**
     * Add the chosen file to the form.
     */
    handleFile() {
      this.avatarForm.file = this.$refs.file.files[0];
    },
  },
};
</script>
