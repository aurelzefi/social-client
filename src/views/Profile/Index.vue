<template>
  <layout>
    <div class="container-fluid">
      <div class="row justify-content-center" v-if="user">
        <div class="col-md-3 col-lg-2 text-center">
          <img :src="avatar(user)" class="rounded-circle mb-2" height="150" width="150">

          <h4>{{ user.name }}</h4>

          <span>Joined {{ user.created_at }}</span>

          <button type="button" class="btn btn btn-outline-primary btn-block mt-2"
                  v-if="! isAuth(user) && ! isFollowing(user)" @click="follow(user)">
            Follow
          </button>

          <button type="button" class="btn btn-primary btn-block mt-2"
                  v-if="isFollowing(user)" @click="unfollow(user)">
            Following
          </button>
        </div>

        <div class="col-md-6 col-lg-4 mt-4">
          <ul class="nav nav-tabs mb-3">
            <li class="nav-item">
              <router-link class="nav-link" :to="`/users/${id}/posts`">
                Posts &middot; {{ user.posts_count }}
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" :to="`/users/${id}/followers`">
                Followers &middot; {{ user.followers_count }}
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" :to="`/users/${id}/followees`">
                Followees &middot; {{ isAuth(user) ? auth.followees.length : user.followees_count }}
              </router-link>
            </li>
          </ul>

          <router-view :user="user"/>
        </div>

        <div class="col-md-3 col-lg-2 mt-4">
          <suggestions/>
        </div>
      </div>
    </div>
  </layout>
</template>

<script>
import { mapState } from 'vuex';
import Layout from '../../layouts/Main.vue';
import Suggestions from '../../components/Suggestions.vue';

export default {
  components: { Layout, Suggestions },

  props: ['id'],

  data() {
    return {
      user: null,
    };
  },

  watch: {
    id() {
      this.getUser();
    },
  },

  computed: {
    ...mapState({
      auth: 'user',
    }),
  },

  mounted() {
    this.getUser();
  },

  methods: {
    getUser() {
      axios.get(`/users/${this.id}`)
        .then((response) => {
          this.user = response.data;
        });
    },


    follow(followee) {
      axios.post(`/users/${followee.id}/follow`)
        .then((response) => {
          this.auth.followees.push(response.data);
          this.user.followers_count += 1;
        });
    },

    unfollow(followee) {
      axios.delete(`/users/${followee.id}/unfollow`)
        .then(() => {
          this.removeFollowee(followee);
          this.user.followers_count -= 1;
        });
    },

    removeFollowee(followee) {
      this.auth.followees.splice(this.auth.followees.indexOf(
        this.auth.followees.find(user => user.id === followee.id),
      ), 1);
    },
  },
};
</script>
