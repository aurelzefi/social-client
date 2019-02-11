import Vue from 'vue';
import _ from 'lodash';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: null,
  },
  getters: {
    unreadConversationsCount: (state) => {
      return _.toArray(_.groupBy(state.user.unread_messages, 'sender_id')).length;
    },
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },

    unsetUser(state) {
      state.user = null;
    },

    authenticate(state, user) {
      state.user = user;

      localStorage.setItem('token', user.api_token);

      axios.defaults.headers.common.Authorization = `Bearer ${user.api_token}`;
      echo.connector.pusher.config.auth.headers.Authorization = `Bearer ${user.api_token}`;
    },

    listenForEvents(state) {
      echo.private(`user.${state.user.id}`)
        .listen('MessageSent', (e) => {
          state.user.unread_messages.push(e.message);
        })
        .notification(() => {
          state.user.unread_notifications_count += 1;
        });
    },

    addNotification(state) {
      state.user.unread_notifications_count += 1;
    },

    removeNotification(state) {
      state.user.unread_notifications_count -= 1;
    },
  },
  actions: {

  },
});
