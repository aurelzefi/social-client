import 'bootstrap';
import Vue from 'vue';
import _ from 'lodash';
import axios from 'axios';
import Echo from 'laravel-echo';
import App from './App.vue';
import store from './store';
import router from './router';
import Loader from './components/Loader.vue';

Vue.config.productionTip = false;

window.$ = require('jquery');
window.Pusher = require('pusher-js');

const API_URL = '//social-api.test';

const headers = {};

if (localStorage.getItem('token')) {
  headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
}

window.axios = axios.create({ baseURL: API_URL, headers });

window.echo = new Echo({
  broadcaster: 'pusher',
  key: '2bb737faaaf999c4f42f',
  cluster: 'eu',
  encrypted: true,
  authEndpoint: `${API_URL}/broadcasting/auth`,
  auth: { headers },
});

Vue.component('loader', Loader);

Vue.mixin({
  methods: {
    /**
     * Get the avatar for the given user.
     */
    avatar(user) {
      if (user.avatar) {
        return `${API_URL}/storage/${user.avatar}`;
      }

      return '/default.jpg';
    },

    /**
     * Determine if the file is an image.
     */
    isImage(file) {
      return ['jpeg', 'png', 'bmp', 'gif'].includes(file.name.split('.')[1]);
    },

    /**
     * Get the full path for the file.
     */
    path(file) {
      return `${API_URL}/files/${file.name}?api_token=${localStorage.getItem('token')}`;
    },

    /**
     * Format the validation errors.
     */
    formatErrors(errors) {
      return _.flatten(_.toArray(errors));
    },

    /**
     * Truncate the given string.
     */
    truncate(string, size = 100) {
      return string.length > size ? `${string.substr(0, size)}...` : string;
    },

    /**
     * Determine if the given item is not the last one in the given array.
     */
    isNotLast(items, item) {
      return items.indexOf(item) !== items.length - 1;
    },

    /**
     * Open the file browser to choose files.
     */
    openFileBrowser() {
      this.$refs.files.click();
    },

    /**
     * Add the chosen files to the form.
     */
    handleFiles() {
      this.form.files = _.toArray(this.$refs.files.files);
    },

    /**
     * Determine if the given number is even.
     */
    isEven(number) {
      return number % 2 === 0;
    },

    /**
     * Determine if the given number is odd.
     */
    isOdd(number) {
      return number % 2 === 1;
    },

    /**
     * Show the given media.
     */
    showMedia(media) {
      this.media = media;

      $('#media-modal').modal('show');
    },

    /**
     * Capitalize the first letter of a string.
     */
    ucfirst(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },

    /**
     * Determine if the authenticated user is following the given user.
     */
    isFollowing(user) {
      return this.auth.followees.map(followee => followee.id).includes(user.id);
    },

    /**
     * Determine if the given user is the authenticated user.
     */
    isAuth(user) {
      return this.auth.id === user.id;
    },

    /**
     * Determine if the page is near the bottom.
     */
    isNearBottom() {
      return window.innerHeight + window.scrollY >= document.body.offsetHeight - 300;
    },
  },
});

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
