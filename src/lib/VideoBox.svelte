<script lang="ts">

  import { fade } from 'svelte/transition';
  import { defaultAspect } from './Stores/ConverterStore.svelte';
  import { data as ConverterStore } from './Stores/ConverterStore.svelte';
  import VideoPlayer from './VideoPlayer.svelte';

  interface Props { converterFSM: any, removeVideo: Function };
  let { converterFSM, removeVideo }: Props = $props();
  
</script>


<style>
  /* https://stackoverflow.com/questions/5445491/height-equal-to-dynamic-width-css-fluid-layout */
  .bounding-container {
    --padding: 40px;
    --border-size: 10px;
    --trans-time: 0.5s;
    --trans-easing: ease-in-out;

    padding: var(--padding);
    width: 100%;
  }
  .height-dummy {
    width: 100%;
    transition: margin-top var(--trans-time) var(--trans-easing);
  }
  .videobox-container {
    position: absolute;
    height: 100%; /* Since it's aspect ratio based */
    
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    transition: aspect-ratio var(--trans-time) var(--trans-easing);
  }
  /* Border */
  .videobox-container::after {
    content: '';

    top: 0;
    width: 100%;
    height: 100%;
    position: absolute;
    pointer-events: none;

    outline: 10px dashed hsl(222, 10%, 40%);
    outline-offset: calc(var(--padding) - var(--border-size));
  }
  .videobox {
    width: 100%;
    height: 100%;

    display: flex;
    flex-direction: column;
    overflow: hidden;

    justify-content: center;
    align-items: center;
  }
</style>


<!-- Video preview, smooth as heck!!! -->
<div class="bounding-container"> <!-- Contains the entire thing -->
  <div class="relative flex w-full"> <!-- Works as a size reference point, respects parent's padding -->

    <!-- Shrinks the parent container vertically -->
    <!-- Is needed because aspect-ratio-based containers take height as a reference point, changes smoothly -->
    <div class="height-dummy" style:margin-top={(ConverterStore.aspect > defaultAspect) ?  `calc(1/${ConverterStore.aspect}*100%)` : `calc(1/${defaultAspect}*100%)`}></div>

    <!-- Shrinks horizontally on it's own, uses aspect ratio to change size smoothly -->
    <div class="videobox-container" style:aspect-ratio={ConverterStore.video ? `${ConverterStore.aspect}` : `calc(${defaultAspect})`}>
      <div class="videobox"> <!-- Is needed to have overflow-hidden without affecting the outline -->
      
        {#if $converterFSM == "loading"}
          <p> Loading FFmpeg </p>
          <span class="loading loading-spinner loading-lg"></span>
        {/if}

        {#if $converterFSM == "idle"}
          <p in:fade class="pointer-events-none"> Drag your video here! </p>
        {/if}

        {#if $converterFSM == "ready" || $converterFSM == "active"}
          <VideoPlayer onclick={removeVideo} />
        {/if}

      </div>
    </div>

  </div>
</div>