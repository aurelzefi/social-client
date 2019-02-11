<template>
  <div>
    <h5>Who To Follow</h5>

    <ul class="list-unstyled mt-3" v-if="suggestions.length && ! loading">
      <li class="media" :class="{ 'mb-3': isNotLast(suggestions, suggestion) }"
          v-for="suggestion in suggestions" :key="suggestion.id">
        <router-link class="align-self-center" :to="`/users/${suggestion.id}/posts`">
          <img :src="avatar(suggestion)" class="rounded-circle mr-3"
               width="50" height="50" :alt="suggestion.name">
        </router-link>

        <div class="media-body">
          <h6 class="mt-0 mb-1">
            <router-link :to="`/users/${suggestion.id}/posts`">{{ suggestion.name }}</router-link>
          </h6>

          <button type="button" class="btn btn-outline-primary btn-sm" @click="follow(suggestion)">
            Follow
          </button>
        </div>
      </li>
    </ul>

    <loader :yes="loading"/>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  data() {
    return {
      suggestions: [],
      loading: false,
    };
  },

  computed: {
    ...mapState([
      'user',
    ]),
  },

  watch: {
    'user.followees'() {
      this.getSuggestions();
    },
  },

  mounted() {
    this.getSuggestions();
  },

  methods: {
    getSuggestions() {
      this.loading = true;

      axios.get('/suggestions')
        .then((response) => {
          this.loading = false;
          this.suggestions = response.data;
        });
    },

    follow(user) {
      axios.post(`/users/${user.id}/follow`)
        .then((response) => {
          this.user.followees.push(response.data);
        });
    },
  },
};
</script>
