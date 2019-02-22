<template>
  <layout>
    <media id="message-media-modal" :media="media"/>

    <div class="container-fluid">
      <div class="row justify-content-center mb-4">
        <div class="col-md-4 col-lg-3 mb-4">
          <div class="card">
            <div class="card-header">Conversations</div>

            <loader :yes="loadingConversations"/>

            <div class="card-body text-center"
                 v-if="! conversations.length && ! loadingConversations">
              You don't have any conversations.
            </div>

            <ul class="list-group list-group-flush overflow-auto h-70vh"
                v-if="conversations.length">
              <li class="list-group-item list-group-item-action
                          flex-column align-items-start action-link"
                  :class="{ 'active': isActive(conversation) }"
                  v-for="conversation in conversations" :key="conversation.id"
                 @click="getMessagesForConversation(conversation)">

                <div class="d-flex w-100 justify-content-between">
                  <h5 class="mb-1">
                    {{ truncate(conversationalist(conversation).name, 20) }}
                  </h5>
                  <span class="text-right">
                    <small>
                      {{ conversation.created_at }}
                    </small>
                    <small class="text-danger" v-if="isUnread(conversation)">
                      (New)
                    </small>
                  </span>
                </div>

                <p class="mb-1">
                  {{ user.id === conversation.sender.id ? 'Sent:' : 'Received:' }}
                  {{ truncate(conversation.content ? conversation.content : '', 80) }}
                </p>
              </li>
            </ul>

            <div class="card-footer">
              <div class="position-absolute messages-search">
                <div class="list-group" v-if="showSearch">
                  <a class="list-group-item list-group-item-action action-link user-action-link"
                               :to="`/users/${user.id}/posts`" v-for="user in users"
                     :key="user.id" @click="startConversation(user)">
                    <img :src="avatar(user)" class="rounded-circle mr-2" width="30" height="30"
                         :alt="`${user.name}'s Avatar`">
                    {{ user.name }}
                  </a>
                </div>
              </div>

              <input id="user-conversation-search" type="text" class="form-control"
                     placeholder="Search..." autocomplete="off" v-model="query"
                     @click="showSearch = true" @keyup="getResults">
            </div>
          </div>
        </div>

        <div class="col-md-8 col-lg-5">
          <div class="card">
            <div class="card-header">Messages</div>

            <loader :yes="loadingMessages"/>

            <div class="card-body h-70vh text-center" v-if="! messages.length && ! loadingMessages">
              Choose someone and start/continue a conversation.
            </div>

            <div class="card-body overflow-auto h-70vh" ref="messages" v-if="messages.length">
              <div class="row" v-for="message in messages" :key="message.id">
                <div class="col">
                  <div class="col-6" :class="{ 'float-right': user.id === message.sender_id }">
                    <p :class="{ 'mb-0': message.files.length }" v-if="message.content">
                      {{ message.content }}
                    </p>

                    <div class="row" v-if="message.files.length">
                      <div class="col py-1" v-for="file in message.files" :key="file.id">
                        <a class="action-link" @click="showMedia(file, '#message-media-modal')">
                          <img class="mw-100" :src="path(file)"
                               :alt="file.name" v-if="isImage(file)">
                          <video class="mw-100" v-if="! isImage(file)">
                            <source :src="path(file)">
                          </video>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="card-footer" v-if="form.receiver_id">
              <form @submit.prevent="send">
                <div class="input-group">
                  <input type="text" class="form-control"
                         placeholder="Compose a message..." v-model="form.content">

                  <div class="input-group-append">
                    <input type="file" class="d-none" ref="files" multiple @change="handleFiles">

                    <button type="button" class="btn btn-outline-primary" @click="openFileBrowser">
                      Add Files
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </layout>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import Layout from '../layouts/Main.vue';
import Media from '../components/Media.vue';

