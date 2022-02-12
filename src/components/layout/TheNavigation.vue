<template>
  <v-navigation-drawer mini-variant permanent app>
    <v-list nav>
      <v-list-item
        key="to"
        v-if="
          this.$route.name != 'Active Song' &&
          this.$route.name != 'Active Song ID'
        "
        link
        to="/activesong"
      >
        <v-list-item-icon>
          <v-icon>mdi-playlist-music</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>Songlist</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item
        key="toggle"
        v-else-if="
          this.$route.name === 'Active Song' ||
          this.$route.name === 'Active Song ID'
        "
        link
        @click="toggleSongList"
      >
        <v-list-item-icon>
          <v-icon>{{ listIcon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>Songlist</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <template v-slot:append>
      <v-divider />
      <v-list nav>
        <v-list-item :key="themeIcon" @click="toggleTheme">
          <v-list-item-icon>
            <v-icon>{{ themeIcon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content> </v-list-item-content>
        </v-list-item>
      </v-list>
    </template>
  </v-navigation-drawer>
</template>

<script>
export default {
  data: () => ({
    listIcon: "mdi-playlist-remove",
  }),
  methods: {
    toggleSongList() {
      this.$emit("toggleSongList");
      console.log("TRIGGERED");
      if (this.listIcon === "mdi-playlist-plus") {
        this.listIcon = "mdi-playlist-remove";
      } else {
        this.listIcon = "mdi-playlist-plus";
      }
    },
    toggleTheme() {
      if (this.$vuetify.theme.dark) {
        this.$vuetify.theme.dark = false;
        window.ipcRenderer.send("setTheme", "light");
      } else {
        this.$vuetify.theme.dark = true;
        window.ipcRenderer.send("setTheme", "dark");
      }
    },
  },
  computed: {
    themeIcon() {
      if (this.$vuetify.theme.dark) {
        return "mdi-moon-waning-crescent";
      } else {
        return "mdi-white-balance-sunny";
      }
    },
  },
};
</script>