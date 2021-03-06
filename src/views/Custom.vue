<template>
  <div>
    <div id="custom-header">
      <div class="search">
        <input ref="input" v-model="searchValue" placeholder="search" />
      </div>

      <div
        class="back-button"
        :style="{ marginLeft: headerHorizontalMargin + 'px' }"
      >
        <router-link
          to="/"
          class="back-to-emojigun"
          @click="$ga.event('buttons', 'back-to-emojigun')"
        >
          <button>Back to EMOJIGUN</button>
        </router-link>
        <DownloadTopEmojisButton class="top-emojis">
          <button>Get top emojis</button>
        </DownloadTopEmojisButton>
      </div>

      <div
        class="header-right"
        :class="{ active: selectedEmojiCount > 0 }"
        :style="{ marginRight: headerHorizontalMargin + 'px' }"
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
        :emojiList="emojiArray"
      />

      <Loader v-if="loadingNextPage"></Loader>

      <div v-if="!loadingNextPage && Object.values(emojiList).length === 0">
        Nothing here...
      </div>
    </div>

    <selected-emoji-list ref="selectedList"></selected-emoji-list>

    <div class="backToTop" v-if="showBackToTop" @click="goBackToTop"></div>
  </div>
</template>

<script>
import CustomEmojiList from "../components/CustomEmojiList";
import SelectedEmojiList from "../components/SelectedEmojiList";
import DownloadTopEmojisButton from "../components/DownloadTopEmojisButton";
import Loader from "../components/Loader";
import { event } from "vue-analytics";

