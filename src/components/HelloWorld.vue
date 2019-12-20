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

    <selected-emoji-list></selected-emoji-list>
  </div>
</template>

<script>
import ChannelEmojiList from "./ChannelEmojiList";
import SelectedEmojiList from "./SelectedEmojiList";
export default {
  name: "HelloWorld",
  components: { ChannelEmojiList, SelectedEmojiList },
  data: () => {
    return {
      channelNames: "",
      requestedChannels: {}
    };
  },
  mounted() {
    console.log(this.$root.$data);
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
      this.$forceUpdate();
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
