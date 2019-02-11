<template>
  <div class="modal fade" id="comment-create-modal" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Add Comment</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <form @submit.prevent="store">
          <div class="modal-body">
            <errors :errors="form.errors"/>

            <textarea id="comment-create-content" class="form-control" rows="4"
                      v-model="form.content"></textarea>
          </div>
          <div class="modal-footer">
            <input type="file" class="d-none" ref="files" multiple @change="handleFiles">
            <button type="button" class="btn btn-outline-primary" @click="openFileBrowser">
              Add Files
            </button>

            <button type="submit" class="btn btn-primary">Add</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Errors from '../Errors.vue';

export default {
  components: { Errors },

  props: ['post'],

  data() {
    return {
      form: {
        content: '',
        files: [],
        errors: [],
      },
    };
  },

  mounted() {
    $('#comment-create-modal').on('shown.bs.modal', () => {
      $('#comment-create-content').focus();
    });

    $('#comment-create-modal').on('hidden.bs.modal', () => {
      this.form.errors = [];
      this.form.content = '';
    });
  },

  methods: {
    store() {
      this.form.errors = [];

      const formData = new FormData();

      formData.append('post_id', this.post.id);
      formData.append('content', this.form.content);

      this.form.files.forEach((file, key) => {
        formData.append(`files[${key}]`, file);
      });

      axios.post('/comments', formData)
        .then(() => {
          this.form.errors = [];
          this.form.content = '';
          this.form.files = [];
          this.post.comments_count += 1;

          $('#comment-create-modal').modal('hide');
        })
        .catch((error) => {
          this.form.errors = this.formatErrors(error.response.data.errors);
        });
    },
  },
};
</script>
