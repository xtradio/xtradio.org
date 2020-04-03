<script>
  import * as Vibrant from 'node-vibrant';
  import { onMount } from "svelte";
  import Background from "./components/Background.svelte";
  import Splash from "./components/Splash.svelte";
  import Player from "./components/Player.svelte";
  import Image from "./components/Image.svelte";

  let player, loaded = false, loading = false,
  tracks = {
    current: {
      song: "",
      artist: "",
      image: "",
      duration: 0,
      remaining: 0
    },
    loading: {
      song: "",
      artist: "",
      image: "",
      duration: 0,
      remaining: 0
    },
    next: {
      song: "Galway Girl (Sylow Remix)",
      artist: "Ed Sheeran",
      image: "",
      duration: 215,
      remaining: 0
    },
    recent: [{"song":"Nothing Matters But You","artist":"Gregory Trejo & Markdos ft. Zachary MoFat","image":"https://img.xtradio.org/tracks/8975582200.jpg","duration":164,"remaining":0},{"song":"Too Wild (Daniele Di Martino Remix)","artist":"Love Inks","image":"https://img.xtradio.org/tracks/3045621369.jpg","duration":209,"remaining":0}]
  },
  colors = {
    duotone: [240, 240, 199],
    gradient: "transparent",
    visualizer: "rgba(255, 255, 255, 0.5)"
  };

  async function refresh() {
    let response = await fetch("https://api.xtradio.org/api");
    let data = await response.json();

    let { song, artist, image, length: duration, remaining } = data;

    if (remaining > duration) {
      remaining = duration;
    }

    tracks.loading = {
      song,
      artist,
      image,
      duration,
      remaining
    };
  }

  function start() {
    loading = true;
    player.init();
  }

  function started() {
    if (!loaded) {
      loading = false;
      loaded = true;
    }
  }

  onMount(async () => {
    await refresh();
  });

  window.formatTime = (s) => {
    return (s - (s %= 60)) / 60 + (s > 9 ? ":" : ":0") + s;
  }

  let loader, background, image;
  async function imageLoaded(e) {
    console.log(loader.width, loader.height);
    const palette = await Vibrant.from(loader, {quality: 1}).getPalette();
    colors.duotone = palette.Vibrant.rgb;
    colors.gradient = `rgba(${palette.Muted.rgb.join(', ')}, 0.3)`;
    colors.visualizer = palette.Muted.hex;

    background.change(loader);
    image.change(tracks.loading.image);

    tracks.current = {...tracks.loading};
  }
</script>

<style>
.logo {
  filter: brightness(0) invert(1);
  width: 160px;
}
</style>

<Splash loaded={loaded} loading={loading} on:start={start}/>
<Background bind:this={background} colors={colors} />

<!-- Dummy img tag used to get colors from image -->
{#if loaded}
  <img bind:this={loader} class="hidden" src={tracks.loading.image} on:load={imageLoaded} crossorigin="anonymous"/>
{/if}

<ul class="relative flex flex-row z-100 pt-4 px-4">
  <li class="flex-initial">
    <img src="https://xtradio.org/img/logo-text-fixed.png" class="logo">
  </li>
</ul>

<div class="container relative mx-auto px-6 pt-8 z-30">
    <div class="flex flex-row items-center content-center">
        <div class="flex-grow">
          <h1 class="font-bold text-xl md:text-5xl text-white leading-none">{tracks.current.artist}</h1>
          <h6 class="text-xs md:text-base text-white opacity-50 mt-2">{tracks.current.song}</h6>
        </div>

        <div class="flex-initial w-40 h-40">
          <Image bind:this={image} />
        </div>
    </div>

    <table class="table w-full">
      <tbody>
        <tr>
          <td colspan="3" class="td-title pb-1">Next Track</td>
        </tr>
        <tr>
          <td>{tracks.next.song}</td>
          <td>{tracks.next.artist}</td>
          <td class="has-text-centered" width="100">{formatTime(tracks.next.duration)}</td>
        </tr>

        <tr>
          <td colspan="3" class="td-title">Recent Tracks</td>
        </tr>

        {#each tracks.recent as track}
          <tr>
            <td>{track.song}</td>
            <td>{track.artist}</td>
            <td class="has-text-centered" width="100">{formatTime(track.duration)}</td>
          </tr>
        {/each}
        
      </tbody>
    </table>
</div>

<Player
  bind:this={player}
  duration={tracks.current.duration}
  remaining={tracks.current.remaining}
  colors={colors}
  on:done={refresh}
  on:canplay={started} />
