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

  /**
   * The component's data.
   */
  data() {
    return {
      relations: [],
      loading: false,
    };
  },

  /**
   * The component's computed properties.
   */
  computed: {
    ...mapState({
      auth: 'user',
    }),
  },

  /**
   * The properties to watch for changes.
   */
  watch: {
    type() {
      this.prepareComponent();
    },
  },

  /**
   * Mount the component.
   */
  mounted() {
    this.prepareComponent();
  },

  methods: {
    /**
     * Prepare the component.
     */
    prepareComponent() {
      document.title = `${this.user.name} - ${this.ucfirst(this.type)} - MySocial`;

      this.getRelations();
    },

    /**
     * Get the relations.
     */
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
