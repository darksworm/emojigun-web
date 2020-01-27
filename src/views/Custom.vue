<template>
  <div>
    <div id="custom-header">
      <input ref="input" v-model="searchValue" placeholder="search" />

      <div
        class="back-button"
        :style="{marginLeft: headerHorizontalMargin + 'px'}"
      >
        <DownloadTopEmojisButton>
          <button>Download top emojis</button>
        </DownloadTopEmojisButton>
      </div>

      <div
        class="header-right"
        :class="{active: selectedEmojiCount > 0}"
        :style="{marginRight: headerHorizontalMargin + 'px'}"
      >
        <div class="selectedEmojiCount">
          {{ selectedEmojiCount }} {{ selectedEmojiCountWord }} selected
        </div>

        <button
          class="downloadSelected"
          @click="downloadSelected"
          :disabled="selectedEmojiCount <= 0"
        >
          Download zip
        </button>
      </div>
    </div>

    <div id="custom">
      <CustomEmojiList
        class="emojiList"
        :emojiList="Object.values(emojiList)"
      />

      <b-spinner
        v-if="loadingNextPage"
        type="grow"
        class="spinner"
        label="Loading..."
      ></b-spinner>

      <div v-if="!loadingNextPage && Object.values(emojiList).length === 0">
        Nothing here...
      </div>
    </div>

    <selected-emoji-list ref="selectedList"></selected-emoji-list>

    <div class="backToTop" v-if="showBackToTop" @click="goBackToTop"></div>
  </div>
</template>

<script>
import CustomEmojiList from '../components/CustomEmojiList';
import SelectedEmojiList from '../components/SelectedEmojiList';
import DownloadTopEmojisButton from '../components/DownloadTopEmojisButton';

export default {
  name: 'Custom',
  components: {CustomEmojiList, SelectedEmojiList, DownloadTopEmojisButton},
  data: () => {
    return {
      searchValue: '',
      nextPageURL: '',
      requestedChannels: {},
      emojiList: {},
      searchTimeout: null,
      loadingNextPage: false,
      hasNextPage: false,
      showBackToTop: false,
      headerHorizontalMargin: 56.5,
    };
  },
  computed: {
    selectedEmojiCount() {
      return Object.values(this.$store.state.selectedEmojis).length;
    },
    selectedEmojiCountWord() {
      return this.selectedEmojiCount == 1 ? 'emoji' : 'emojis';
    },
  },
  mounted() {
    this.focusInput();
    this.loadEmojisWithFilter('');

    let appShadow = document.getElementById('appShadow');
    appShadow.classList.add('dark');

    document.addEventListener('scroll', this.onScroll);
    document.addEventListener('onresize', this.onResize);

    let app = document.getElementById('app');
    app.classList.add('custom');

    this.onScroll();
  },
  destroyed() {
    let appShadow = document.getElementById('appShadow');
    appShadow.classList.remove('dark');

    document.removeEventListener('scroll', this.onScroll);
    document.removeEventListener('resize', this.onResize);

    let app = document.getElementById('app');
    app.classList.remove('custom');
  },
  methods: {
    goBackToTop() {
      window.scrollTo({top: 0, behavior: 'smooth'});
      this.showBackToTop = false;
    },
    downloadSelected() {
      this.$store.commit('generationStarted');

      this.$refs.selectedList.download().then(
        function() {
          this.$refs.selectedList.clear();

          setTimeout(
            function() {
              this.$store.commit('generationEnded');
            }.bind(this),
            500,
          );
        }.bind(this),
      );
    },
    onResize() {
      let w = document.getElementById('custom').offsetWidth - 15;
      let padding = (w - Math.floor(w / 128) * 128) / 2;

      if (padding == 0) {
        this.headerHorizontalMargin = 20;
      } else {
        this.headerHorizontalMargin = padding;
      }
    },
    onScroll() {
      if (
        this.getDistFromBottom() < 500 &&
        !this.loadingNextPage &&
        this.hasNextPage
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

            this.applyNextPageURL(response.body._links.next);
            this.loadingNextPage = false;

            this.$forceUpdate();
          }.bind(this),
        );
      }

      this.showBackToTop = window.pageYOffset > 100;
    },
    applyNextPageURL(url) {
      if (typeof url !== 'undefined') {
        this.nextPageURL = url + '&q=' + this.searchValue;
        this.hasNextPage = true;
      } else {
        this.hasNextPage = false;
        this.nextPageURL = '';
      }
    },
    getDistFromBottom() {
      var scrollPosition = window.pageYOffset;
      var windowSize = window.innerHeight;
      var bodyHeight = document.getElementById('custom').offsetHeight;

      return Math.max(bodyHeight - (scrollPosition + windowSize), 0);
    },
    loadEmojisWithFilter(filter) {
      this.emojiList = [];
      this.loadingNextPage = true;

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

          this.applyNextPageURL(response.body._links.next);
          this.loadingNextPage = false;
          this.onResize();
          this.onScroll();
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
      this.showBackToTop = false;

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
  position: relative;

  padding-bottom: 50px;

  text-align: center;
  align-self: start;

  .spinner {
    margin-top: 50px;
  }

  color: rgba($color-light, 0.8);
}

#custom-header {
  position: relative;

  width: 100%;
  height: 72px;

  display: flex;

  input {
    max-width: 500px;
    text-align: center;
    position: absolute;
    left: 50%;
    top: 50%;

    transform: translate(-50%, -50%);

    border: none;
    outline: none;
    border-radius: 8px;

    padding: 6px 12px;

    background: rgba($color-light, 0.9);
    color: $color-dark;
  }

  .back-button {
    margin-top: auto;
    margin-bottom: auto;
    margin-left: 20px;
  }

  .header-right {
    margin-left: auto;
    margin-right: 20px;
    margin-top: auto;
    margin-bottom: auto;

    .downloadSelected {
      &:disabled {
        background: darken(grey, 5%);

        &:hover {
          cursor: unset;
          background: darken(grey, 5%);
        }
      }
    }
  }
}

.backToTop {
  opacity: 0.8;
  position: fixed;
  right: 20px;
  bottom: 20px;
  height: 60px;
  width: 60px;
  background: $color-light;
  border-radius: 60px;
  z-index: 2;

  &:after {
    content: '';
    width: 0;
    height: 0;
    border-left: 25px solid transparent;
    border-right: 25px solid transparent;
    border-bottom: 25px solid $color-dark;
    position: fixed;
    right: 24px;
    bottom: 40px;
  }

  &:hover {
    cursor: pointer;
  }
}
</style>
