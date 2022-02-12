<template>
  <v-container class="fill-height" fluid>
    <v-form class="fill-height" style="width: 100%">
      <v-container class="py-0 px-0 d-flex flex-column fill-height" fluid>
        <v-row style="width: 100%">
          <v-spacer />
          <v-col cols="7">
            <div
              class="px-3 py-3"
              id="text-input"
            >
              <v-textarea
                id="chord-textarea"
                no-resize
                counter 
                outlined
                label="Chords & Lyrics"
                persistent-placeholder
                :placeholder="hintText"
                :rules="rules"
                style="height: 100%; width: 100%"
                v-model="text"
              ></v-textarea>
              <div style="position: absolute; right: 1.5em; bottom: 7%">
                <add-edit-song-dialog />
              </div>
            </div>
          </v-col>
          <v-spacer />
          <v-col cols="4">
            <div id="info-input" style="width: 100%">
              <v-container fluid class="py-0 px-0">
                <v-row class="py-3 px-3" style="">
                  <v-col cols="12">
                    <v-text-field
                      type="text"
                      outlined
                      dense
                      v-model="title"
                      label="Title"
                      required
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12">
                    <v-text-field
                      type="text"
                      outlined
                      dense
                      v-model="artist"
                      label="Artist"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="5">
                    <v-text-field
                      type="number"
                      outlined
                      dense
                      v-model.number="capo"
                      label="Capo"
                    ></v-text-field>
                  </v-col>
                  <v-spacer />
                  <v-col cols="5">
                    <v-text-field
                      type="number"
                      outlined
                      dense
                      v-model.number="bpm"
                      label="BPM"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </div>
          </v-col>
          <v-spacer />
        </v-row>
      </v-container>
    </v-form>

    <div
      style="
        display: flex;
        position: absolute;
        right: 0;
        bottom: 0;
        padding-right: 1em;
        padding-bottom: 1em;
      "
    >
      <v-scale-transition origin="center">
        <v-btn
          v-show="!hidden"
          color="error"
          elevation="2"
          :loading="loading"
          style="align-self: center"
          fab
          class="mx-2"
          v-if="addEdit === 'edit'"
          @click="deleteSong"
        >
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </v-scale-transition>
      <v-scale-transition origin="center">
        <v-btn
          v-show="!hidden"
          :color="saving.active ? 'success' : 'error'"
          elevation="2"
          :loading="loading"
          :key="saving.icon"
          fab
          x-large
          class="mx-2"
          @click="submitText"
        >
          <v-icon>{{ saving.icon }}</v-icon>
        </v-btn>
      </v-scale-transition>
    </div>

    <v-snackbar v-model="snackbar" timeout="7000">{{
      missingEntries
    }}</v-snackbar>
  </v-container>
</template>

<script>
import AddEditSongDialog from "../components/AddEditSongDialog.vue";

