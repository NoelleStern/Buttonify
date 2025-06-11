
<script lang="ts">

  import { Range } from './Stores/SettingsStore.svelte';

  import PointerUp from '../svg/pointer-up.svelte';
  import PointerDown from '../svg/pointer-down.svelte';

  
  interface Props { value: number, label: String, range: Range };
  let { value=$bindable(), range, label }: Props = $props();


  function clamp(n: number, range: Range): number {
    return Math.min(Math.max(n, range.min), range.max);
  }

  function change(amount: number) {
    value = clamp(value+amount, range);
  }
  
</script>


<div class="flex flex-1 max-w-[8.5rem]">
  <label class="floating-label flex-1 select-none">
    <span class="label">{label}</span>
    <select bind:value class="select select-bordered focus:outline-none rounded-l-sm rounded-r-none w-full">

    {#each {length: range.difference()}, i} 
      <option value={range.min+i}>{String(range.min+i)}</option>
    {/each}

    </select>
  </label>

  <div class="join object-contain join-vertical flex-none w-12 h-[2.5rem]">
    <button onclick={() => {change(1)}} class="btn btn-primary outline-offset-1 rounded-tr-sm h-1/2 object-contain"> <PointerUp cssclass="p-[1px]" /> </button>
    <button onclick={() => {change(-1)}} class="btn btn-primary outline-offset-1 rounded-br-sm h-1/2 object-contain"> <PointerDown cssclass="p-[1px]" /> </button>
  </div>
</div>