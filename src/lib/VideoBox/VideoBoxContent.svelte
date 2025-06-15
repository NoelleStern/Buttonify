<script lang="ts">

  import { fade } from 'svelte/transition';
  import VideoPlayer from './VideoPlayer.svelte';
  import IdleContent from './IdleContent.svelte';

  interface Props { converterFSM: any, removeVideo: Function };
  let { converterFSM, removeVideo }: Props = $props();

</script>

<div class="flex flex-col size-full justify-center items-center overflow-hidden">
  {#if $converterFSM == "loading"}
    <p> Loading FFmpeg </p>
    <span class="loading loading-spinner loading-lg"></span>
  {/if}

  {#if $converterFSM == "idle"}
    <div in:fade class="flex flex-col items-center">
      <IdleContent/>
    </div>
  {/if}

  {#if $converterFSM == "ready" || $converterFSM == "active"}
    <VideoPlayer onclick={removeVideo} />
  {/if}
</div>