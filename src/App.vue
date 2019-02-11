<template>
  <router-view/>
</template>

<script>
export default {

}
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

  #media-modal img, #media-modal video {
    max-height: 70vh;
    max-width: 100%;
  }

  .avatar {
    cursor: pointer;
  }

  .h-70vh {
    height: 70vh;
  }
</style>
