<template>
    <molecules-molecule-popup-information
        :title="'Account Information'"
        :open="popupOpen"
        @close="popupOpen = false"
        maxWidth="500"
    >
        <molecules-molecule-popup-content-base>
            <template #content>
                <molecules-molecule-data-display-account :account-data="accountData"/>
            </template>
            <template #actions>
                <v-btn color="primary" variant="outlined" @click="popupOpenEditAccount = true">Edit</v-btn>
                <v-btn color="red" variant="outlined" @click="popupOpenLogoutAccount = true">Log Out</v-btn>
            </template>
        </molecules-molecule-popup-content-base>
    </molecules-molecule-popup-information>

    <molecules-molecule-popup-edit
        :title="'Edit Account'"
        :open="popupOpenEditAccount"
        @close="popupOpenEditAccount = false"
        maxWidth="500">
            <molecules-molecule-popup-content-base>
                <template #content>
                    <molecules-molecule-form-field-text
                        v-model="editAccountForm.fullname"
                        label="Full Name"
                        type="text"
                        :placeholder="'Enter your full name'"
                        :bold="true"
                    />
                    <molecules-molecule-form-field-text
                        v-model="editAccountForm.username"
                        label="Username"
                        type="text"
                        :placeholder="'Enter your username'"
                        :bold="true"
                    />
                    <molecules-molecule-form-field-text
                        v-model="editAccountForm.password"
                        label="Password"
                        type="password"
                        :placeholder="'Enter new password (optional)'"
                        :bold="true"
                    />
            </template>
            <template #actions>
                <molecules-molecule-group-button-save-discard 
                    @save="handleAccountUpdate()" 
                    @discard="popupOpenEditAccount = false"
                />
            </template>
        </molecules-molecule-popup-content-base>       
    </molecules-molecule-popup-edit>

    <molecules-molecule-popup-confirmation
        :title="'Logout Confirmation'"
        :open="popupOpenLogoutAccount" 
        @close="popupOpenLogoutAccount = false"
        maxWidth="500">
        <molecules-molecule-popup-content-base>
            <template #content>
                <atoms-atom-base-label>Are you sure you want to log out?</atoms-atom-base-label>
            </template>
            <template #actions>
                <molecules-molecule-group-button-yes-no 
                    @yes="handleLogout()" 
                    @no="popupOpenLogoutAccount = false"
                />
            </template>
        </molecules-molecule-popup-content-base>
    </molecules-molecule-popup-confirmation>

    <molecules-molecule-popup-success
        :open="successMessage"
        :title="'Success'"
        @close="successMessage = false"
        maxWidth="400"
        >
        <v-sheet class="pa-2">
            <atoms-atom-base-label>{{ successMessage }}</atoms-atom-base-label>
        </v-sheet>
    </molecules-molecule-popup-success>

    <molecules-molecule-popup-error
        :open="errorMessage"
        :title="'Error'"
        @close="errorMessage = false"
        maxWidth="400"
        >
        <v-sheet class="pa-2">
            <atoms-atom-base-label>{{ errorMessage }}</atoms-atom-base-label>
        </v-sheet>
    </molecules-molecule-popup-error>

    <v-btn 
        class="mr-2" 
        v-if="accountData"
        prepend-icon="mdi-account-circle" 
        variant="outlined" 
        @click="popupOpen = !popupOpen"
    >
        Account ({{ username }})
    </v-btn>
</template>

<script setup lang="js">
import { ref } from 'vue';
import { validateLoginCookie, accountLogout, accountUpdate } from '~/services/accounts/service-account';

const popupOpen = ref(false);
const popupOpenEditAccount = ref(false);
const popupOpenLogoutAccount = ref(false);

const successMessage = ref(null);
const errorMessage = ref(null);

const accountData = ref(null);
const editAccountForm = reactive({
  id: '',
  fullname: '',
  role: '',
  username: '',
  password: '',
  status: ''
});


const username = computed(() => {
  const name = accountData.value.fullname.trim();
  return name.length > 10 ? name.slice(0, 10) + '…' : name;
});

watch(
  () => accountData.value,
  (val) => {
    if (val) {
      editAccountForm.id = accountData.value.id;
      editAccountForm.fullname = accountData.value.fullname;
      editAccountForm.role = accountData.value.role;
      editAccountForm.username = accountData.value.username;
      editAccountForm.password = '';
      editAccountForm.status = accountData.value.status;
    }
  }
);


const getAccountData = async () => {
    try {
        const response = await validateLoginCookie();

        accountData.value = response.data;

        console.log('✅ Access granted for role:', response.data.username);
        return;

    } catch (err) {
        console.error('Error getAccountData:', err);
    }
};

const handleAccountUpdate = async () => {
  errorMessage.value = '';
  successMessage.value = '';

  // Simple validation
  if (!editAccountForm.fullname || !editAccountForm.username || !editAccountForm.role) {
    errorMessage.value = 'Full name, username, and role are required.';
    return;
  }

  try {
    // Build request body
    const reqBody = {
      id: editAccountForm.id,
      fullname: editAccountForm.fullname,
      role: editAccountForm.role,
      username: editAccountForm.username,
      password: editAccountForm.password,
      status: editAccountForm.status
    };

    const response = await accountUpdate(reqBody);

    if (response.success) {
      successMessage.value = 'Account updated successfully!';
      errorMessage.value = null;
      return
    } else {
      errorMessage.value = response.message || 'Failed to update account.';
      successMessage.value = null;
    }
  } catch (err) {
    errorMessage.value = err?.message || 'Error updating account.';
    successMessage.value = null;
  }
};


const handleLogout = () => {
  accountLogout()
    .then(() => {
      window.location.href = '/login';
    })
    .catch((error) => {
      console.error('Logout failed:', error);
    });
};


onMounted(() => {
    getAccountData();
});

onUnmounted(() => {
// if (chart.value) chart.value.destroy();
});


</script>