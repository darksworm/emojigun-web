<script>
import EmojiList from './EmojiList';

export default {
  name: 'CustomEmojiList',
  extends: EmojiList,
};
</script>

<style lang="scss">
@import '../styles/colors.scss';

$emoji-size: 128px;

.emojiList > .title {
  display: none;
}

.emojiContainer {
  min-width: $emoji-size;
  min-height: $emoji-size;
  display: inline-flex !important;

  .emoji {
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;

    button {
      display: none;

      position: absolute;
      top: 0;
      left: 0;

      width: 100%;
      height: 100%;

      opacity: 0;
    }

    > div {
      margin: auto;
    }

    img {
      margin-top: -6px;
    }

    .title {
      position: absolute;
      bottom: 6px;

      left: 50%;
      transform: translateX(-50%);

      max-width: calc(#{$emoji-size} - 6px);

      text-overflow: ellipsis;
      overflow: hidden;
      word-break: keep-all;
    }

    &:hover {
      background: rgba($color-light, 0.3);

      &.selected {
        background: rgba($color-light, 0.6);
      }

      button {
        display: block;
      }
    }

    &.selected {
      background: rgba($color-light, 0.4);
    }
  }
}
</style>
