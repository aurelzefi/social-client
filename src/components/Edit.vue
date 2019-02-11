<template>
  <div class="modal fade" id="edit-modal" tabindex="-1" role="dialog" v-if="resource">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Edit Post</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <form @submit.prevent="update">
          <div class="modal-body">
            <errors :errors="form.errors"/>

            <div class="form-group">
              <textarea id="edit-content" class="form-control" rows="4"
                        v-model="resource.content"></textarea>
            </div>

            <div class="row" v-if="resource.files">
              <div class="col-3" v-for="file in resource.files" :key="file.id">
                <img class="img-fluid" :src="path(file)" :alt="file.name" v-if="isImage(file)">
                <video class="img-fluid" v-if="! isImage(file)">
                  <source :src="path(file)">
                </video>
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
import Errors from '../Errors.vue';

export default {
  components: { Errors },

  props: ['resource'],

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
    $('#edit-modal').on('shown.bs.modal', () => {
      this.form.content = this.resource.content;

      $('#edit-content').focus();
    });

    $('#edit-modal').on('hidden.bs.modal', () => {
      this.form.errors = [];
      this.form.content = '';
    });
  },

  methods: {
    update() {

    },
  },
};
</script>
