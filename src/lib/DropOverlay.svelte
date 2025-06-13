<script lang="ts">

  import { onMount } from 'svelte';
  import { data as ConverterStore } from './Stores/ConverterStore.svelte';


  interface Props { handleDrop?: Function, disabled?: boolean };
  let { handleDrop=onDrop, disabled=false }: Props = $props();


  let time: number = 0;
  let node: HTMLElement;


  async function onDrop(event: DragEvent) {
    if (disabled) { return; }

    // Happens sometimes. Just ignore it and don't create a toast
    if (!event.dataTransfer) { return; }
    if (event.dataTransfer.files.length == 0) { return; }

    if (event.dataTransfer.files.length > 1) {
      // TODO: Toast
      return;
    }

    const file: File = event.dataTransfer.files[0];
    
    if (!file.type.startsWith('video')) {
      // TODO: Toast
      return;
    }
    
    ConverterStore.video = file;
  }


  // https://stackoverflow.com/questions/74686380/drag-drop-a-file-anywhere-on-a-page
  // https://stackoverflow.com/questions/7110353/html5-dragleave-fired-when-hovering-a-child-element/37918753
  // For this spiel to work you need a fullscreen overlay with pointer-events-none children, but not parent
  // The visibility plays a big role and i didn't perfect it yet. The best i can do is to make it fire in "true false true" pattern.
  // The same pattern appears if i change display from none to flex instead of changing the visibility. . .
  // Only filtering the events did the trick!
  onMount(() => {
    function dragenter(value: boolean) {
      // If value is different than the current one - do stuff
      if (ConverterStore.dragenter != value) {
        ConverterStore.dragenter = value;
        
        if (disabled) { return; }

        if (value) {
          node.style.animation = "0.35s ease-out 0s 1 normal forwards fadeIn";
        } else {
          node.style.visibility = "visible"; // Needed since default visibility is set to "hidden"
          node.style.animation = "0.35s ease-out 0s 1 normal forwards fadeOut";
        }
      }
    }

    document.addEventListener('drop', (e: DragEvent) => {
      e.stopPropagation();
      e.preventDefault();
      
      dragenter(false);
      handleDrop(e);
    });
    document.addEventListener('dragleave', (e: DragEvent) => {
      e.stopPropagation();
      e.preventDefault();

      if ((new Date).getTime() - time > 5) {
        dragenter(false);
      }
    });
    document.addEventListener('dragend', (e: DragEvent) => {
      e.stopPropagation();
      e.preventDefault();

      dragenter(false);
    });
    document.addEventListener('dragover', (e: DragEvent) => {
      e.stopPropagation();
      e.preventDefault();
      
      dragenter(true);
    });
    document.addEventListener('dragenter', (e: DragEvent) => {
      e.stopPropagation();
      e.preventDefault();

      time = (new Date).getTime();
    });
  });

</script>


<style>
  @keyframes fontChange {
    0% {
      font-family: "Space Grotesk", serif;
    }
    25% {
      font-family: "Caveat", serif;
    }
    50% {
      font-family: "Roboto Condensed", serif;
    }
    75% {
      font-family: "VT323", serif;
    }
    100% {
      font-family: "Space Grotesk", serif;
    }
  }

  @keyframes -global-fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
      visibility: visible;
    }
  }
  @keyframes -global-fadeOut {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
      visibility: hidden;
    }
  }

  .drop-overlay {
    display: flex;
    visibility: hidden;
    justify-content: center;
    align-items: center;
    position: fixed;
    z-index: 9999;
    height: 100vh;
    width: 100vw;
  }
  .drop-overlay .bck {
    opacity: 1;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.2);
    transition: opacity 0.5s ease-in-out;
    font-size: 100%;
  }
  .drop-overlay .infobox {
    --size: 70vh;

    width: var(--size);
    max-width: 90%;
    aspect-ratio: 1;
    font-size: 3.5vw;
    border-radius: 0.5rem;

    animation-name: fontChange;
    animation-duration: 2s;
    animation-iteration-count: infinite;
    animation-direction: forwards;
  }
  
</style>


<div class="drop-overlay" bind:this={node}>
  <div class="pointer-events-none w-full h-full">

    <div class="bck border-5 border-dashed flex justify-center items-center">
      <div class="infobox bg-warning flex justify-center items-center">
        And drop!
      </div>
    </div>
      
  </div>
</div>