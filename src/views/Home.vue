<template>
  <layout>
    <div class="card mb-4">
      <div class="card-header">Create Post</div>

      <div class="card-body">
        <form @submit.prevent="post">
          <errors :errors="form.errors"/>

          <div class="form-group">
            <textarea class="form-control" placeholder="Share something..."
                      rows="4" v-model="form.content"></textarea>
          </div>

          <div class="form-group mb-0">
            <input type="file" class="d-none" ref="files" multiple @change="handleFiles">

            <button type="button" class="btn btn-outline-primary" @click="openFileBrowser">
              Add Files
            </button>

            <button type="submit" class="btn btn-primary float-right">Post</button>
          </div>
        </form>
      </div>
    </div>

    <posts :posts="posts" :loading="loading" :more="more" :page="page" :last-page="lastPage"/>
  </layout>
</template>

<script>
import { mapState } from 'vuex';
import Layout from '../layouts/Home.vue';
import Posts from '../components/Posts.vue';
import Errors from '../components/Errors.vue';

export default {
  components: { Layout, Posts, Errors },

  /**
   * The component's data.
   */
  data() {
    return {
      form: {
        content: '',
        files: [],
        errors: [],
      },
      posts: [],
      loading: false,
      page: 1,
      lastPage: 1,
      perPage: 10,
      more: false,
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
    document.title = 'Home - MySocial';

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

      axios.get(`/feed?page=${this.page}&per_page=${this.perPage}`)
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

    /**
     * Store the post.
     */
    post() {
      this.form.errors = [];

      const formData = new FormData();

      formData.append('content', this.form.content);

      this.form.files.forEach((file, key) => {
        formData.append(`files[${key}]`, file);
      });

      axios.post('/posts', formData)
        .then((response) => {
          this.form.content = '';
          this.form.files = [];

          response.data.comments = [];
          response.data.loadingComments = false;
          response.data.showComments = false;

          this.posts.unshift(response.data);

          this.user.posts_count += 1;
        })
        .catch((error) => {
          this.form.errors = this.formatErrors(error.response.data.errors);
        });
    },
  },
};
</script>
