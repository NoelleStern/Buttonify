<script lang="ts">

  import CatFuel from '@assets/media/catfuel.gif';
  import GitHub from '@assets/media/github.88x31.png';
  import BadApple from '@assets/media/badapple.88x31.webm';
  import Lagrellis from '@assets/media/lagrelliswidethicc.gif';
  import RollingYrellis from '@assets/media/rollingyrellis.gif';

  import Preview from './Preview.svelte';

</script>


{#snippet button(src: string, href: string, title: string)}
  <a class="btn b8831" {href} target="_blank" {title}>
    <img alt={title} {src} />
  </a>
{/snippet}

{#snippet videoButton(src: string, href: string, title: string)}
  <a class="btn b8831" {href} target="_blank" aria-label={title} {title}>
    <video autoplay loop muted playsinline>
      <source {src} type="video/webm">
    </video>
  </a>
{/snippet}



<div class="flex w-full gap-1">

  <Preview file={CatFuel}/>
  {@render videoButton(BadApple, "https://www.youtube.com/watch?v=FtutLA63Cp8", "Bad Apple!!")}
  {@render button(Lagrellis, "https://www.youtube.com/watch?v=UnIhRpIT7nc", "Lagtrain")}
  {@render button(RollingYrellis, "https://www.youtube.com/watch?v=FK0q0ynIMcw", "Rolling Girl")}
  {@render button(GitHub, "https://github.com/NoelleStern/Buttonify", "Project's GitHub Page")}

</div>