<template>
  <div class="card">
    <div class="card-header">Avatar</div>

    <div class="card-body">
      <div class="alert alert-success" v-if="form.success">
        The avatar has been successfully changed.
      </div>

      <errors :errors="form.errors"/>

      <form @submit.prevent="update">
        <div class="form-group text-center">
          <input type="file" class="d-none" ref="file" @change="handleFile">
          <img class="rounded-circle avatar" height="200" width="200" :src="avatar(user)"
               @click="openFileBrowser">
        </div>

        <div class="form-group mb-0 text-center">
          <button type="submit" class="btn btn-primary">
            Update Avatar
          </button>
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
        file: null,
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

  methods: {
    /**
     * The mutations from the store.
     */
    ...mapMutations([
      'setUser',
    ]),

    /**
     * Update the avatar for the user.
     */
    update() {
      this.form.errors = [];
      this.form.success = false;

      const formData = new FormData();

      formData.append('avatar', this.form.file);

      axios.post('/user/avatar', formData)
        .then((response) => {
          this.setUser(response.data);
          this.form.success = true;
        })
        .catch((error) => {
          this.form.success = false;
          this.form.errors = this.formatErrors(error.response.data.errors);
        });
    },

    /**
     * Open the file browser for the user to select a file.
     */
    openFileBrowser() {
      this.$refs.file.click();
    },

    /**
     * Add the selected file to the form.
     */
    handleFile() {
      this.form.file = this.$refs.file.files[0];
    },
  },
};
</script>
