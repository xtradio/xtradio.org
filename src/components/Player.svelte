<script>
  import { onMount } from "svelte";
  import Controls from "./Controls.svelte";

  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  export let duration = 0,
    remaining = 0,
    colors;

  export function init() {
    load();
  }

  const streamUrl = "https://xtrad.io:8443/";
  let audio,
    volume = 1,
    quality = "low";

  $: remaining === 0 && done();

  function done() {
    dispatch("done");
  }

  function load() {
    audio.src = `${streamUrl + quality}.mp3`;
    audio.volume = volume;
    audio.load(); // This restarts the stream download
    audio.play();
  }

  function change(event) {
    const { type, val } = event.detail;

    switch (type) {
      case "quality": // Load stream quality
        quality = val;
        load();
        break;
      case "mute": // Toggle muted state on audio
        volume = !audio.muted ? 0 : audio.volume || 1;
        if (!audio.volume) {
          audio.volume = volume;
        }
        
        audio.muted = !audio.muted;
        break;
      case "volume": // Set audio volume
        audio.volume = volume = val;
        audio.muted = !val;
        break;
    }
  }

  function interval(delay, fn) {
    let start = Date.now(), frame = requestAnimationFrame(loop);

    return frame;

    function loop() {
      frame = requestAnimationFrame(loop);

      if (Date.now() - start >= delay) {
        fn();
        start = Date.now();
      }
    }
  }

  onMount(() => {
    const timer = interval(1000, () => {
      if (remaining >= 1) {
        remaining -= 1;
      }
    });

    audio.addEventListener(
      "canplay",
      () => {
        dispatch("canplay");
      },
      true
    );

    return () => {
      cancelAnimationFrame(timer);
    };
  });
</script>

<audio bind:this={audio} class="hidden" controls crossorigin="anonymous" />
<Controls {remaining} {duration} {volume} {quality} on:change={change}/>
