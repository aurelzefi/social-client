<template>
  <div class="modal" id="media-modal" tabindex="-1" role="dialog" v-if="media">
    <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <img class="mx-auto media" :src="path(media)" :alt="media.name" v-if="isImage(media)">
          <video class="media" v-if="! isImage(media)" ref="video" controls autoplay>
            <source :src="path(media)">
          </video>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['media'],

  /**
   * Mount the component.
   */
  mounted() {
    $('body').on('hidden.bs.modal', '#media-modal', () => {
      if (this.$refs.video) {
        this.$refs.video.pause();
      }
    });
  },
};
</script>
