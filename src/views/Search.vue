<template>
  <layout>
    <div>
      <h5>Users for "{{ $route.query.query }}"</h5>
      <users class="mt-3" :users="results.users" :loading="loading"
             message="There are no results."/>
    </div>

    <div class="mt-4">
      <h5>Posts for "{{ $route.query.query }}"</h5>
      <posts class="mt-3" :posts="results.posts" :loading="loading"/>
    </div>
  </layout>
</template>

<script>
import Layout from '../layouts/Home.vue';
import Users from '../components/Users.vue';
import Posts from '../components/Posts.vue';

export default {
  components: { Layout, Users, Posts },

  /**
   * The component's data.
   */
  data() {
    return {
      results: {
        users: [],
        posts: [],
      },
      loading: false,
    };
  },

  /**
   * The properties to watch for changes.
   */
  watch: {
    '$route.query.query': function () {
      this.getResults();
    },
  },

  /**
   * Mount the component.
   */
  mounted() {
    document.title = `${this.$route.query.query} - MySocial`;

    this.getResults();
  },

  methods: {
    /**
     * Get the results for the query string.
     */
    getResults() {
      if (this.$route.query.query.length > 0) {
        this.loading = true;

        this.results.users = [];
        this.results.posts = [];

        axios.get(`/search?query=${this.$route.query.query}`)
          .then((response) => {
            this.loading = false;
            this.results = response.data;

            this.results.posts.forEach((post) => {
              post.comments = [];
              post.loadingComments = false;
              post.showComments = false;
            });
          });
      }
    },
  },
};
</script>