export default {
  name: "Custom",
  components: {
    CustomEmojiList,
    SelectedEmojiList,
    DownloadTopEmojisButton,
    Loader
  },
  data: () => {
    return {
      searchValue: "",
      requestedChannels: {},
      emojiList: {},
      searchTimeout: null,
      loadingNextPage: false,
      page: 1,
      totalPages: 1,
      showBackToTop: false,
      headerHorizontalMargin: 56.5
    };
  },
  computed: {
    selectedEmojiCount() {
      return Object.values(this.$store.state.selectedEmojis).length;
    },
    selectedEmojiCountWord() {
      return this.selectedEmojiCount == 1 ? "emoji" : "emojis";
    },
    emojiArray() {
      return Object.values(this.emojiList);
    }
  },
  mounted() {
    this.focusInput();
    this.loadEmojisWithFilter("");

    let appShadow = document.getElementById("appShadow");
    appShadow.classList.add("dark");

    document.addEventListener("scroll", this.onScroll);
    document.addEventListener("onresize", this.onResize);

    let app = document.getElementById("app");
    app.classList.add("custom");

    this.onScroll();
  },
  destroyed() {
    let appShadow = document.getElementById("appShadow");
    appShadow.classList.remove("dark");

    document.removeEventListener("scroll", this.onScroll);
    document.removeEventListener("resize", this.onResize);

    let app = document.getElementById("app");
    app.classList.remove("custom");
  },
  methods: {
    goBackToTop() {
      window.scrollTo({ top: 0, behavior: "smooth" });
      this.showBackToTop = false;
    },
    downloadSelected() {
      event("emojiloader", "download-selected-click");

      this.$store.commit("generationStarted");

      this.$refs.selectedList.download().then(
        function() {
          this.$refs.selectedList.clear();

          setTimeout(
            function() {
              this.$store.commit("generationEnded");
              event("emojiloader", "downloaded-selected");
            }.bind(this),
            500
          );
        }.bind(this)
      );
    },
    onResize() {
      let w = document.getElementById("custom").offsetWidth - 15;
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
        this.page < this.totalPages
      ) {
        this.loadNextPage();
      }

      this.showBackToTop = window.pageYOffset > 100;
    },
    loadNextPage() {
        this.loadingNextPage = true;

        let url = this.getUrl(this.searchValue, ++this.page);

        return this.$http.get(url).then(
          function(response) {
            event("emojiloader", "load-next-page");

            for (let emoticon of response.body.emoticons) {
              if (typeof this.emojiList[emoticon.name] === "undefined") {
                this.emojiList[emoticon.name] = {
                  name: emoticon.name,
                  urls: emoticon.urls
                };
              }
            }

            this.totalPages = response.body._pages;
            this.loadingNextPage = false;
            this.$forceCompute('emojiArray');
            this.onResize();
            this.onScroll();
            this.loadPagesUntilScreenFull();
          }.bind(this)
        );
    },
    applyNextPageURL(url) {
      if (typeof url !== "undefined") {
        this.nextPageURL = url + "&q=" + this.searchValue;
        this.hasNextPage = true;
      } else {
        this.hasNextPage = false;
        this.nextPageURL = "";
      }
    },
    getDistFromBottom() {
      var scrollPosition = window.pageYOffset;
      var windowSize = window.innerHeight;
      var bodyHeight = document.getElementById("custom").offsetHeight;

      return Math.max(bodyHeight - (scrollPosition + windowSize), 0);
    },
    getUrl(searchQuery, page) {
      let url =
        "https://api.frankerfacez.com/v1/emoticons?sort=count&per_page=100";

      if (searchQuery) {
        url = url + "&q=" + searchQuery;
      }

      if (page) {
        url = url + "&page=" + page;
      }

      return url;
    },
    loadPagesUntilScreenFull() {
      if (this.totalPages > this.page) {
        let headerHeight = 72;
        let emojiPerLine = Math.floor(window.innerWidth / 128);
        let emojiCount = Object.values(this.emojiList).length;
        let emojiHeight = headerHeight + Math.floor(emojiCount / emojiPerLine) * 128;

        if (window.innerHeight > emojiHeight) {
          this.loadNextPage();
        }
      }
    },
    loadEmojisWithFilter(filter) {
      this.emojiList = {};
      this.loadingNextPage = true;
      this.page = 1;

      let url = this.getUrl(filter, this.page);

      if (filter) {
        event("emojiloader", "search-query", filter);
      }

      return this.$http
        .get(url)
        .then(function(response) {
          for (let emoticon of response.body.emoticons) {
            if (typeof this.emojiList[emoticon.name] === "undefined") {
              this.emojiList[emoticon.name] = {
                name: emoticon.name,
                urls: emoticon.urls
              };
            }
          }

          this.$forceCompute("emojiArray");
          this.loadingNextPage = false;
          this.onScroll();
          this.onResize();
          this.totalPages = response.body._pages;
          this.loadPagesUntilScreenFull();
        })
        .catch(() => {
          this.$emit("not-found", this.channelName);
        });
    },
    focusInput() {
      this.$refs.input.focus();
    }
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
        600
      );
    }
  }
};
</script>

<style lang="scss">
@import "../styles/colors.scss";
html button {
  border-radius: 4px;
}

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

  .search {
    max-width: 500px;
    position: absolute;
    left: 50%;
    top: 50%;
    width: 100%;

    transform: translate(-50%, -50%);

    input {
      padding: 6px 12px;
      text-align: center;
      border: none;
      outline: none;
      border-radius: 8px;
      background: rgba($color-light, 0.9);
      color: $color-dark;
    }
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

  @media only screen and (max-width: 1200px) {
    .search {
      position: relative;
      top: unset;
      left: unset;
      transform: unset;
      max-height: 28px;
      order: 2;
      margin: auto;
      width: auto;
      flex-grow: 1;

      padding-left: 16px;
      padding-right: 16px;

      input {
        width: calc(100% - 24px);
      }
    }

    .back-button {
      order: 1;
    }

    .header-right {
      order: 3;
    }
  }

  @media only screen and (max-width: 700px) {
    .top-emojis {
      display: none;
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
    content: "";
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

.back-to-emojigun {
  margin-right: 12px;
}

.emojiList {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
</style>
