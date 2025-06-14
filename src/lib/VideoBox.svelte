<script lang="ts">

  import { fade } from 'svelte/transition';
  import { data as ConverterStore, defaultAspect } from './Stores/ConverterStore.svelte';
  import VideoPlayer from './VideoPlayer.svelte';
  import IdleContent from './IdleContent.svelte';

  interface Props { converterFSM: any, removeVideo: Function };
  let { converterFSM, removeVideo }: Props = $props();

  let padding: number = 40;
  let containerWidth: number = $state(0);
  let containerHeight: number = $state(0);
  let referenceHeight: number = $state(0);

  $effect(() => {
    console.log(calculateAspectHeight());
  });

  // Well, this was quite a ride to set up! But i think the technical 
  // challenge of creating a responsive aspect ratio container has been overcome!
  // Though, i have a distinct feeling it's quite possible to make it way simpler.
  function calculateAspectHeight() {
    return (containerWidth-padding*2) / defaultAspect;
  }
  function isSmallerThanAvailable() {
    return referenceHeight < calculateAspectHeight();
  }
  function isOverflowing(): boolean {
    if (containerHeight<padding) { return false; }
    return referenceHeight > containerHeight-padding*2;
  }
  function calculateTopMargin(): string {
    if (isOverflowing()) { return `${containerHeight-padding*2+1}px`; }
    return (ConverterStore.aspect > defaultAspect) ?  `calc(1/${ConverterStore.aspect}*100%)` : `calc(1/${defaultAspect}*100%)`
  }
  function calculateAspectRatio(): string {
    return ConverterStore.video ? `${ConverterStore.aspect}` : `calc(${defaultAspect})`;
  }
  function calculateTransition(): string {
    return (isOverflowing() || isSmallerThanAvailable()) ? "" : "margin-top var(--trans-time) var(--trans-easing)";
  }
  function calculateMaxHeight(): string {
    return `${calculateAspectHeight() + padding*2}px`;
  }

</script>


<style>
  /* https://stackoverflow.com/questions/5445491/height-equal-to-dynamic-width-css-fluid-layout */
  .bounding-container {
    --border-size: 10px;
    --trans-time: 0.5s;
    --trans-easing: ease-in-out;

    padding: var(--padding);
    width: 100%;
    height: 100%;
    min-height: 0px;
  }
  .height-dummy {
    width: 100%;
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
<div class="bounding-container" style="--padding: {padding}px" style:max-height={calculateMaxHeight()} bind:clientHeight={containerHeight} bind:clientWidth={containerWidth}> <!-- Contains the entire thing -->
  <div class="relative flex w-full" bind:clientHeight={referenceHeight}> <!-- Works as a size reference point, respects parent's padding -->

    <!-- Shrinks the parent container vertically -->
    <!-- Is needed because aspect-ratio-based containers take height as a reference point, changes smoothly -->
    <div class="height-dummy" style:transition={calculateTransition()} style:margin-top={calculateTopMargin()}></div>

    <!-- Shrinks horizontally on it's own, uses aspect ratio to change size smoothly -->
    <div class="videobox-container" style:aspect-ratio={calculateAspectRatio()}>
      <div class="videobox"> <!-- Is needed to have overflow-hidden without affecting the outline -->
      
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
    </div>

  </div>
</div>