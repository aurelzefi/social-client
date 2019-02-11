<template>
  <div class="modal fade" id="confirm-modal" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Complete Action</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          Are you sure you want to complete this action?
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">No</button>
          <button type="button" class="btn btn-primary" @click="confirm">Yes</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['action'],

  methods: {
    confirm() {
      this.action();

      $('#confirm-modal').modal('hide');
    }
  },
};
</script>