export default {
  props: ["addEdit", "songID"],
  components: {
    AddEditSongDialog,
  },
  data: () => ({
    title: "",
    artist: "",
    capo: null,
    bpm: null,
    text: "",
    textObject: {
      _id: "",
      artist: "",
      title: "",
      capo: null,
      bpm: null,
      charCount: null,
      fullText: "",
      part: [],
    },
    hidden: true,
    snackbar: false,
    loading: false,
    maxTextLength: 5000,
    rules: [v => v.length <= 5000 || 'Max 5000 characters'],
    hintText: `[Intro]
C G Am F
C G Am F
 
[Verse]
  C                               G
I walked through the door with you, the air was cold
    Am                           F
But something 'bout it felt like home somehow, and I, 
C                           G
Left my scarf there at your sister's house
        Am                    F (once)
And you still got it, in your drawer, even now`,
  }),
  computed: {
    saving() {
      let info = { icon: "mdi-content-save-off", active: null };
      if (this.title && this.artist && this.text && this.text.length <= this.maxTextLength) {
        info.icon = "mdi-content-save";
        info.active = true;
      } else {
        info.icon = "mdi-content-save-off";
        info.active = false;
      }
      return info;
    },
    missingEntries() {
      let missingArray = [];
      let missingString = "";
      let length = 0;
      if (this.text.length > this.maxTextLength) {
        missingArray.push("less lyrics")
      }
      if (!this.text) {
        missingArray.push("lyrics");
      }
      if (!this.title) {
        missingArray.push("a title");
      }
      if (!this.artist) {
        missingArray.push("an artist");
      }
      length = missingArray.length;
      if (length === 0) {
        return "You're good to go now! Press the button to save.";
      } else if (length === 1) {
        missingString = missingArray[0];
      } else {
        for (var i = 0; i < length - 2; i++) {
          missingString += missingArray[i] + ", ";
        }
        missingString += missingArray[length - 2] + " & ";
        missingString += missingArray[length - 1];
      }
      return (
        "Can't save yet! Please make sure to enter " + missingString + " ..."
      );
    },
  },
  methods: {
    textRegex(text) {
      let re =
        /((\[(intro|verse|pre-chorus|chorus|bridge|outro|solo|instrumental|interlude|riff|chords|info)[\w\d\s]*\])([\w\d\s(.|,|!|?|'|"|´|`|’|\-|/||\\|#|*|ä|ü|ö|ß|&)]*))/gi;
      let found = text.match(re);
      this.textObject.artist = this.artist;
      this.textObject.title = this.title;
      this.textObject.capo = this.capo;
      this.textObject.bpm = this.bpm;
      
      
      this.textObject.fullText = this.text;
      this.textObject.charCount = this.textObject.fullText.length
      console.log(this.textObject.fullText.length)
      if (this._id != "") {
        this.textObject._id = this._id;
      }
      for (var i = 0; i < found.length; i++) {
        let typeRe =
          /(intro|verse|pre-chorus|chorus|bridge|outro|solo|instrumental|interlude|riff|chords|info)/gi;
        let textRe =
          /((\[(intro|verse|pre-chorus|chorus|bridge|outro|solo|instrumental|interlude|riff|chords|info)[\w\d\s]*\])(?<text>[\w\d\s(.|,|!|?|'|"|´|`|’|\-|/||\\|#|*|ä|ü|ö||&)]*))/gi; //testing stuff
        let partType = found[i].match(typeRe)[0];
        //console.log(partType)
        let part = {
          id: i,
          type: partType,
          text: textRe.exec(found[i]).groups.text,
        };
        this.textObject.part.push(part);
      }
    },
    submitText() {
      if (this.addEdit === "add") {
        this.processText("add");
      } else if (this.addEdit === "edit") {
        this.processText("edit");
      }
    },
    processText(page) {
      let sendCommand;
      if (page === "add") {
        sendCommand = "addSong";
      } else if (page === "edit") {
        sendCommand = "updateSong";
      }
      if (this.saving.active) {
        this.textRegex(this.text);
        window.ipcRenderer.send(sendCommand, this.textObject);
        this.loading = true;
        window.ipcRenderer.once(sendCommand + "Reply", (event) => {
          this.loading = false;
          this.$router.replace("/activesong/" + event);
        });
      } else {
        this.snackbar = true;
      }
    },
    deleteSong() {
      window.ipcRenderer.send("deleteSong", this.activeSong._id);
      window.ipcRenderer.once("deleteSongReply", (event) => {
        if (event == 1) {
          this.$router.replace("/activesong");
        }
      });
    },
  },
  created() {
    setTimeout(() => (this.hidden = false), 300);
    if (this.addEdit == "edit") {
      window.ipcRenderer.send("getSong", this.songID);
      window.ipcRenderer.once("getSongReply", (event) => {
        this.activeSong = event[0];
        this.title = this.activeSong.title;
        this.bpm = this.activeSong.bpm;
        this.artist = this.activeSong.artist;
        this.capo = this.activeSong.capo;
        this.text = this.activeSong.fullText;
        this._id = this.activeSong._id;
        //console.log(this.activeSong);
      });
    }
  },
};
</script>

// todo: add deep selector only to the chord area
<style scoped>
* {
  margin: 0;
  padding: 0;
}
#text-input {
  height: 100%; 
  width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  flex: 1;
}
>>> .v-input__control {
  height: 100%;
}
>>> .v-input__slot {
  height: 95%;
}
>>> .v-text-field__slot {
  height: 100%;
  padding: 0.5em;
}
</style>
