<template>
  <layout>
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="card">
            <div class="card-header">Page Not Found</div>

            <div class="card-body">
              This page does not exist.
            </div>
          </div>
        </div>
      </div>
    </div>
  </layout>
</template>

<script>
import Layout from '../layouts/Main.vue';

export default {
  components: { Layout },

  mounted() {
    document.title = 'Page Not Found - MySocial';
  },
};
</script>
