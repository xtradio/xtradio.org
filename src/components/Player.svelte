<script>
  import { onMount } from "svelte";
  import Controls from "./Controls.svelte";

  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  export let duration = 0,
    remaining = 0,
    colors;

  export function init() {
    load(quality);
  }

  const streamUrl = "https://xtrad.io:8443/";
  let audio,
    volume = 1,
    quality = "low";

  $: remaining === 0 && done();

  function done() {
    dispatch("done");
  }

  function load(quality) {
    audio.src = `${streamUrl + quality}.mp3`;
    audio.load(); // This restarts the stream download
    audio.play();
  }

  function notify(event) {
    const { type, val } = event.detail;

    switch (type) {
      case "quality": // Load stream quality
        load(quality);
        break;
      case "mute": // Toggle muted state on audio
        volume = !audio.muted ? 0 : audio.volume;
        audio.muted = !audio.muted;
        break;
    }
  }

  onMount(() => {
    const interval = setInterval(() => {
      if (remaining >= 1) {
        remaining -= 1;
      }
    }, 1000);

    audio.addEventListener(
      "canplay",
      () => {
        dispatch("canplay");
      },
      true
    );

    return () => {
      clearInterval(interval);
    };
  });
</script>

<audio bind:this={audio} class="hidden" controls crossorigin="anonymous" />
<Controls {remaining} {duration} bind:volume bind:quality on:notify={notify} />
