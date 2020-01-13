<template>
  <div id="custom">
    <input ref="input" v-model="searchValue" placeholder="search" />

    <CustomEmojiList class="emojiList" :emojiList="Object.values(emojiList)" />

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
      nextPageURL: '',
      requestedChannels: {},
      emojiList: {},
      searchTimeout: null,
      loadingNextPage: false,
    };
  },
  mounted() {
    this.focusInput();
    this.loadEmojisWithFilter('');

    let appShadow = document.getElementById('appShadow');
    appShadow.classList.add('dark');

    document.addEventListener('scroll', this.onScroll);
  },
  destroyed() {
    let appShadow = document.getElementById('appShadow');
    appShadow.classList.remove('dark');

    document.removeEventListener('scroll', this.onScroll);
  },
  methods: {
    onScroll() {
      if (
        this.getDistFromBottom() < 400 &&
        !this.loadingNextPage &&
        this.nextPageURL
      ) {
        this.loadingNextPage = true;

        this.$http.get(this.nextPageURL).then(
          function(response) {
            for (let emoticon of response.body.emoticons) {
              if (typeof this.emojiList[emoticon.name] === 'undefined') {
                this.emojiList[emoticon.name] = {
                  name: emoticon.name,
                  urls: emoticon.urls,
                };
              }
            }

            this.nextPageURL = response.body._links.next;
            this.loadingNextPage = false;

            this.$forceUpdate();
          }.bind(this),
        );
      }
    },
    getDistFromBottom() {
      var scrollPosition = window.pageYOffset;
      var windowSize = window.innerHeight;
      var bodyHeight = document.getElementById('custom').offsetHeight;

      return Math.max(bodyHeight - (scrollPosition + windowSize), 0);
    },
    loadEmojisWithFilter(filter) {
      let url =
        'https://api.frankerfacez.com/v1/emoticons?sort=count&per_page=100';
      if (filter) {
        url = url + '&q=' + filter;
      }

      return this.$http
        .get(url)
        .then(function(response) {
          for (let emoticon of response.body.emoticons) {
            if (typeof this.emojiList[emoticon.name] === 'undefined') {
              this.emojiList[emoticon.name] = {
                name: emoticon.name,
                urls: emoticon.urls,
              };
            }
          }

          this.nextPageURL = response.body._links.next;
          this.$forceUpdate();
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
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout);
      }
      this.searchTimeout = setTimeout(
        function() {
          this.loadEmojisWithFilter(newVal);
        }.bind(this),
        600,
      );
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
