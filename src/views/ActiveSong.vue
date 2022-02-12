<template>
  <v-container fluid class="fill-height">
    <v-row class="">
      <v-col xl="2" sm="2" v-if="listActive" class="grey px-0 py-0">
        <song-list
          :songs="songlistData"
          :activeSong="activeSong"
          @viewSong="changeCurrent"
        />
      </v-col>
      <v-col cols="showSongList? 10 : 12" class="px-0 py-0">
        <current-song :key="componentKey" :activeSong="activeSong" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import SongList from "../components/SongList.vue";
import CurrentSong from "../components/CurrentSong.vue";

export default {
  props: ["showSongList", "songID"],
  components: {
    SongList,
    CurrentSong,
  },
  data: () => ({
    songlistData: [],
    activeSong: {},
    listActive: true,
    componentKey: 0,
    prevRoute: null,
  }),
  methods: {
    forceRerender() {
      this.componentKey += 1;
    },
    changeCurrent(id) {
      console.log("ID: " + id);
      window.ipcRenderer.send("getSong", id);
      window.ipcRenderer.once("getSongReply", (event) => {
        this.activeSong = event[0];
        this.forceRerender();
      });
    },
  },
  watch: {
    showSongList() {
      this.listActive = !this.listActive;
      this.forceRerender();
    },
  },
  created() {
    window.ipcRenderer.send("getSonglist", "getSonglist");
    window.ipcRenderer.once("getSonglistReply", (event) => {
      this.songlistData = event;
      if (this.songID != undefined) {
        this.changeCurrent(this.songID);
        console.log(this.songID);
      }
    });
  },
};
</script>
<style scoped>
* {
  margin: 0;
  padding: 0;
}
</style>
