<template>
  <v-container fluid class="black" v-if="activeSong._id">
    <div
      id="test"
      class="pa-2"
      style="
        position: relative;
        height: 100vh;
        max-width: 100%;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        align-content: space-around;
      "
      v-resize-text="{
        ratio: ratio,
        minFontSize: '7px',
        maxFontSize: '32px',
        delay: 200,
      }"
    >
      <div v-for="part in activeSong.part" :key="part.id" class="py-0 px-3">
        <p
          :style="{
            'user-select': 'none',
            'font-family': 'Roboto',
            color: createColorString(part.type, 'heading'),
          }"
          class="px-0 my-0 px-0 my-0"
        >
          {{ part.type }}
        </p>
        <pre
          :style="{
            'user-select': 'none',
            'font-family': 'Roboto',
            color: createColorString(part.type, 'text'),
          }"
          class="px-0 py-0"
        >
            {{ part.text }}
          </pre
        >
      </div>

      <div style="position: absolute; right: 0; bottom: 0; user-select: none">
        <v-chip
          small
          label
          class="mx-1 my-1 px-3 py-4"
          v-if="activeSong.title && activeSong.artist"
          ><v-icon left> mdi-account-music </v-icon>{{ activeSong.title }} -
          {{ activeSong.artist }}</v-chip
        >
        <v-chip small label class="mx-1 my-1 px-3 py-4" v-if="activeSong.capo"
          ><v-icon left> mdi-arrow-up-bold-circle </v-icon>Capo:
          {{ activeSong.capo }}</v-chip
        >
        <v-chip small label class="mx-1 my-1 px-3 py-4" v-if="activeSong.bpm"
          ><v-icon left> mdi-metronome </v-icon>BPM:
          {{ activeSong.bpm }}</v-chip
        >
      </div>
    </div>
  </v-container>
</template>

<script>
export default {
  props: ["activeSong"],
  data: () => ({
    // lighten-3 for text, lighten-1 for heading
    colors: {
      intro: {
        heading: "#BDBDBD",
        text: "#EEEEEE",
      },
      // light blue
      verse: {
        heading: "#29B6F6",
        text: "#81D4FA",
      },
      // orange
      preChorus: {
        heading: "#FFA726",
        text: "#FFCC80",
      },
      // light-green
      chorus: {
        heading: "#9CCC65",
        text: "#C5E1A5",
      },
      // purple
      bridge: {
        heading: "#AB47BC",
        text: "#CE93D8",
      },
      outro: {
        heading: "#BDBDBD",
        text: "#EEEEEE",
      },
      // yellow
      solo: {
        heading: "#FFEE58",
        text: "#FFF59D",
      },
      // yellow
      instrumental: {
        heading: "#FFEE58",
        text: "#FFF59D",
      },
      // yellow
      interlude: {
        heading: "#FFEE58",
        text: "#FFF59D",
      },
      // grey
      riff: {
        heading: "#BDBDBD",
        text: "#EEEEEE",
      },
      // grey
      chords: {
        heading: "#BDBDBD",
        text: "#EEEEEE",
      },
      // grey
      info: {
        heading: "#BDBDBD",
        text: "#EEEEEE",
      },
    },
  }),
  computed: {
    ratio() {
      if (
        this.activeSong.part.length >= 12 ||
        this.activeSong.charCount >= 2800
      ) {
        return 14
      } else {
        return 10
      }
    },
  },
  methods: {
    createColorString(type, segment) {
      type = type.toLowerCase();
      if (type == "pre-chorus") {
        type = "preChorus";
      }
      let color = this.colors[type][segment];
      return color;
    },
  },
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
}
</style>
