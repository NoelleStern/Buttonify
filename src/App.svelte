<!--
TODO: Theming
TODO: Confetti
TODO: Info modal
TODO: Auto download checkbox
TODO: Equalizer for video sound?
-->


<script lang="ts">

  import fsm from 'svelte-fsm';
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import * as FFmpegStore from './lib/Stores/FFmpegStore.svelte';
  import { data as ConverterStore } from './lib/Stores/ConverterStore.svelte';

  import DropOverlay from './lib/DropOverlay.svelte';
  import VideoBox from './lib/VideoBox.svelte';
  import Settings from './lib/Settings.svelte';
  import Preview from './lib/Preview.svelte';


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


<div class="view">
  
  <!-- Drop overlay -->
  <DropOverlay disabled={$converterFSM == "active" ||  $converterFSM == "loading"} />

  <!-- Main content -->
  <div class="content overflow-clip bg-base-100">
    <div class="flex flex-col items-center gap-y-[1rem]">

      <!-- Settings -->
      <div class="flex gap-2 w-full justify-center">
        <Settings />
        <button disabled={$converterFSM != "ready"} onclick={convert} class="btn btn-primary">Convert</button>
      </div>

      <!-- Video box -->
      <VideoBox {converterFSM} {removeVideo} />

      <!-- Additional -->
      {#if $converterFSM == "active" }

        <p in:fade class="pointer-events-none">Converting video</p>

        <div class="progress-bar pointer-events-none">
          <progress class="progress progress-primary w-56" value={ConverterStore.progress.current} max="100"></progress>
        </div>

      {:else if finalResult != null}
        <Preview file={finalResult} />
      {/if}

    </div>
  </div>

</div>