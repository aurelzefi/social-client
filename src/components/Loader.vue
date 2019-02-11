<template>
  <div class="d-flex justify-content-center p-4" v-if="yes">
    <div class="spinner-border text-secondary" role="status">
      <span class="sr-only">Loading...</span>
    </div>
  </div>
</template>

<script>
export default {
  props: ['yes'],
};
</script>
