<template>
  <div class="modal fade" id="edit-modal" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Edit</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <form @submit.prevent="update">
          <div class="modal-body">
            <errors :errors="form.errors"/>

            <div class="form-group">
              <textarea id="edit-content" class="form-control" rows="4"
                        v-model="form.content"></textarea>
            </div>

            <div class="row" v-if="form.current_files">
              <div class="col-3" v-for="file in form.current_files" :key="file.id">
                <img class="img-fluid" :src="path(file)" :alt="file.name" v-if="isImage(file)">
                <video class="img-fluid" v-if="! isImage(file)">
                  <source :src="path(file)">
                </video>

                <button type="button" class="position-absolute close"
                        aria-label="Close" @click="removeFile(file)">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <input type="file" class="d-none" ref="files" multiple @change="handleFiles">

            <button type="button" class="btn btn-outline-primary" @click="openFileBrowser">
              Add Files
            </button>

            <button type="submit" class="btn btn-primary">Update</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Errors from './Errors.vue';

export default {
  components: { Errors },

  props: ['name', 'resource', 'callback'],

  data() {
    return {
      form: {
        content: '',
        current_files: [],
        files: [],
        errors: [],
      },
    };
  },

  mounted() {
    $('#edit-modal').on('shown.bs.modal', () => {
      this.form.content = this.form.content.concat(this.resource.content);
      this.form.current_files = [].concat(this.resource.files);
    });

    $('#edit-modal').on('hidden.bs.modal', () => {
      this.form.content = '';
      this.form.errors = [];
    });
  },

  methods: {
    removeFile(file) {
      this.form.current_files.splice(this.form.current_files.indexOf(file), 1);
    },

    update() {
      this.form.errors = [];

      const formData = new FormData();

      formData.append('content', this.form.content);

      this.form.current_files.forEach((file, key) => {
        formData.append(`current_files[${key}]`, file.id);
      });

      this.form.files.forEach((file, key) => {
        formData.append(`files[${key}]`, file);
      });

      axios.post(`/${this.name}/${this.resource.id}/update`, formData)
        .then((response) => {
          this.form.errors = [];
          this.form.files = [];
          this.callback(response.data);

          $('#edit-modal').modal('hide');
        })
        .catch((error) => {
          this.form.errors = this.formatErrors(error.response.data.errors);
        });
    },
  },
};
</script>
