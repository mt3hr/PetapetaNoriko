<template>
  <v-app @contextmenu.prevent.stop="() => { }">
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'App',
})
</script>
<style>
body {
  width: 100%;
  height: 100%;
}

body::-webkit-scrollbar {
  display: none;
}
</style>
