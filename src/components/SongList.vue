<template>
  <v-card tile style="height: 100vh" class="py-0 px-0">
    <v-text-field
      outlined
      dense
      hide-details="true"
      prepend-inner-icon="mdi-magnify"
      v-model="search"
      placeholder="search term"
      class="my-0 py-1 px-1"
    ></v-text-field>
    <v-divider></v-divider>
    <v-list class="py-0 px-0" max-height="">
      <v-list-item-group color="primary">
        <template v-for="song in filteredList">
          <v-list-item :key="song._id" link :to="'/activesong/' + song._id">
            <v-list-item-content @click="viewSong(song._id)">
              <v-list-item-title>{{ song.title }}</v-list-item-title>
              <v-list-item-subtitle> {{ song.artist }}</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action v-if="song._id == activeSong._id">
              <v-btn icon :to="'/song/edit/' + song._id">
                <v-icon color="grey"> mdi-pencil </v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
          <v-divider :key="'divider' + song._id"></v-divider>
        </template>
      </v-list-item-group>
    </v-list>

    <v-scale-transition origin="center">
      <v-btn
        v-show="!hidden"
        color="primary"
        elevation="2"
        fab
        bottom
        right
        absolute
        class="mb-10"
        to="/song/add"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-scale-transition>
  </v-card>
</template>

<script>
export default {
  props: ["songs", "activeSong"],
  data: () => ({
    hidden: true,
    search: "",
  }),
  computed: {
    filteredList() {
      return this.songs.filter((song) => {
        return (
          song.title.toLowerCase().includes(this.search.toLowerCase()) ||
          song.artist.toLowerCase().includes(this.search.toLowerCase())
        );
      });
    },
  },
  created() {
    setTimeout(() => (this.hidden = false), 300);
  },
  methods: {
    viewSong(id) {
      this.$emit("viewSong", id);
    },
    editSong() {
      let route = "edit";
      this.$router.replace("/song/" + route);
    },
  },
};
</script>

<style scoped>
.v-list {
  overflow: auto;
  overflow-x: hidden;
}
</style>