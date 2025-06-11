<script module lang="ts">

  import { writable, type Writable } from 'svelte/store';
  import { PersistedState } from 'runed';

  // https://stackoverflow.com/questions/44480644/string-union-to-string-array
  export const ALL_EXTENSIONS = ['gif', 'webm'] as const;
  export type ExtensionTuple = typeof ALL_EXTENSIONS;
  export type Extension = ExtensionTuple[number];
  

  export class Range {
    min: number;
    max: number;
    
    constructor(min: number, max: number) {
      this.min = min;
      this.max = max;
    }

    public difference(): number {
      return Math.abs(this.max-this.min) + 1;
    }
  }


  export const extension: Writable<PersistedState<Extension>> = writable<PersistedState<Extension>>(new PersistedState('TargetExtension', 'webm'));
  export const framerate: Writable<PersistedState<number>> = writable<PersistedState<number>>(new PersistedState('TargetFramerate', 8));
  export const maxColors: Writable<PersistedState<number>> = writable<PersistedState<number>>(new PersistedState('TargetMaxColors', 16));
  export const framerateLimit: Range = new Range(1, 60);
  export const colorLimit: Range = new Range(4, 256);
  
  
</script>