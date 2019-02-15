<template>
  <div class="modal fade" id="likes-modal" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" v-if="likes.length && ! loading">
            Likes &middot; {{ likes.length }}
          </h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <users :users="likes" :loading="loading" message="This post does not have any likes."/>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Users from './Users.vue';

export default {
  components: { Users },

  props: ['post'],

  /**
   * The component's data.
   */
  data() {
    return {
      likes: [],
      loading: false,
    };
  },

  /**
   * Mount the component.
   */
  mounted() {
    $('#likes-modal').on('shown.bs.modal', () => {
      this.getLikes();
    });

    $('#likes-modal').on('hidden.bs.modal', () => {
      this.likes = [];
    });
  },

  methods: {
    /**
     * Get the likes for the post.
     */
    getLikes() {
      this.loading = true;

      axios.get(`/posts/${this.post.id}/likes`)
        .then((response) => {
          this.loading = false;
          this.likes = response.data;
        });
    },
  },
};
</script>
