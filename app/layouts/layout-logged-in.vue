<template>
  <v-app>
    <!-- Header Sticky -->
    <v-app-bar app color="primary" dark :elevation="2">
      <template v-slot:prepend>
        <!-- <v-app-bar-nav-icon></v-app-bar-nav-icon> -->
        <img src="/img/jvt_optimes.png" alt="optimes" class="w-70 h-50"/>
      </template>

      <v-app-bar-title>
        
      </v-app-bar-title>

      <template v-slot:append>
        <component-header></component-header>
      </template>
    </v-app-bar>

    <v-main>
      <v-container fluid> 
        <slot></slot> <!-- Content -->
      </v-container>
    </v-main>

    <!-- Footer -->
    <v-footer app color="grey-darken-3" class="text-center py-4">
      <span class="white--text">&copy; {{ new Date().getFullYear() }} Made by Javindotech</span>
    </v-footer>
  </v-app>
</template>

<script lang="js">

</script>

<style scoped>
.v-main {
  min-height: calc(100vh - 64px - 56px);
}
</style>