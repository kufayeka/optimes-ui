<template>
  <!-- POPUP: ACCOUNT INFORMATION -->
  <molecules-molecule-popup-information
    :open="_state_popup_view_account"
    title="Account Information"
    maxWidth="500"
    @close="ui_command_popup_view_account_close"
  >
    <molecules-molecule-popup-content-base>
      <template #content>
        <molecules-molecule-data-display-account :accountData="_data_selected_account" />
      </template>
      <template #actions>
        <v-btn variant="outlined" color="primary" @click="ui_command_popup_edit_account_open(_data_selected_account)">Edit</v-btn>
        <v-btn variant="outlined" color="red" @click="pipe_execute_logout()">Log Out</v-btn>
      </template>
    </molecules-molecule-popup-content-base>
  </molecules-molecule-popup-information>

  <!-- POPUP: EDIT ACCOUNT -->
  <molecules-molecule-popup-edit
    :open="_state_popup_edit_account"
    title="Edit Account"
    maxWidth="500"
    @close="ui_command_popup_edit_account_close"
  >
    <molecules-molecule-popup-content-base>
      <template #content>
        <!-- Menggunakan form edit generik; silakan sesuaikan field sesuai kebutuhan -->
        <molecules-molecule-form-edit-generic
          :formTemplate="editAccountFormTemplate"
          :formInitialData="editAccountFormInitialData"
          v-model:formUpdatedData="_data_modified_account"
        />
      </template>
      <template #actions>
        <molecules-molecule-group-button-save-discard
          @save="ui_command_popup_confirm_edit_account_open"
          @discard="ui_command_popup_edit_account_close"
        />
      </template>
    </molecules-molecule-popup-content-base>
  </molecules-molecule-popup-edit>

  <!-- POPUP: EDIT CONFIRMATION -->
  <molecules-molecule-popup-confirmation
    :open="_state_popup_confirm_edit_account"
    title="Confirm Account Update"
    maxWidth="500"
    @close="ui_command_popup_confirm_edit_account_close"
  >
    <molecules-molecule-popup-content-base>
      <template #content>
        <atoms-atom-base-label>Are you sure you want to update your account details?</atoms-atom-base-label>
      </template>
      <template #actions>
        <molecules-molecule-group-button-yes-no
          @yes="pipe_execute_update_account"
          @no="ui_command_popup_confirm_edit_account_close"
        />
      </template>
    </molecules-molecule-popup-content-base>
  </molecules-molecule-popup-confirmation>

  <!-- POPUP: SUCCESS -->
  <molecules-molecule-popup-success
    :open="_state_popup_success"
    title="Success"
    maxWidth="400"
    @close="ui_command_popup_success_close"
  >
    <molecules-molecule-popup-content-base>
      <template #content>
        <pre>{{ _data_success_msg }}</pre>
      </template>
    </molecules-molecule-popup-content-base>
  </molecules-molecule-popup-success>

  <!-- POPUP: ERROR -->
  <molecules-molecule-popup-error
    :open="_state_popup_error"
    title="Error"
    maxWidth="400"
    @close="ui_command_popup_error_close"
  >
    <molecules-molecule-popup-content-base>
      <template #content>
        <pre>{{ _data_error_msg }}</pre>
      </template>
    </molecules-molecule-popup-content-base>
  </molecules-molecule-popup-error>

  <!-- Tombol untuk membuka popup Account Information -->
  <v-btn variant="outlined" prepend-icon="mdi-account-circle" @click="ui_command_popup_view_account_open(_data_selected_account)">
    Account ({{ username }})
  </v-btn>
</template>

<script setup>
import { computed } from 'vue';
import { useAccountManager } from '@/composables/use-account-manager';

const {
  _data_selected_account,
  _data_modified_account,
  _data_success_msg,
  _data_error_msg,
  _state_popup_error,
  _state_popup_success,
  _state_popup_view_account,
  _state_popup_edit_account,
  _state_popup_confirm_edit_account,
  ui_command_popup_view_account_open,
  ui_command_popup_view_account_close,
  ui_command_popup_edit_account_open,
  ui_command_popup_edit_account_close,
  ui_command_popup_confirm_edit_account_open,
  ui_command_popup_confirm_edit_account_close,
  ui_command_popup_success_close,
  ui_command_popup_error_close,
  pipe_execute_update_account,
  pipe_execute_logout
} = useAccountManager();

// computed property untuk menampilkan nama (fullname atau username)
const username = computed(() => {
  const name = _data_selected_account.value.fullname || _data_selected_account.value.username || 'Account';
  return name.length > 10 ? name.slice(0, 10) + '…' : name;
});

// Form edit account: sesuaikan field yang diperlukan
const editAccountFormTemplate = computed(() => [
  { key: 'raw.key', label: 'Key', type: 'text', disabled: true },
{ key: 'raw.id', label: 'Account ID', type: 'text', disabled: true },
  { key: 'raw.username', label: 'Username', type: 'text', required: true },
  { key: 'raw.password', label: 'Password', type: 'password', required: false },
]);

// Set form initial data berdasarkan account yang sedang dipilih
const editAccountFormInitialData = computed(() => {
  const acc = _data_selected_account.value;
  if (!acc || Object.keys(acc).length === 0) return {};
  return {
    // Menggunakan prefix raw. agar konsisten dengan key pada formTemplate
    raw: {
      key: acc.key,
      id: acc.id,
      username: acc.username,
      fullname: acc.fullname,
      password: '', // kosongkan password bila tidak ingin diubah
      role: acc.role,
      status: acc.status
    }
  };
});
</script>