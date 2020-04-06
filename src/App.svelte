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
    recent: []
  },
  colors = {
    duotone: [240, 240, 199],
    gradient: "transparent",
    visualizer: "rgba(255, 255, 255, 0.5)"
  };

  async function refresh(init) {
    let response = await fetch("https://api.xtradio.org/api");
    let data = await response.json();

    let { song, artist, image, length: duration, remaining } = data;

    if (remaining > duration) {
      remaining = duration;
    }

    if (!init) {
      const exists = tracks.recent.some((t) => t.song === tracks.current.song && t.artist === tracks.current.artist);
      if (!exists) {
        tracks.recent.unshift(tracks.current);
        tracks.recent = tracks.recent.slice(0, 2);
        localStorage.setItem('recentTracks', JSON.stringify(tracks.recent));
      }
    }

    tracks.loading = {
      song,
      artist,
      image: `${image}?${Date.now()}`,
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
    const recentTracks = localStorage.getItem('recentTracks');
    if (recentTracks) {
      try {
        tracks.recent = JSON.parse(recentTracks);
      } catch(e) {
        localStorage.removeItem('recentTracks');
      }
    }

    await refresh(true);
  });

  window.formatTime = (s) => {
    return (s - (s %= 60)) / 60 + (s > 9 ? ":" : ":0") + s;
  }

  let loader, background, image;
  async function imageLoaded(e) {
    let palette = await Vibrant.from(loader, {quality: 1}).getPalette();
    
    colors.duotone = palette.Vibrant.rgb;
    colors.gradient = `rgba(${palette.Muted.rgb.join(', ')}, 0.3)`;
    colors.visualizer = palette.Muted.hex;

    background.change(loader);
    image.change(loader.src);

    tracks.current = {...tracks.loading};
  }
</script>

<style>
.logo {
  filter: brightness(0) invert(1);
  width: 160px;
}

img.loader {
  width: 164px; 
  height: 164px;

  position: absolute;
  left: -99999px;
}
</style>

<Splash loaded={loaded} loading={loading} on:start={start}/>
<Background bind:this={background} colors={colors} />

<!-- Dummy img tag used to get colors from image -->
{#if tracks.loading.image}
  <img bind:this={loader} class="loader" src={tracks.loading.image} on:load={imageLoaded} crossorigin="anonymous"/>
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

        {#if tracks.recent.length}
          <tr>
            <td colspan="3" class="td-title">Recent Tracks</td>
          </tr>
        {/if}

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
