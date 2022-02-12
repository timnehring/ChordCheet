<template>
  <v-app>
    <the-navigation @toggleSongList="toggleSongList" />
    <v-main>
      <v-container fluid class="py-0 px-0 fill-height">
        <router-view :showSongList="showSongList" />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import TheNavigation from "./components/layout/TheNavigation";

export default {
  name: "App",
  components: {
    TheNavigation,
  },

  data: () => ({
    showSongList: true,
    appActiveSong: {},
    prevRoute: null,
  }),
  methods: {
    toggleSongList() {
      this.showSongList = !this.showSongList;
    },
  },
  mounted() {
    window.ipcRenderer.send("getTheme");
    window.ipcRenderer.once("getThemeReply", (event) => {
      if (event === "light") {
        this.$vuetify.theme.dark = false;
      } else {
        this.$vuetify.theme.dark = true;
      }
    });
  },
};
</script>

<style>
html {
  overflow-y: auto;
}
*::-webkit-scrollbar-track {
  background-color: rgba(0, 0, 0, 0);
}

*::-webkit-scrollbar {
  width: 12px;
  background-color: rgba(0, 0, 0, 0);
}

*::-webkit-scrollbar-thumb {
  border: 4px solid rgba(0, 0, 0, 0);
  background-clip: padding-box;
  -webkit-border-radius: 20px;
  border-radius: 20px;
  background-color: #bdbdbd;
}
#chord-textarea {
  margin: 0 !important;
}
</style>