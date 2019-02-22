<template>
  <div>
    <h5>Who To Follow</h5>

    <loader :yes="loading"/>

    <ul class="list-unstyled mt-3" v-if="suggestions.length">
      <li class="media" :class="{ 'mb-3': isNotLast(suggestions, user) }"
          v-for="user in suggestions" :key="user.id">
        <router-link class="align-self-center" :to="`/users/${user.id}/posts`">
          <img :src="avatar(user)" class="rounded-circle mr-3"
               width="50" height="50" :alt="`${user.name}'s Avatar`">
        </router-link>

        <div class="media-body">
          <h6 class="mt-0 mb-1">
            <router-link :to="`/users/${user.id}/posts`">{{ user.name }}</router-link>
          </h6>

          <button type="button" class="btn btn-outline-primary btn-sm" @click="follow(user)">
            Follow
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  /**
   * The component's data.
   */
  data() {
    return {
      suggestions: [],
      loading: false,
    };
  },

  /**
   * The component's computed properties.
   */
  computed: {
    ...mapState([
      'user',
    ]),
  },

  /**
   * The properties to watch for changes.
   */
  watch: {
    'user.followees'() {
      this.getSuggestions();
    },
  },

  /**
   * Mount the component.
   */
  mounted() {
    this.getSuggestions();
  },

  methods: {
    /**
     * Get the suggestions.
     */
    getSuggestions() {
      this.loading = true;

      axios.get('/suggestions')
        .then((response) => {
          this.loading = false;
          this.suggestions = response.data;
        });
    },

    /**
     * Follow the given user.
     */
    follow(user) {
      axios.post(`/users/${user.id}/follow`)
        .then((response) => {
          this.user.followees.push(response.data);
        });
    },
  },
};
</script>
