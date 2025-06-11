<script lang="ts">

  import { data as ConverterStore } from './Stores/ConverterStore.svelte';
  import Close from '../svg/close.svelte';

  interface Props { onclick?: Function, buttonDisabled?: boolean };
  let { onclick = ()=>{}, buttonDisabled=false }: Props = $props();

  function setVolume(this: HTMLVideoElement) {
    this.volume = 0.05;
    this.pause();
  }

</script>


<style>
  .video-holder {
    position: relative;
    width: 100%;
    height: 100%;
  }
  .close-btn {
    --offset: 10px;

    z-index: 1;
    right: var(--offset);
    top: var(--offset);
    position: absolute;
    transition: all 0.2s ease-out;
  }
  /* :global(.videobox:hover) .close-btn {
    opacity: 1;
  } */
</style>


{#if ConverterStore.video}
  {#key ConverterStore.video} <!-- Otherwise even though the source changes, the player does't update -->

    <div class="video-holder">
      <button class="close-btn btn btn-square btn-primary" disabled={buttonDisabled} onclick={() => {onclick()}}> <Close /> </button>
      <video class="w-full" autoplay controls disablepictureinpicture onloadstart={setVolume}>
        <source src={ConverterStore.videoURL} type={ConverterStore.video.type} />
        <track kind="captions">
      </video>
    </div>

  {/key}
{/if}