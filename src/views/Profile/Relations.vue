<template>
  <div>
    <users :user="user" :users="relations" :loading="loading"
           :message="`This user does not have any ${type}.`"/>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Users from '../../components/Users.vue';

export default {
  components: { Users },

  props: ['user', 'type'],

  data() {
    return {
      relations: [],
      loading: false,
    };
  },

  computed: {
    ...mapState({
      auth: 'user',
    }),
  },

  watch: {
    type() {
      this.prepareComponent();
    },
  },

  mounted() {
    this.prepareComponent();
  },

  methods: {
    prepareComponent() {
      document.title = `${this.user.name} - ${this.ucfirst(this.type)} - MySocial`;

      this.getRelations();
    },

    getRelations() {
      this.loading = true;

      axios.get(`/users/${this.user.id}/${this.type}`)
        .then((response) => {
          this.loading = false;
          this.relations = response.data;
        });
    },
  },
};
</script>
