<template>
  <div>
    <div class="media mb-2">
      <router-link :to="`/users/${user.id}/posts`">
        <img class="rounded-circle mr-3" :src="avatar(user)" :alt="user.name"
             height="64" width="64">
      </router-link>

      <div class="media-body">
        <h4 class="mt-3">
          <router-link :to="`/users/${user.id}/posts`">{{ user.name }}</router-link>
        </h4>
      </div>
    </div>

    <div class="list-group list-group-flush">
      <router-link class="list-group-item list-group-item-action
                          d-flex justify-content-between align-items-center"
                   :to="`/users/${user.id}/posts`">
        Posts <span class="badge badge-primary badge-pill">{{ user.posts_count }}</span>
      </router-link>
      <router-link class="list-group-item list-group-item-action
                          d-flex justify-content-between align-items-center"
                   :to="`/users/${user.id}/followers`">
        Followers <span class="badge badge-primary badge-pill">{{ user.followers_count }}</span>
      </router-link>
      <router-link class="list-group-item list-group-item-action
                          d-flex justify-content-between align-items-center"
                   :to="`/users/${user.id}/followees`">
        Followees <span class="badge badge-primary badge-pill">{{ user.followees.length }}</span>
      </router-link>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: mapState([
    'user',
  ]),
};
</script>
