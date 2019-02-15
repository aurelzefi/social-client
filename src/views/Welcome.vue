<template>
  <layout>
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="card">
            <div class="card-header">Welcome</div>

            <div class="card-body">
              This is the welcome page.
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

  /**
   * Mount the component.
   */
  mounted() {
    document.title = 'Welcome - MySocial';
  },
};
</script>
