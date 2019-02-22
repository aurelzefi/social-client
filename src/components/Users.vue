<template>
  <div>
    <loader :yes="loading"/>

    <div class="text-center" v-if="! users.length && ! loading">
      {{ message }}
    </div>

    <ul class="list-unstyled mb-0" v-if="users.length">
      <li class="media" :class="{ 'mb-3': isNotLast(users, user) }"
          v-for="user in users" :key="user.id">
        <router-link :to="`/users/${user.id}/posts`" data-dismiss="modal">
          <img :src="avatar(user)" class="rounded-circle mr-3" width="50" height="50"
               :alt="`${user.name}'s Avatar`">
        </router-link>

        <div class="media-body">
          <div class="d-flex align-items-center justify-content-between">
            <h6 class="mt-3">
              <router-link :to="`/users/${user.id}/posts`" data-dismiss="modal">
                {{ user.name }}
              </router-link>
            </h6>

            <button type="button" class="btn btn-outline-primary btn-sm"
                    @click="follow(user)" v-if="! isAuth(user) && ! isFollowing(user)">
              Follow
            </button>

            <button type="button" class="btn btn-primary btn-sm"
                    @click="unfollow(user)" v-if="isFollowing(user)">
              Following
            </button>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  props: ['user', 'users', 'loading', 'message'],

  /**
   * The component's computed properties.
   */
  computed: {
    isProfile() {
      return typeof this.user !== 'undefined';
    },

    ...mapState({
      auth: 'user',
    }),
  },

  methods: {
    /**
     * Follow the given user.
     */
    follow(user) {
      axios.post(`/users/${user.id}/follow`)
        .then((response) => {
          this.auth.followees.push(response.data);

          if (this.isProfile && this.isAuth(this.user)) {
            this.user.followees_count += 1;
          }
        });
    },

    /**
     * Unfollow the given user.
     */
    unfollow(user) {
      axios.delete(`/users/${user.id}/unfollow`)
        .then(() => {
          this.removeFollowee(user);

          if (this.isProfile && this.isAuth(this.user)) {
            this.user.followees_count -= 1;
          }
        });
    },

    /**
     * Remove the given followee from the user's followees.
     */
    removeFollowee(followee) {
      this.auth.followees.splice(this.auth.followees.indexOf(
        this.auth.followees.find(user => user.id === followee.id),
      ), 1);
    },
  },
};
</script>
