<script lang="ts">

  import { ALL_EXTENSIONS, extension, framerate, maxColors, framerateLimit, colorLimit } from './Stores/SettingsStore.svelte';
  import NumberSelect from './NumberSelect.svelte';
  
</script>


<!-- Filetype select -->
<label class="floating-label flex-1 max-w-[8.5rem] select-none">
  <span class="label">Extension</span>
  <select bind:value={$extension.current} class="select select-bordered focus:outline-none w-full">

    <!-- Should be type safe -->
    {#each ALL_EXTENSIONS as extension}
      <option value={extension}>{extension.toUpperCase()}</option>
    {/each}

  </select>
</label>

<!-- Framerate select -->
<NumberSelect bind:value={$framerate.current} label={"Framerate"} range={framerateLimit} />

<!-- Max color select -->
<NumberSelect bind:value={$maxColors.current} label={"Colors"} range={colorLimit} />