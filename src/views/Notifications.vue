<template>
  <layout>
    <h5>Notifications</h5>

    <ul class="list-unstyled mt-3" v-if="notifications.length">
      <li class="media" :class="{ 'mb-3': isNotLast(notifications, notification) }"
          v-for="notification in notifications" :key="notification.id">
        <router-link :to="`/users/${notification.data.id}/posts`"
                     v-if="notification.type === 'App\\Notifications\\PostLiked'">
          <img :src="avatar(notification.data)" class="rounded-circle mr-3" width="50"
               height="50" :alt="`${notification.data.name}'s Avatar`">
        </router-link>

        <router-link :to="`/users/${notification.data.user.id}/posts`"
                     v-if="notification.type === 'App\\Notifications\\PostCommented'">
          <img :src="avatar(notification.data.user)" class="rounded-circle mr-3" width="50"
               height="50" :alt="`${notification.data.user.name}'s Avatar`">
        </router-link>

        <router-link :to="`/users/${notification.data.id}/posts`"
                     v-if="notification.type === 'App\\Notifications\\UserFollowed'">
          <img :src="avatar(notification.data)" class="rounded-circle mr-3" width="50"
               height="50" :alt="`${notification.data.name}'s Avatar`">
        </router-link>

        <div class="media-body">
          <h6 class="mt-3">
            <router-link :to="`/users/${notification.data.id}/posts`"
                         v-if="notification.type === 'App\\Notifications\\PostLiked'">
              {{ notification.data.name }} liked your post.
            </router-link>

            <router-link :to="`/users/${notification.data.user.id}/posts`"
                         v-if="notification.type === 'App\\Notifications\\PostCommented'">
              {{ notification.data.user.name }} commented on your post.
            </router-link>

            <router-link :to="`/users/${notification.data.id}/posts`"
                         v-if="notification.type === 'App\\Notifications\\UserFollowed'">
              {{ notification.data.name }} followed you.
            </router-link>
          </h6>
        </div>
      </li>
    </ul>

    <div class="card-body text-center" v-if="! notifications.length && ! loading">
      You don't have any notifications.
    </div>

    <loader :yes="loading"/>
  </layout>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import Layout from '../layouts/Home.vue';

export default {
  components: { Layout },

  /**
   * The component's data.
   */
  data() {
    return {
      notifications: [],
      loading: false,
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
    document.title = 'Notifications - MySocial';

    echo.private(`user.${this.user.id}`)
      .notification((notification) => {
        this.getNotification(notification);
        this.decrementNotifications();
      });

    if (this.hasUnreadNotifications()) {
      this.readNotifications();
    } else {
      this.getNotifications();
    }
  },

  /**
   * Clean after the component is destroyed.
   */
  destroyed() {
    if (this.user) {
      echo.leave(`user.${this.user.id}`);

      this.listenForEvents();
    }
  },

  methods: {
    /**
     * Map the mutations from the store.
     */
    ...mapMutations([
      'decrementNotifications',
      'incrementNotifications',
      'listenForEvents',
    ]),

    /**
     * Get the notifications for the user.
     */
    getNotifications() {
      this.loading = true;

      axios.get('/notifications')
        .then((response) => {
          this.loading = false;
          this.notifications = response.data;
        });
    },

    /**
     * Read the notifications for the user.
     */
    readNotifications() {
      this.loading = true;

      axios.put('/notifications/read')
        .then((response) => {
          this.loading = false;
          this.notifications = response.data;
          this.user.unread_notifications_count = 0;
        });
    },

    /**
     * Get the given notification and add it to the list.
     */
    getNotification(notification) {
      axios.get(`/notifications/${notification.id}`)
        .then((response) => {
          this.notifications.unshift(response.data);
        });
    },

    /**
     * Determine if the user has unread notifications.
     */
    hasUnreadNotifications() {
      return this.user.unread_notifications_count > 0;
    },
  },
};
</script>
