<template>
  <div>
    <posts :posts="posts" :loading="loading" :more="more" :page="page" :last-page="lastPage"/>
  </div>
</template>

<script>
import Posts from '../../components/Posts.vue';

export default {
  components: { Posts },

  props: ['id', 'user'],

  /**
   * The component's data.
   */
  data() {
    return {
      posts: [],
      loading: false,
      page: 1,
      lastPage: 1,
      perPage: 10,
      more: false,
    };
  },

  /**
   * The properties to watch for changes.
   */
  watch: {
    id() {
      this.getPosts();
    },
  },

  /**
   * Mount the component.
   */
  mounted() {
    document.title = `${this.user.name} - Posts - MySocial`;

    this.getPosts();

    window.onscroll = () => {
      if (!this.more && this.isNearBottom() && this.page <= this.lastPage) {
        this.getPosts();
      }
    };
  },

  methods: {
    /**
     * Get the posts.
     */
    getPosts() {
      if (this.page === 1) {
        this.loading = true;
      } else {
        this.more = true;
      }

      axios.get(`/users/${this.id}/posts?page=${this.page}&per_page=${this.perPage}`)
        .then((response) => {
          this.posts = this.posts.concat(response.data.data);

          this.posts.forEach((post) => {
            post.comments = [];
            post.loadingComments = false;
            post.showComments = false;
          });

          if (this.page === 1) {
            this.loading = false;
          } else {
            this.more = false;
          }

          this.page += 1;
          this.lastPage = response.data.last_page;
        });
    },
  },
};
</script>
