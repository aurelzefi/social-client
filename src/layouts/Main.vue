<template>
  <div>
    <nav class="navbar fixed-top navbar-expand-lg navbar-light bg-light">
      <div class="container">
        <router-link class="navbar-brand d-none d-sm-block" to="/">MySocial</router-link>

        <form class="form-inline mr-auto" v-if="user" @submit.prevent="search">
          <div class="input-group">
            <input id="search" type="text" class="form-control" placeholder="Search"
                   aria-label="Search" autocomplete="off" v-model="query"
                   @click="showSearch = true" @keyup="getResults">
            <div class="input-group-append">
              <button type="submit" class="btn btn-outline-primary">Search</button>
            </div>
          </div>

          <div class="position-absolute" style="top: 50px;">
            <div class="list-group" v-if="showSearch">
              <router-link class="list-group-item list-group-item-action"
                           :to="`/users/${user.id}/posts`" v-for="user in users" :key="user.id">
                <img :src="avatar(user)" class="rounded-circle mr-2" width="30" height="30"
                     :alt="user.name">
                {{ user.name }}
              </router-link>
            </div>
          </div>
        </form>

        <button class="navbar-toggler" type="button" data-toggle="collapse"
                data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav ml-auto" v-if="! user">
            <li class="nav-item">
              <router-link class="nav-link" to="/register">Register</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/login">Login</router-link>
            </li>
          </ul>

          <ul class="navbar-nav ml-auto" v-if="user">
            <li class="nav-item">
              <router-link class="nav-link" to="/home">Home</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/messages">
                Messages ({{ unreadConversationsCount }})
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/notifications">
                Notifications ({{ user.unread_notifications_count }})
              </router-link>
            </li>
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle action-link" id="navbarDropdown" role="button"
                 data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <img class="rounded-circle" :src="avatar(user)" width="20" heigth="20">
              </a>

              <div class="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdown">
                <router-link class="dropdown-item" to="/settings/account">Settings</router-link>
                <div class="dropdown-divider"></div>
                <a class="dropdown-item action-link" @click="logout">Logout</a>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <main>
      <slot/>
    </main>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex';

export default {
  /**
   * The component's data.
   */
  data() {
    return {
      query: '',
      users: [],
      limit: 10,
      showSearch: false,
    };
  },

  /**
   * The component's computed properties.
   */
  computed: {
    ...mapState([
      'user',
    ]),

    ...mapGetters([
      'unreadConversationsCount',
    ]),
  },

  /**
   * Mount the component.
   */
  mounted() {
    this.query = this.$route.query.query ? this.$route.query.query : '';

    $('body').click((e) => {
      if (e.target.id !== 'search') {
        this.showSearch = false;
      }
    });
  },

  methods: {
    /**
     * Map the mutations from the store.
     */
    ...mapMutations([
      'unsetUser',
    ]),

    /**
     * Log the user out of the application.
     */
    logout() {
      axios.post('/logout').then(() => {
        echo.leave(`user.${this.user.id}`);

        this.unsetUser();

        localStorage.removeItem('token');

        delete axios.defaults.headers.Authorization;

        this.$router.push('/');
      });
    },

    /**
     * Search results for the query string.
     */
    search() {
      if (this.query.length > 0) {
        this.$router.push(`/search?query=${this.query}`);
      }
    },

    /**
     * Get users that match the query string.
     */
    getResults(e) {
      if (this.query.length === 0 || e.key === 'Enter') {
        this.users = [];

        return;
      }

      axios.get(`/search/users?limit=${this.limit}&query=${this.query}`)
        .then((response) => {
          this.showSearch = true;
          this.users = response.data;
        });
    },
  },
};
</script>
