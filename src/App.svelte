<!--
TODO: PWA
TODO: Theming
TODO: Confetti
TODO: Info modal
TODO: Auto download checkbox
TODO: Drag and drop info toasts
TODO: Equalizer for video sound?
-->


<script lang="ts">

  import fsm from 'svelte-fsm';
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import * as FFmpegStore from './lib/Stores/FFmpegStore.svelte';
  import { data as ConverterStore } from './lib/Stores/ConverterStore.svelte';

  import DownloadButton from './lib/DownloadButton.svelte';
  import DropOverlay from './lib/DropOverlay.svelte';
  import VideoBox from './lib/VideoBox.svelte';
  import Settings from './lib/Settings.svelte';
  import Preview from './lib/Preview.svelte';
  import Footer from './lib/Footer.svelte';
  import Header from './lib/Header.svelte';


  let finalResult: File|null = $state(null);

  const converterFSM = fsm('loading', {
    loading: {
      ffmpegLoaded() { return 'idle'; }
    },
    idle: {
      videoUploaded() { return 'ready'; },
    },
    ready: {
      _enter({}) { ConverterStore.progress.target = 0; },
      started() { return 'active'; },
      videoRemoved() {  return 'idle'; },
    },
    active: {
      finished() { return 'ready'; },
      aborted() { return 'ready'; },
    }
  });


  ConverterStore.onVideoChange = function(file: File|null) {
    if (file) { converterFSM.videoUploaded(); }
    else { converterFSM.videoRemoved(); }
    finalResult = null;
  }

  async function convert(): Promise<void> {
    if (!ConverterStore.video) { return; }
    if ($converterFSM == 'active') { return; }

    converterFSM.started();
    finalResult = await FFmpegStore.convertVideo(ConverterStore.video);
    converterFSM.finished();
  }

  function removeVideo() {
    if (!ConverterStore.video) { return; }
    
    if ($converterFSM = 'active') { abort(); }
    ConverterStore.removeVideo();
  }

  function abort(): void {
    if ($converterFSM != 'active') { return; }
    
    FFmpegStore.abort();
    converterFSM.aborted();
  }

  onMount(async () => {
    await FFmpegStore.init(ConverterStore.progress);
    converterFSM.ffmpegLoaded();
  });
  
</script>


<style>
  .main-container {
    height: 100%;
    width: var(--content-width);
    max-width: 100vw;

    overflow-y: scroll;
    scroll-behavior: smooth;
    scroll-snap-type: y mandatory;
  }
  .main-container > div {
    scroll-snap-align: start;
    scroll-snap-stop: always;
      scroll-padding: 15vh;
  }
  .main-container > div:first-child {
    border-top-left-radius: var(--radius-box);
    border-top-right-radius: var(--radius-box);
  }
  .main-container > div:last-child {
    border-bottom-right-radius: var(--radius-box);
    border-bottom-left-radius: var(--radius-box);
  }
</style>


<div class="size-full grid justify-center">
  
  <!-- Drop overlay -->
  <DropOverlay disabled={$converterFSM == "active" ||  $converterFSM == "loading"} />

  <!-- Main container -->
  <div class="main-container no-scrollbar">

    <!-- Header -->
    <div class="w-full overflow-clip">
      <Header />
    </div>
    
    <!-- Down part container -->
    <div class="flex flex-col h-[100vh] overflow-hidden">

      <!-- Main content -->
      <div class="flex flex-col size-full bg-base-100 px-(--content-padding-x) py-(--content-padding-y) items-center overflow-hidden gap-y-(--gap)">

        <!-- Settings -->
        <div class="flex gap-2 w-full justify-center">
          <Settings />
          <button disabled={$converterFSM != "ready"} onclick={convert} class="btn btn-primary">Convert</button>
        </div>

        <!-- Video box -->
        <VideoBox {converterFSM} {removeVideo} />

        <!-- Additional -->
        {#if $converterFSM == "active" }
          <!-- Progress bar  -->
          <div class="flex flex-col items-center gap-1">
            <p in:fade class="pointer-events-none">Converting video</p>
            <div class="progress-bar pointer-events-none">
              <progress class="progress progress-primary w-56" value={ConverterStore.progress.current} max="100"></progress>
            </div>
          </div>
        {:else if finalResult != null}
          <!-- Preview + download button  -->
          <Preview file={finalResult} big={true} />
          <DownloadButton file={finalResult} />
        {/if}

      </div>

      <!-- Footer -->
      <div class="w-full p-3 bg-primary">
        <Footer/>
      </div>
      
    </div>

  </div>

</div>