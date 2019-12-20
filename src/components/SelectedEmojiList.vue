<template>
  <emoji-list
    :emoji-list="selectedEmojis"
    :title="'Selected emojis'"
    ref="list"
  >
    <button @click="download">download</button>
  </emoji-list>
</template>

<script>
import JSZip from "jszip";
import EmojiList from "./EmojiList";

export default {
  name: "SelectedEmojiList",
  extends: EmojiList,
  components: { EmojiList },
  computed: {
    selectedEmojis() {
      return this.$store.state.selectedEmojis;
    }
  },
  methods: {
    download() {
      let zip = new JSZip();

      this.$refs.list.getFiles().then(files => {
        files.flat().map(file => zip.file(file.name, file.blob));

        zip.generateAsync({ type: "blob" }).then(
          blob => {
            let tag = document.createElement("a");
            let urlCreator = window.URL || window.webkitURL;

            tag.href = urlCreator.createObjectURL(blob);
            tag.download = "emojis.zip";

            document.body.appendChild(tag);
            tag.click();
            document.body.removeChild(tag);
          },
          function(err) {
            console.log(err);
          }
        );
      });
    }
  }
};
</script>

<style scoped></style>
