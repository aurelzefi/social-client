<template>
  <div>
    <edit name="posts" :resource="post" :callback="updateCallback"/>
    <likes :post="post"/>
    <comment-create :post="post"/>
    <media :media="media"/>
    <confirm id="post-confirm-modal" :action="deleteAction"/>

    <loader :yes="loading"/>

    <div class="text-center" v-if="! posts.length && ! loading">
      There are no posts.
    </div>

    <ul class="list-unstyled mb-0" v-if="posts.length">
      <li class="media" :class="{ 'mb-3': isNotLast(posts, post) }"
          v-for="post in posts" :key="post.id">
        <router-link :to="`/users/${post.user.id}/posts`">
          <img :src="avatar(post.user)" class="rounded-circle mr-3" width="50" height="50"
               :alt="post.user.name">
        </router-link>

        <div class="media-body">
          <div class="dropdown float-right" v-if="post.user_id === user.id">
            <button type="button" class="btn btn-sm btn-link dropdown-toggle"
                    id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true"
                    aria-expanded="false">
            </button>
            <div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
              <a class="dropdown-item action-link" @click="showEditModal(post)">Update</a>
              <a class="dropdown-item action-link" @click="showConfirmModal(post)">Delete</a>
            </div>
          </div>

          <h5 class="mt-0 mb-1">
            <router-link :to="`/users/${post.user.id}/posts`">{{ post.user.name }}</router-link>
          </h5>

          <small>{{ post.created_at }}</small>

          <p class="mb-0" v-if="post.content">{{ post.content }}</p>

          <div class="row" v-if="post.files">
            <div class="py-1" :class="{ 'col-lg-6': isEven(post.files.length)
                || isOdd(post.files.length) && isNotLast(post.files, file),
                 'col-lg-12': isOdd(post.files.length) && ! isNotLast(post.files, file)}"
                 v-for="file in post.files" :key="file.id">
              <a class="action-link" role="button" @click.prevent="showMedia(file)">
                <img style="width: 100%;" :src="path(file)" :alt="file.name" v-if="isImage(file)">
                <video style="width: 100%;" v-if="! isImage(file)">
                  <source :src="path(file)">
                </video>
              </a>
            </div>
          </div>

          <div>
            <button type="button" class="btn btn-link" v-if="! liked(post)" @click="like(post)">
              Like
            </button>

            <button type="button" class="btn btn-link" v-if="liked(post)" @click="unlike(post)">
              Unlike
            </button>

            <button type="button" class="btn btn-link" @click="createComment(post)">
              Comment
            </button>

            <button type="button" class="btn btn-link" @click="showLikes(post)">
              Likes &middot; {{ post.likes_count }}
            </button>

            <button type="button" class="btn btn-link" @click="showComments(post)">
              Comments &middot; {{ post.comments_count }}
            </button>
          </div>

          <comments :comments="post.comments"
                    :loading="post.loadingComments" v-if="post.showComments"/>
        </div>
      </li>
    </ul>

    <loader :yes="more"/>

    <div class="text-center m-3"
         v-if="posts.length && page - 1 === lastPage && ! loading && ! more">
      There are no more posts to show.
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Edit from './Edit.vue';
import Likes from './Likes.vue';
import Media from './Media.vue';
import Confirm from './Confirm.vue';
import Comments from './Comments/Index.vue';
import CommentCreate from './Comments/Create.vue';

export default {
  components: {
    Edit, Likes, Media, Confirm, Comments, CommentCreate,
  },

  props: ['posts', 'loading', 'more', 'page', 'lastPage'],

  /**
   * The component's data.
   */
  data() {
    return {
      post: null,
      media: null,
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
     * Like the given post.
     */
    like(post) {
      axios.post(`/posts/${post.id}/like`)
        .then((response) => {
          this.user.likes.push(response.data);
          post.likes_count += 1;
        });
    },

    /**
     * Unlike the given post.
     */
    unlike(post) {
      axios.delete(`/posts/${post.id}/unlike`)
        .then(() => {
          this.removeLike(post);
          post.likes_count -= 1;
        });
    },

    /**
     * Remove the given post from the user's liked posts.
     */
    removeLike(post) {
      this.user.likes.splice(this.user.likes.indexOf(
        this.user.likes.find(likedPost => likedPost.id === post.id),
      ), 1);
    },

    /**
     * Determine if the given post has been liked by the user.
     */
    liked(post) {
      return this.user.likes.map(likedPost => likedPost.id).includes(post.id);
    },

    /**
     * Show the modal to create a new comment.
     */
    createComment(post) {
      this.post = post;

      $('#comment-create-modal').modal('show');
    },

    /**
     * Show the likes for the given post.
     */
    showLikes(post) {
      this.post = post;

      $('#likes-modal').modal('show');
    },

    /**
     * Show the comments for the given post.
     */
    showComments(post) {
      this.$set(this.posts, this.posts.indexOf(post), post);

      post.showComments = ! post.showComments;

      if (post.showComments) {
        post.loadingComments = true;

        axios.get(`/posts/${post.id}/comments`)
          .then((response) => {
            post.loadingComments = false;
            post.comments = response.data;

            this.$set(this.posts, this.posts.indexOf(post), post);
          });
      }
    },

    /**
     * Show the edit modal.
     */
    showEditModal(post) {
      this.post = post;

      $('#edit-modal').modal('show');
    },

    /**
     * Show the confirm modal.
     */
    showConfirmModal(post) {
      this.post = post;

      $('#confirm-modal').modal('show');
    },

    /**
     * The callback to be executed after the update.
     */
    updateCallback(post) {
      this.$set(this.posts, this.posts.indexOf(this.post), post);
    },

    /**
     * The delete action to be completed on confirm.
     */
    deleteAction() {
      axios.delete(`/posts/${this.post.id}`)
        .then(() => {
          this.posts.splice(this.posts.indexOf(this.post), 1);
        });
    },
  },
};
</script>
