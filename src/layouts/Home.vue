<template>
  <layout>
    <div class="container-fluid">
      <div class="row justify-content-center">
        <div class="col-md-3 col-lg-2 mb-4">
          <profile-card/>
        </div>

        <div class="col-md-6 col-lg-4 mb-4">
          <slot/>
        </div>

        <div class="col-md-3 col-lg-2">
          <suggestions/>
        </div>
      </div>
    </div>
  </layout>
</template>

<script>
import Layout from './Main.vue';
import ProfileCard from '../components/ProfileCard.vue';
import Suggestions from '../components/Suggestions.vue';

export default {
  components: { Layout, ProfileCard, Suggestions },
};
</script>
