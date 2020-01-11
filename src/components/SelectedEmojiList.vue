<template>
  <div id="selectedEmojiList">
    <emoji-list
      :emoji-list="selectedEmojis"
      :title="'Selected emojis'"
      ref="list"
    >
      <button @click="download">download</button>
    </emoji-list>
  </div>
</template>

<script>
import EmojiList from './EmojiList';
import downloadZipOfFiles from '../mixins/downloader';

export default {
  name: 'SelectedEmojiList',
  extends: EmojiList,
  components: {EmojiList},
  computed: {
    selectedEmojis() {
      return this.$store.state.selectedEmojis;
    },
  },
  methods: {
    download() {
      this.$refs.list.getFiles().then(files => {
        downloadZipOfFiles(files);
      });
    },
  },
};
</script>

<style scoped>
#selectedEmojiList {
  z-index: 0;
  display: none;
}
</style>
