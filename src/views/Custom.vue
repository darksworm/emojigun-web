<template>
  <div id="custom">
    <input
      ref="input"
      @blur="focusInput()"
      v-model="channelNames"
      placeholder="Enter twitch channel or emoji names"
    />

    <channel-emoji-list
      v-for="(channel, i) in requestedChannels"
      v-bind:key="i"
      :channel-name="channel"
      :title="channel + ' emotes'"
      @not-found="removeChannel(channel)"
    ></channel-emoji-list>
    <router-link to="/">
      <button class="back-button">Back</button>
    </router-link>
  </div>
</template>

<script>
import ChannelEmojiList from '../components/ChannelEmojiList';
export default {
  name: 'Custom',
  components: {ChannelEmojiList},
  data: () => {
    return {
      channelNames: '',
      requestedChannels: {},
    };
  },
  mounted() {
    this.focusInput();
  },
  methods: {
    loadChannelEmojis(channelName) {
      if (typeof this.requestedChannels[channelName] === 'string') {
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
    },
  },
  watch: {
    channelNames: function(newVal) {
      newVal
        .split(',')
        .map(x => x.trim())
        .filter(x => !!x)
        .forEach(this.loadChannelEmojis);
    },
  },
};
</script>

<style lang="scss">
@import '../styles/colors.scss';

#custom {
  width: 100%;
  text-align: center;

  input {
    background: transparent;
    border: none;
    outline: none;

    color: $color-light;
    font-size: 30px;
    font-size: 3.5vw;
    display: block;
    margin: 0 auto;

    width: auto;
  }
}
</style>
