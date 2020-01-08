<template>
  <div id="custom">
    <input
      ref="input"
      @blur="focusInput()"
      v-model="searchValue"
      placeholder="search"
    />

    <EmojiList :emojiList="emojiList" />

    <router-link to="/">
      <button class="back-button">Back</button>
    </router-link>
  </div>
</template>

<script>
import EmojiList from '../components/EmojiList';

export default {
  name: 'Custom',
  components: {EmojiList},
  data: () => {
    return {
      searchValue: '',
      requestedChannels: {},
      emojiList: [],
    };
  },
  mounted() {
    this.focusInput();
    this.loadEmojisWithFilter('');
  },
  methods: {
    loadEmojisWithFilter(filter) {
      let url =
        'https://api.frankerfacez.com/v1/emoticons?sort=count&per_page=100';
      if (filter) {
        url = url + '&q=' + filter;
      }

      return this.$http
        .get(url)
        .then(function(response) {
          this.emojiList = response.body.emoticons.map(x => {
            return {name: x.name, urls: x.urls};
          });
        })
        .catch(() => {
          this.$emit('not-found', this.channelName);
        });
    },
    focusInput() {
      this.$refs.input.focus();
    },
  },
  watch: {
    searchValue: function(newVal) {
      this.loadEmojisWithFilter(newVal);
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
