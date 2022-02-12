<template>
  <div class="text-center">
    <v-dialog v-model="dialog" width="500">
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon v-bind="attrs" v-on="on" retain-focus-on-click>
          <v-icon>mdi-help</v-icon>
        </v-btn>
      </template>
      <v-card>
        <v-card-title> How to Use </v-card-title>
        <v-card-text v-html="text"></v-card-text>
        <v-card-title>Example</v-card-title>
        <v-card-text style="white-space: pre-wrap;">{{example}}</v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="dialog = false"> Got it! </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialog: false,
      text: `<p>The chords & lyrics have to be structured by using headings. If you don't use the supported headings, your song won't fully show up or even show up at all.
        The headings need to be placed between two square brackets to be registered. </p>

        <p>Use the following headings to make the text hightlighting work: info, intro, verse, pre-chorus, chorus, bridge, outro, solo, instrumental, interlude, riff & chords</p>
        `,
        example: 
`
[chorus]
C                                    G
This is my epic song, everybody sing along`
    };
  },
};
</script>