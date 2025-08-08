<!-- src/components/organisms/OrganismLoginForm.vue -->
<template>
  <v-form @submit.prevent="handleLogin" class="login-form">
      <molecules-molecule-form-section title="Login">

      <molecules-molecule-popup-error
        :autoClose="false"
        :open="errorMessage"
        :title="'Error'"
        @close="errorMessage = false"
        maxWidth="400"
      >
        <atoms-atom-base-wrapper width="400px" height="100px" maxWidth="100%" maxHeight="400px">
            <pre>{{ errorMessage }}</pre>
        </atoms-atom-base-wrapper>
      </molecules-molecule-popup-error>

      <molecules-molecule-popup-success
          :open="successMessage"
          :title="'Success'"
          @close="successMessage = false"
          maxWidth="400"
      >
        <atoms-atom-base-wrapper width="400px" height="100px" maxWidth="100%" maxHeight="400px">
            <atoms-atom-base-label>{{ successMessage }}</atoms-atom-base-label>
        </atoms-atom-base-wrapper>
      </molecules-molecule-popup-success>

        <molecules-molecule-form-field-text
          v-model="form.username"
          label="Username"
          type="username"
          :placeholder="'Enter your username'"
          :rules="usernameRules"
          :bold="true"
        />
        <molecules-molecule-form-field-text
          v-model="form.password"
          label="Password"
          type="password"
          :placeholder="'Enter your password'"
          :rules="passwordRules"
          :bold="true"
        />
        <molecules-molecule-form-dropdown-account-role v-model="form.role"/>
        <molecules-molecule-form-dropdown-shift v-model="form.selectedShiftId"/>
        <molecules-molecule-form-dropdown-machine v-model="form.selectedEntityId"/>
        <v-row class="flex-row ga-3 justify-space-evenly">
          <atoms-atom-base-button @click="handleLogin">Login</atoms-atom-base-button>
        </v-row>
      </molecules-molecule-form-section>
  </v-form>
</template>

<script setup lang="js">
import { reactive, ref } from 'vue';


// Form state
const form = reactive({
  username: null,
  password: null,
  role: null,
  selectedShiftId: null,
  selectedEntityId: null,
});

const errorMessage = ref(null);
const successMessage = ref(null);

const isSubmitting = ref(false);

// Validation rules
const usernameRules = [
  (v) => !!v || 'Username is required',
];
const passwordRules = [
  (v) => !!v || 'Password is required',
  (v) => (v && v.length >= 6) || 'Password must be at least 6 characters',
];

// Props
defineProps({
  elevation: {
    type: [Number, String],
    default: 2,
  },
  outlined: {
    type: Boolean,
    default: false,
  },
});


// Submit handler
const handleLogin = async () => {
  isSubmitting.value = true;
  errorMessage.value = null;
  successMessage.value = null;

  // Simulate form validation/submission
  if (!form.username || !form.password) {
    errorMessage.value = 'Please fill in all fields';
    successMessage.value = null;
    isSubmitting.value = false;
    return;
  }

  if (!usernameRules.every((rule) => rule(form.username) === true)) {
    errorMessage.value = 'Invalid email format';
    successMessage.value = null;
    isSubmitting.value = false;
    return;
  }

  if (!passwordRules.every((rule) => rule(form.password) === true)) {
    errorMessage.value = 'Password must be at least 6 characters';
    successMessage.value = null;
    isSubmitting.value = false;
    return;
  }

  try {
    const response = await apiServices.postAccountLogin({
      body: {
        username: form.username,
        password: form.password,
        role: form.role,
        selectedEntityId: form.selectedEntityId,
        selectedShiftId: form.selectedShiftId,
      }
    });
    console.log(response);
    if (response.success) {
      successMessage.value = 'Login Success';
      errorMessage.value = null;
      setTimeout(()=>{
        window.location.reload();
      }, 1000)
    } else {
      errorMessage.value = JSON.stringify(response);
      successMessage.value = null;
    }
  } catch (err) {
    console.error(err);
    errorMessage.value = err;
    successMessage.value = null;
  } finally {
    isSubmitting.value = false;
  }
};

</script>

<style scoped>
.login-form {
  max-width: 400px;
  margin: 0 auto;
  padding: 16px;
}
</style>