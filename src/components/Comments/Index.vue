<template>
  <div>
    <media id="comment-media-modal" :media="media"/>

    <loader :yes="loading"/>

    <div class="text-center" v-if="! comments.length && ! loading">
      This post does not have any comments.
    </div>

    <ul class="list-unstyled mt-2" v-if="comments.length">
      <li class="media" :class="{ 'mb-3': isNotLast(comments, comment) }"
          v-for="comment in comments" :key="comment.id">
        <router-link :to="`/users/${comment.user.id}/posts`">
          <img :src="avatar(comment.user)" class="rounded-circle mr-3" width="25" height="25"
               :alt="`${comment.user.name}'s Avatar`">
        </router-link>

        <div class="media-body">
          <h6 class="mt-0 mb-1">
            <router-link :to="`/users/${comment.user.id}/posts`">
              {{ comment.user.name }}
            </router-link>
          </h6>

          <small>{{ comment.created_at }}</small>

          <p class="mb-0" v-if="comment.content">{{ comment.content }}</p>

          <div class="row" v-if="comment.files">
            <div class="py-1" :class="{ 'col-lg-6': isEven(comment.files.length)
                || isOdd(comment.files.length) && isNotLast(comment.files, file),
                 'col-lg-12': isOdd(comment.files.length) && ! isNotLast(comment.files, file)}"
                 v-for="file in comment.files" :key="file.id">
              <a class="action-link" role="button" @click="showMedia(file, '#comment-media-modal')">
                <img class="mw-100" :src="path(file)" :alt="file.name" v-if="isImage(file)">
                <video class="mw-100" v-if="! isImage(file)">
                  <source :src="path(file)">
                </video>
              </a>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import Media from '../Media.vue';

export default {
  components: { Media },

  props: ['comments', 'loading'],

  /**
   * The component's data.
   */
  data() {
    return {
      media: null,
    };
  },
};
</script>
