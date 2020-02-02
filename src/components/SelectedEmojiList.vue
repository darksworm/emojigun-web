<template>
  <div id="selectedEmojiList">
    <emoji-list
      :emoji-list="Object.values(selectedEmojis)"
      :title="'Selected emojis'"
      ref="list"
    >
      <button @click="download">download</button>
    </emoji-list>
  </div>
</template>

<script>
import EmojiList from "./EmojiList";
import downloadZipOfFiles from "../mixins/downloader";

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
      return this.$refs.list.getFiles().then(files => {
        return downloadZipOfFiles(files);
      });
    },
    clear() {
      this.$store.commit("clearSelection");
    }
  }
};
</script>

<style scoped>
#selectedEmojiList {
  z-index: 0;
  display: none;
}
</style>
