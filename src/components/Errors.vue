<template>
  <div class="alert alert-danger" v-if="errors.length">
    <p><strong>Whoops!</strong> Something went wrong!</p>
    <ul class="mb-0">
      <li v-for="error in errors" :key="error">
        {{ error }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: ['errors'],
};
</script>
