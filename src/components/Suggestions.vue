<template>
  <div class="card">
    <div class="card-header">Who To Follow</div>

    <div class="card-body">

    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {

    };
  },

  mounted() {

  },

  methods: {
    getWhoToFollow() {
      axios.get('/who-to-follow')
        .then((response) => {
          this.
        });
    },
  },
};
</script>

<style scoped>

</style>
