<template>
  <div>
    <div id="custom-header">
      <input ref="input" v-model="searchValue" placeholder="search" />

      <router-link to="/" class="back-button">
        <button class="back-button">Back</button>
      </router-link>

      <div class="header-right" :class="{active: selectedEmojiCount > 0}">
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

    <div id="generatingOverlay" v-if="generating">
      <div>
        <div class="text">Generating zip...</div>
        <b-spinner type="grow" class="spinner"></b-spinner>
      </div>
    </div>
  </div>
</template>

<script>
import CustomEmojiList from '../components/CustomEmojiList';
import SelectedEmojiList from '../components/SelectedEmojiList';

export default {
  name: 'Custom',
  components: {CustomEmojiList, SelectedEmojiList},
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
      generating: false,
      generated: true,
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

    let app = document.getElementById('app');
    app.classList.add('custom');
  },
  destroyed() {
    let appShadow = document.getElementById('appShadow');
    appShadow.classList.remove('dark');

    document.removeEventListener('scroll', this.onScroll);

    let app = document.getElementById('app');
    app.classList.remove('custom');
  },
  methods: {
    goBackToTop() {
      window.scrollTo(0, 0);
      this.showBackToTop = false;
    },
    downloadSelected() {
      this.generating = true;

      this.$refs.selectedList.download().then(
        function() {
          this.$refs.selectedList.clear();

          setTimeout(
            function() {
              this.generating = false;
              this.generated = true;
            }.bind(this),
            500,
          );
        }.bind(this),
      );
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

            this.nextPageURL = response.body._links.next;
            this.loadingNextPage = false;

            this.$forceUpdate();
          }.bind(this),
        );
      }

      this.showBackToTop = window.pageYOffset > 100;
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

          this.nextPageURL = response.body._links.next;
          this.loadingNextPage = false;
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

  .spinner {
    margin-top: 50px;
  }
}

#custom-header {
  position: relative;

  width: 100%;
  height: 72px;

  background: transparent;

  input {
    max-width: 500px;
    text-align: center;
    position: absolute;
    left: 50%;
    top: 50%;

    transform: translate(-50%, -50%);
  }

  .back-button {
    float: left;
  }

  .header-right {
    float: right;
  }
}

.backToTop {
  position: fixed;
  right: 20px;
  bottom: 20px;
  height: 60px;
  width: 60px;
  background: white;
  border-radius: 60px;
  z-index: 2;

  &:after {
    content: '';
    width: 0;
    height: 0;
    border-left: 25px solid transparent;
    border-right: 25px solid transparent;
    border-bottom: 25px solid #0f0f0f;
    position: fixed;
    right: 24px;
    bottom: 40px;
  }

  &:hover {
    cursor: pointer;
  }
}

#generatingOverlay {
  position: fixed;
  width: 100%;
  height: 100%;

  font-size: 36px;
  font-weight: bold;

  &:before {
    position: fixed;
    top: 0;
    left: 0;

    width: 100%;
    height: 100%;
    content: '';
    background: rgba(0, 0, 0, 0.8);
  }

  > div {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
