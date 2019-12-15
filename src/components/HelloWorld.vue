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
      this.$children.forEach(x => x.download());
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
