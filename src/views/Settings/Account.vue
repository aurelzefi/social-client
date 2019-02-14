<template>
  <div>
    <avatar class="mb-4"/>
    <account class="mb-4"/>
  </div>
</template>

<script>
import Avatar from '../../components/Settings/Avatar.vue';
import Account from '../../components/Settings/Account.vue';

export default {
  components: { Avatar, Account },

  /**
   * Mount the component.
   */
  mounted() {
    document.title = 'Account Settings - MySocial';
  },
};
</script>
