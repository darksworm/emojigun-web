<template>
  <div id="custom">
    <input
      ref="input"
      @blur="focusInput()"
      v-model="searchValue"
      placeholder="search"
    />

    <CustomEmojiList class="emojiList" :emojiList="emojiList" />

    <router-link to="/">
      <button class="back-button">Back</button>
    </router-link>
  </div>
</template>

<script>
import CustomEmojiList from '../components/CustomEmojiList';

export default {
  name: 'Custom',
  components: {CustomEmojiList},
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

    let appShadow = document.getElementById('appShadow');
    appShadow.classList.add('dark');
  },
  destroyed() {
    let appShadow = document.getElementById('appShadow');
    appShadow.classList.remove('dark');
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
  z-index: 0;
  width: 100%;

  text-align: center;
  align-self: start;

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

    text-align: center;
  }

}
</style>
