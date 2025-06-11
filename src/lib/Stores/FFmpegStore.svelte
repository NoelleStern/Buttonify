<script module lang="ts">

  import mime from 'mime';
  import { get } from 'svelte/store';
  import { saveAs } from 'file-saver';
  import { fetchFile } from '@ffmpeg/util';
  import { type Tween } from 'svelte/motion';
  import { FFmpeg, type FileData } from '@ffmpeg/ffmpeg';
  import { extension, framerate, maxColors } from './SettingsStore.svelte';


  export const ffmpeg: FFmpeg = new FFmpeg();


  export async function init(progress: Tween<number>) {
    ffmpeg.on('log', ({message}) => {
      console.log(message);
    });

    ffmpeg.on('progress', (event) => {
      if (event.progress < 0 || event.progress > 1) { progress.target = 0; } // Happens sometimes
      else { progress.target = event.progress * 100; }
    });

    await load();
  }

  function getFileAndExt(s: string): string[] {
    return (s.match(/(.+)+\.(.+)/) || ['', s]).slice(1);
  }

  async function load(): Promise<void> {
    const baseURL: string = 'https://unpkg.com/@ffmpeg/core@0.12.10/dist/esm'; // This url is package version sensitive!!!

    await ffmpeg.load({
      coreURL: `${baseURL}/ffmpeg-core.js`,
      wasmURL: `${baseURL}/ffmpeg-core.wasm`,
      workerURL: `${baseURL}/ffmpeg-core.worker.js`,
    });

    await ffmpeg.exec(['-stats_period', '0.05']); // Stat update period
  }

  export async function abort(): Promise<void> {
    ffmpeg.terminate();
    await load();
  }

  export function saveFile(file: File): void {
    const [name, extension] = getFileAndExt(file.name);
    saveAs(file, `${name}.88x31.${extension}`);
  }

  // Generates an FFmpeg command
  function genCMD(video: File): string[] {
    const input: string[] = [ '-i', video.name, '-i', 'palette.png' ]; // Use video and palette as input
    const filter: string[] = [ '-filter_complex', `[0:v] fps=${ get(framerate).current }, scale=88:31 [new];[new][1:v] paletteuse` ]; // Scale down, change fps, use palette
    const loop: string[] = [ '-loop', '0' ]; // Infinitely loop the gif
    const aspect: string[] = ['-aspect', '88:31']; // Without aspect WEBP does the funny
    const codec: string[] = [  `-an`, '-c:v', 'libvpx' ]; // Codec for WEBP
    const output: string[] = [ `output.${ get(extension).current }` ]; // Output filename

    switch(get(extension).current) {
      case 'webm':
        return [...input, ...filter, ...aspect, ...codec, ...output];
      case 'gif':
      default:
        return [...input, ...filter, ...loop, ...output];
    }
  }

  // https://stackoverflow.com/questions/70098620/use-just-regexp-to-split-a-string-into-a-tuple-of-filename-and-extension
  export async function convertVideo(video: File): Promise<File|null> {
    try {
      // Convert to 88x31
      await ffmpeg.exec(['-nostats']);
      ffmpeg.writeFile(video.name, await fetchFile(video)); // Write file to the FS
      await ffmpeg.exec(['-i', video.name, '-filter_complex', `[0:v] palettegen=max_colors=${ get(maxColors).current }`, 'palette.png']); // Generate limited palette
      await ffmpeg.exec(['-stats']);
      await ffmpeg.exec(genCMD(video)); // Convert into a final media file
      
      // Pack into a File for convenience
      const name: string = getFileAndExt(video.name)[0];
      const data: FileData = await ffmpeg.readFile(`output.${ get(extension).current }`);
      const file: File = new File(
        [data as BlobPart],
        `${name}.${ get(extension).current }`,
        { 
          type:`${ mime.getType(get(extension).current) }`
        }
      );

      return file;

    } catch(e: any) {

      if (e.message == 'ffmpeg has exited') {
        console.log('the operation was cancelled!');
      }
      return null;
      
    }
  }

</script>