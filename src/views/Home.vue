<template>
  <div>
    <label>
      <input
        ref="input"
        @blur="focusInput()"
        v-model="channelNames"
        placeholder="Enter twitch channel or emoji names"
      />
    </label>

    <channel-emoji-list
      v-for="(channel, i) in requestedChannels"
      v-bind:key="i"
      :channel-name="channel"
      :title="channel + ' emotes'"
      @not-found="removeChannel(channel)"
    ></channel-emoji-list>
  </div>
</template>

<script>
import ChannelEmojiList from "../components/ChannelEmojiList";
export default {
  name: "Home",
  components: { ChannelEmojiList },
  data: () => {
    return {
      channelNames: "",
      requestedChannels: {}
    };
  },
  mounted() {
    this.focusInput();
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
    },
    focusInput() {
      this.$refs.input.focus();
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

<style lang="scss">
@import "../styles/colors.scss";

input {
  background: transparent;
  border: none;
  outline: none;

  color: $color-light;
}
</style>
