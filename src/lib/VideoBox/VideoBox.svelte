<script lang="ts">

  import { data as ConverterStore, defaultAspect } from '../Stores/ConverterStore.svelte';
    import VideoBoxContent from './VideoBoxContent.svelte';

  interface Props { converterFSM: any, removeVideo: Function };
  let { converterFSM, removeVideo }: Props = $props();

  let padding: number = 40;
  let containerWidth: number = $state(0); // No need to account for padding
  let containerHeight: number = $state(0); // Yes need to account for padding

  // Well, this was quite a ride to set up! But i think the technical 
  // challenge of creating a responsive aspect ratio container has been overcome!
  function calculateMaxHeight(): string {
    return `${(containerWidth/defaultAspect) + padding*2}px`;
  }
  function calculateVideoBoxHeight(): string {
    return `${containerHeight - padding*2}px`;
  }
  function calculateAspectRatio(): string {
    return ConverterStore.video ? `${ConverterStore.aspect}` : `calc(${defaultAspect})`;
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
  .video-box {
    position: relative;
    transition: aspect-ratio var(--trans-time) var(--trans-easing);
  }
  /* Border */
  .video-box::after {
    content: '';

    top: 0;
    width: 100%;
    height: 100%;
    position: absolute;
    pointer-events: none;

    outline: 10px dashed hsl(222, 10%, 40%);
    outline-offset: calc(var(--padding) - var(--border-size));
  }
</style>


<!-- Video preview, smooth as heck!!! -->
<div class="bounding-container" style="--padding: {padding}px" style:max-height={calculateMaxHeight()} bind:clientHeight={containerHeight}> <!-- Contains the entire thing -->
  <div class="flex justify-center w-full" bind:clientWidth={containerWidth}> <!-- Works as a size reference point, respects parent's padding -->
    <div class="video-box" style:height={calculateVideoBoxHeight()} style:aspect-ratio={calculateAspectRatio()}> <!-- Uses aspect ratio to change size smoothly -->
      
        <VideoBoxContent {converterFSM} {removeVideo} />      

    </div>
  </div>
</div>