<template>
  <div>
    <div id="custom-header">
      <input ref="input" v-model="searchValue" placeholder="search" />

      <router-link to="/" class="back-button">
        <button class="back-button">Back</button>
      </router-link>

      <template v-if="selectedEmojiCount">
        <div class="selectedEmojiCount" v-if="selectedEmojiCount">
          {{ selectedEmojiCount }} {{ selectedEmojiCountWord }} selected
        </div>

        <button class="downloadSelected" @click="downloadSelected">
          Download selected
        </button>
      </template>
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
    downloadSelected() {
      this.$refs.selectedList.download();
    },
    onScroll() {
      if (
        this.getDistFromBottom() < 500 &&
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

  margin-top: 72px;
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

  .back-button {
    position: fixed;
    bottom: 20px;
    left: 20px;
  }

  .spinner {
    margin-top: 50px;
  }
}

#custom-header {
  z-index: 1;
  position: fixed;
  top: 0;
  left: 0;

  width: 100%;
  height: 72px;

  background: rgba(0, 0, 0, 1);

  input {
    max-width: 500px;
  }

  * {
    display: inline-block;
    margin: 10px 15px;
  }
}
</style>
