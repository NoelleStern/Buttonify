<script lang="ts">

  import mime from 'mime';

  interface Props { file: File|string, big?: boolean };
  let { file, big=false }: Props = $props();

  function getURLExtension(url: string): string {
    return url.split('.').pop()!;
  }
  
  function getType(input: File|string): string {
    if (input instanceof File) { return input.type; }
    return mime.getType(getURLExtension(input))!;
  }

  function toURL(input: File|string): string {
    if (input instanceof File) { return URL.createObjectURL(input); }
    return input;
  }

</script>


{#if getType(file).startsWith("image")}
  <img src={toURL(file)} class="preview" class:preview-big={big} alt="result" />
{:else if getType(file).startsWith("video")}
  <video class="preview" class:preview-big={big} autoplay loop muted playsinline>
    <source src={toURL(file)} type="video/webm">
  </video>
{/if}