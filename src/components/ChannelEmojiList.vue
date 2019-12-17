<script>
import EmojiList from "./EmojiList";
import config from "../store/config";

export default {
  name: "ChannelEmojiList",
  extends: EmojiList,
  props: {
    channelName: String
  },
  methods: {
    loadEmojis() {
      return this.$http
        .get(config.FFZ_ROOM_API_ENDPOINT + this.channelName)
        .then(function(response) {
          return Object.values(response.body.sets)
            .map(x => x.emoticons)
            .flat()
            .map(x => {
              return { name: x.name, urls: x.urls };
            });
        })
        .catch(() => {
          this.$emit("not-found", this.channelName);
        });
    }
  }
};
</script>

<style scoped>
.emoji {
  display: inline-block;
}
</style>
