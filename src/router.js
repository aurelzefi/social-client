import Vue from 'vue';
import Router from 'vue-router';
import store from './store';
import Home from './views/Home.vue';
import Search from './views/Search.vue';
import Welcome from './views/Welcome.vue';
import Login from './views/Auth/Login.vue';
import Messages from './views/Messages.vue';
import NotFound from './views/NotFound.vue';
import Posts from './views/Profile/Posts.vue';
import Profile from './views/Profile/Index.vue';
import Register from './views/Auth/Register.vue';
import Settings from './views/Settings/Index.vue';
import Account from './views/Settings/Account.vue';
import Password from './views/Settings/Password.vue';
import Relations from './views/Profile/Relations.vue';
import Notifications from './views/Notifications.vue';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  linkActiveClass: 'active',
  routes: [
    {
      path: '/',
      component: Welcome,
      meta: { doesntRequireAuth: true },
    },
    {
      path: '/home',
      component: Home,
      meta: { requiresAuth: true },
    },
    {
      path: '/register',
      component: Register,
      meta: { doesntRequireAuth: true },
    },
    {
      path: '/login',
      component: Login,
      meta: { doesntRequireAuth: true },
    },
    {
      path: '/messages',
      component: Messages,
      meta: { requiresAuth: true },
    },
    {
      path: '/notifications',
      component: Notifications,
      meta: { requiresAuth: true },
    },
    {
      path: '/search',
      component: Search,
      meta: { requiresAuth: true },
    },
    {
      path: '/users/:id',
      component: Profile,
      props: true,
      meta: { requiresAuth: true },
      children: [
        {
          path: 'posts',
          component: Posts,
          props: true,
        },
        {
          path: 'followers',
          component: Relations,
          props: route => ({ id: route.params.id, type: 'followers' }),
        },
        {
          path: 'followees',
          component: Relations,
          props: route => ({ id: route.params.id, type: 'followees' }),
        },
      ],
    },
    {
      path: '/settings',
      component: Settings,
      meta: { requiresAuth: true },
      children: [
        {
          path: 'account',
          component: Account,
        },
        {
          path: 'password',
          component: Password,
        },
      ],
    },
    {
      path: '*',
      component: NotFound,
    },
  ],
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!localStorage.getItem('token')) {
      next({
        path: '/login',
        query: { redirect: to.fullPath },
      });
    } else {
      if (store.state.user) {
        next();
      } else {
        axios.get('/user')
          .then((response) => {
            store.commit('setUser', response.data);
            store.commit('listenForEvents');

            next();
          });
      }
    }
  } else if (to.matched.some(record => record.meta.doesntRequireAuth)) {
    if (localStorage.getItem('token')) {
      next({ path: '/home' });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
