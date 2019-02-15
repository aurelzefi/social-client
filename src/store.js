import Vue from 'vue';
import _ from 'lodash';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: null,
  },
  getters: {
    /**
     * The unread messages count grouped by sender.
     */
    unreadConversationsCount: (state) => {
      return _.toArray(_.groupBy(state.user.unread_messages, 'sender_id')).length;
    },
  },
  mutations: {
    /**
     * Set the user into the state.
     */
    setUser(state, user) {
      state.user = user;
    },

    /**
     * Remove the user from the state.
     */
    unsetUser(state) {
      state.user = null;
    },

    /**
     * Set the user into the state and store the token.
     */
    authenticate(state, user) {
      state.user = user;

      localStorage.setItem('token', user.api_token);

      axios.defaults.headers.common.Authorization = `Bearer ${user.api_token}`;
      echo.connector.pusher.config.auth.headers.Authorization = `Bearer ${user.api_token}`;
    },

    /**
     * Listen for message and notification events.
     */
    listenForEvents(state) {
      echo.private(`user.${state.user.id}`)
        .listen('MessageSent', (e) => {
          state.user.unread_messages.push(e.message);
        })
        .notification(() => {
          state.user.unread_notifications_count += 1;
        });
    },

    /**
     * Increment the notifications count.
     */
    addNotification(state) {
      state.user.unread_notifications_count += 1;
    },

    /**
     * Decrement the notifications count.
     */
    removeNotification(state) {
      state.user.unread_notifications_count -= 1;
    },
  },
  actions: {

  },
});
