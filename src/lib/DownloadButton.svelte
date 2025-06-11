<script lang="ts">

  import * as FFmpegStore from './Stores/FFmpegStore.svelte';

  interface Props { file: File };
  let { file }: Props = $props();

  function onClick() {
    FFmpegStore.saveFile(file);
  }

</script>

<button class="btn btn-primary" onclick={onClick}>Download</button>