<template>
  <molecules-molecule-form-section :title="'Event History'">
    <template #endSection>
      <v-btn variant="outlined" color="primary" @click="_handle_fetch_all">Refresh</v-btn>
    </template>

    <molecules-molecule-table-event-history-process 
      :eventHistoryData="_event_history"
      @endEvent="_handle_end_event"
      @editEvent="_open_edit_popup"
      @applyEvent="_handle_apply_event"
    />
  </molecules-molecule-form-section>

  <molecules-molecule-popup-edit
    :title="'Edit Event'"
    :open="_popup_open"
    @close="_close_popup"
    maxWidth="500"
  >
    <molecules-molecule-popup-content-base>
      <template #content>
        <atoms-atom-base-wrapper max-width="100%" max-height="400px">
          <molecules-molecule-data-edit-event-process 
            :initialData="_selected_event" 
            @update="_updated_event = $event"
          />
        </atoms-atom-base-wrapper>
      </template>
      <template #actions>
        <molecules-molecule-group-button-save-discard 
          @save="_handle_edit_event" 
          @discard="_close_popup"
        />
      </template>
    </molecules-molecule-popup-content-base>       
  </molecules-molecule-popup-edit>

  <molecules-molecule-popup-error
    :autoClose="false"
    :open="_error_message"
    :title="'Error'"
    @close="_close_error"
    maxWidth="400"
  >
    <atoms-atom-base-wrapper width="400px" height="50px" maxWidth="100%" maxHeight="50px">
      <atoms-atom-base-label>{{ _error_message }}</atoms-atom-base-label>
    </atoms-atom-base-wrapper>
  </molecules-molecule-popup-error>

  <molecules-molecule-popup-success
    :open="_success_message"
    :title="'Success'"
    @close="_close_success"
    auto-close="true"
    maxWidth="400"
  >
    <atoms-atom-base-wrapper width="400px" height="50px" maxWidth="100%" maxHeight="50px">
      <atoms-atom-base-label>{{ _success_message }}</atoms-atom-base-label>
    </atoms-atom-base-wrapper>
  </molecules-molecule-popup-success>
</template>

<script setup lang="js">
import { useEventHistoryProcess } from '@/composables/useEventHistoryProcess'

const {
  // state
  _success_message,
  _error_message,
  _event_history,
  _selected_event,
  _updated_event,
  _popup_open,

  // API handlers
  _handle_fetch_all,
  _handle_end_event,
  _handle_edit_event,
  _handle_apply_event,

  // Popup handlers
  _open_edit_popup,
  _close_popup,
  _close_success,
  _close_error,
} = useEventHistoryProcess()
</script>
