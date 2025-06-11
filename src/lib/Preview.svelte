<script lang="ts">

  import DownloadButton from './DownloadButton.svelte';

  interface Props { file: File };
  let { file }: Props = $props();

</script>


<style>
  .preview {
    --multiplier: 4;
    max-width: 80%;
    width: calc(88px * var(--multiplier));
    image-rendering: pixelated;
  }
</style>


{#if file.type == "image/gif"}
  <img src={URL.createObjectURL(file)} class="preview" alt="result" />
{:else if file.type == "video/webm"}
  <video class="preview" autoplay loop muted playsinline>
    <source src={URL.createObjectURL(file)} type="video/webm">
  </video>
{/if}

<DownloadButton {file} />