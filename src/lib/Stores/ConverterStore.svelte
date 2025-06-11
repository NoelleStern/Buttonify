<script module lang="ts">

  import { Tween } from 'svelte/motion';


  type onVideoChangeCallback = (file: File|null) => void;
  export const defaultAspect: number = 16/9; // Standard aspect ratio


  export class ConverterData {
    private videoFile: File|null = $state(null);
    public progress: Tween<number> = new Tween(0);
    public dragenter: boolean = $state(false);
    public aspect: number = $state(defaultAspect);
    public videoURL: string = $derived(URL.createObjectURL(this.videoFile! as Blob) || '');
    public onVideoChange: onVideoChangeCallback = ()=>{};

    // https://stackoverflow.com/questions/44297164/extract-frames-from-video-in-js
    set video(file: File|null) {
      this.videoFile = file; // Assign

      if (file == null) { 
        this.aspect = defaultAspect; // Reset aspect to default
      } else {
        // Get aspect ratio
        const vid = document.createElement('video');
        vid.onloadeddata = () => {
          const [w, h] = [vid.videoWidth, vid.videoHeight];
          this.aspect = w/h;
        }
        vid.src = this.videoURL; // Set URL
      }

      this.onVideoChange(file); // Callback
    };
    get video(): File|null {
      return this.videoFile;
    }

    public removeVideo(): void {
      if (this.videoFile == null) { return; }

      this.video = null; // Not "this.videoFile"
    }

    public aspectHeight(width: number): number {
      return width / this.aspect;
    }
    public aspectWidth(height: number): number {
      return height * this.aspect;
    }
  }


  export const data: ConverterData = new ConverterData();


</script>