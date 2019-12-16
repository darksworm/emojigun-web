<template>
  <div>
    <label>
      <input v-model="channelNames" />
    </label>

    <channel-emoji-list
      v-for="(channel, i) in requestedChannels"
      v-bind:key="i"
      :channel-name="channel"
      :title="channel + ' emotes'"
      @not-found="removeChannel(channel)"
    ></channel-emoji-list>

    <button @click="downloadSelections">download</button>
  </div>
</template>

<script>
import JSZip from "jszip";
import ChannelEmojiList from "./ChannelEmojiList";

export default {
  name: "HelloWorld",
  components: { ChannelEmojiList },
  data: () => {
    return {
      channelNames: "",
      requestedChannels: {}
    };
  },
  methods: {
    loadChannelEmojis(channelName) {
      if (typeof this.requestedChannels[channelName] === "string") {
        return;
      }
      this.requestedChannels[channelName] = channelName;
    },
    removeChannel(channelName) {
      delete this.requestedChannels[channelName];
    },
    downloadSelections() {
      let zip = new JSZip();

      Promise.all(
        this.$children.filter(x => x.isSelected()).map(x => x.getFiles())
      ).then(files => {
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
  },
  watch: {
    channelNames: function(newVal) {
      newVal
        .split(",")
        .map(x => x.trim())
        .filter(x => !!x)
        .forEach(this.loadChannelEmojis);
    }
  }
};
</script>

<style scoped lang="scss"></style>
