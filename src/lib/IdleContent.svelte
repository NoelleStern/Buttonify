<script lang="ts">

  import { data as ConverterStore } from './Stores/ConverterStore.svelte';

  let files: FileList|undefined = $state();
  
  $effect(() => {
    if (files == undefined) { return; }
    if (files.length == 0) { return; }
    ConverterStore.video = files[0];
  });

</script>


<p> Drag your video here! </p>
<div class="divider">OR</div>
<div>
  <label for="files" class="btn btn-primary"> Browse </label>
  <input id="files" type="file" accept="video/*" class="hidden" bind:files />
</div>