export default {
  components: { Layout, Media },

  /**
   * The component's data.
   */
  data() {
    return {
      form: {
        receiver_id: null,
        content: '',
        files: [],
      },
      conversations: [],
      loadingConversations: false,
      messages: [],
      loadingMessages: false,
      active: null,
      media: null,
      query: '',
      users: [],
      limit: 5,
      showSearch: false,
    };
  },

  /**
   * The component's computed properties.
   */
  computed: mapState([
    'user',
  ]),

  /**
   * Mount the component.
   */
  mounted() {
    document.title = 'Messages - MySocial';

    $('body').click((e) => {
      if (e.target.id !== 'user-conversation-search') {
        this.showSearch = false;
      }
    });

    this.getConversations();

    echo.private(`user.${this.user.id}`)
      .listen('MessageSent', (e) => {
        this.updateConversations(e.message.sender_id, 'received');

        if (this.form.receiver_id === e.message.sender_id) {
          this.messages.push(e.message);
          this.updateUnreadMessages();
        }
      });
  },

  /**
   * Clean after the component is destroyed.
   */
  destroyed() {
    if (this.user) {
      echo.leave(`user.${this.user.id}`);

      this.listenForEvents();
    }
  },

  /**
   * Update the component.
   */
  updated() {
    if (this.$refs.messages) {
      this.$refs.messages.scrollTop = this.$refs.messages.scrollHeight;
    }
  },

  methods: {
    /**
     * Map the mutations from the store.
     */
    ...mapMutations([
      'listenForEvents',
    ]),

    /**
     * Get the conversations.
     */
    getConversations() {
      this.loadingConversations = true;

      axios.get('/conversations')
        .then((response) => {
          this.loadingConversations = false;
          this.conversations = response.data;
        });
    },

    /**
     * Update the conversations.
     */
    updateConversations(id, type) {
      axios.get(`/conversations/${id}`)
        .then((response) => {
          const index = this.conversations.indexOf(
            this.conversations.find(
              c => [c.sender_id, c.receiver_id].includes(
                type === 'received' ? response.data.sender_id : response.data.receiver_id
              )
            )
          );

          if (index === -1) {
            this.conversations.unshift(response.data);
          } else {
            if (this.isActive(this.conversations[index])) {
              this.active = response.data;

              if (response.data.receiver_id === this.user.id) {
                response.data.read_at = true;
                this.readConversation(response.data);
              }
            }

            this.$set(this.conversations, index, response.data);

            this.conversations.sort((x, y) => {
              return x.id === response.data.id ? -1 : y === response.data.id ? 1 : 0;
            });
          }

          if (type === 'sent') {
            this.active = this.conversations[0];
          }
        });
    },

    /**
     * Get the messages for the given conversation.
     */
    getMessagesForConversation(conversation) {
      if (this.active !== conversation.id) {
        this.messages = [];
        this.loadingMessages = true;
        this.active = conversation;
        this.form.receiver_id = this.conversationalist(conversation).id;

        axios.put(`/conversations/${this.form.receiver_id}`)
          .then((response) => {
            this.messages = response.data;
            this.loadingMessages = false;

            conversation.read_at = response.data[response.data.length - 1].read_at;

            this.updateUnreadMessages();
          });
      }
    },

    /**
     * Remove the unread messages from the opening conversation.
     */
    updateUnreadMessages() {
      this.user.unread_messages = this.user.unread_messages.filter(
        message => message.sender_id !== this.form.receiver_id
      );
    },

    /**
     * Send the message.
     */
    send() {
      const formData = new FormData();

      formData.append('receiver_id', this.form.receiver_id);
      formData.append('content', this.form.content);

      this.form.files.forEach((file, key) => {
        formData.append(`files[${key}]`, file);
      });

      axios.post('/messages', formData)
        .then((response) => {
          this.form.content = '';
          this.form.files = [];
          this.messages.push(response.data);

          this.updateConversations(this.form.receiver_id, 'sent');
        });
    },

    /**
     * Mark the given conversation as read.
     */
    readConversation(conversation) {
      axios.put(`/conversations/${this.form.receiver_id}`)
        .then((response) => {
          conversation.read_at = response.data[response.data.length - 1].read_at;
        });
    },

    /**
     * Get the users matching the query string.
     */
    getResults() {
      if (this.query.length === 0) {
        this.users = [];

        return;
      }

      axios.get(`/search/users?limit=${this.limit}&query=${this.query}`)
        .then((response) => {
          this.showSearch = true;
          this.users = response.data;
        });
    },

    /**
     * Determine if the given conversation is active.
     */
    isActive(conversation) {
      return this.active && this.active.id === conversation.id;
    },

    /**
     * Get the conversationalist from the given conversation.
     */
    conversationalist(conversation) {
      return this.user.id === conversation.sender.id ? conversation.receiver : conversation.sender;
    },

    /**
     * Determine if the conversation is unread.
     */
    isUnread(conversation) {
      return this.user.id === conversation.receiver_id && !conversation.read_at;
    },

    /**
     * Start a conversation with the given user.
     */
    startConversation(user) {
      this.form.receiver_id = user.id;
      this.messages = [];
    },
  },
};
</script>
