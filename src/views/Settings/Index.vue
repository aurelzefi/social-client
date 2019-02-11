<template>
  <layout>
    <div class="container-fluid">
      <div class="row justify-content-center">
        <div class="col-md-4 col-lg-2 mb-4">
          <div class="card">
            <div class="card-header">Settings</div>

            <div class="list-group list-group-flush">
              <router-link class="list-group-item list-group-item-action" to="/settings/account">
                Account
              </router-link>
              <router-link class="list-group-item list-group-item-action" to="/settings/password">
                Password
              </router-link>
            </div>
          </div>
        </div>

        <div class="col-md-8 col-lg-6">
          <router-view/>
        </div>
      </div>
    </div>
  </layout>
</template>

<script>
import Layout from '../../layouts/Main.vue';

export default {
  components: { Layout },
};
</script>
