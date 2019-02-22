<template>
  <router-view/>
</template>

<script>
export default {

};
</script>

<style lang="scss">
  // Fonts
  @import url('https://fonts.googleapis.com/css?family=Nunito');

  // Variables
  @import "./assets/sass/variables";

  // Bootstrap
  @import "~bootstrap/scss/bootstrap";

  body {
    padding-top: 80px;
  }

  textarea {
    resize: none;
  }

  .action-link {
    cursor: pointer;
  }

  .messages-search {
    bottom: 55px;
    z-index: 1080;
  }

  .top-50 {
    top: 50px;
  }

  .mh-70vh {
    max-height: 70vh;
  }

  .h-70vh {
    height: 70vh;
  }
</style>
