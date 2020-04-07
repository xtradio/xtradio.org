<script>
  import * as Vibrant from 'node-vibrant';
  import { onMount } from "svelte";
  import Background from "./components/Background.svelte";
  import Splash from "./components/Splash.svelte";
  import Player from "./components/Player.svelte";
  import Image from "./components/Image.svelte";

  let player, loaded = false, loading = false,
  tracks = {
    current: {},
    next: {},
    previous: []
  },
  colors = {
    duotone: [240, 240, 199],
    gradient: "transparent",
    visualizer: "rgba(255, 255, 255, 0.5)"
  };

  let loader, background, image;
  async function refresh() {
    let start = Date.now();
    let response = await fetch("https://api.xtradio.org/v1/np/");
    let data = await response.json();

    loader = new window.Image();
    loader.addEventListener('load', async () => {
      const palette = await Vibrant.from(loader, {quality: 1}).getPalette();
    
      colors.duotone = palette.Vibrant.rgb;
      colors.gradient = `rgba(${palette.Muted.rgb.join(', ')}, 0.3)`;
      colors.visualizer = palette.Muted.hex;

      background.change(loader);
      image.change(loader.src);

      let { show, length, remaining } = data.current;

      // Is live show?
      const live  = show === 'live' || (length === 0 && remaining === 10);
      // If live show only refresh every 15 seconds
      remaining = live ? 15 : remaining - Math.ceil((Date.now() - start) / 1000);

      // Refresh information timer
      setTimeout(refresh, remaining * 1000);

      tracks.current  = {...data.current, remaining};
      tracks.previous = data.previous;
    }, false);
    loader.src = `${data.current.image}?${start}`;
    loader.setAttribute('crossOrigin', '');
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
</script>

<style lang="postcss">
  .logo {
    filter: brightness(0) invert(1);
    width: 160px;
  }

  .info {
    height: calc(100vh - theme('spacing.32'));
    -ms-overflow-style: none;
    overflow: -moz-scrollbars-none;
    scrollbar-width: none;
    
    &::-webkit-scrollbar {
      display: none;
    }
  }
</style>

<Splash loaded={loaded} loading={loading} on:start={start}/>
<Background bind:this={background} colors={colors} />

<ul class="h-16 relative flex flex-row z-100 pt-4 px-4">
  <li class="flex-initial">
    <img src="https://xtradio.org/img/logo-text-fixed.png" class="logo">
  </li>
</ul>

<div class="info container relative mx-auto px-4 pt-8 z-30 overflow-y-auto">
    <div class="flex flex-row items-center content-center justify-start">
        <div class="flex-grow">
          {#if tracks.current.song}
          <h1 class="font-bold text-2xl md:text-5xl text-white leading-none">{tracks.current.artist}</h1>
          <h6 class="text-sm md:text-base text-white opacity-50 mt-2">{tracks.current.song}</h6>
          {/if}
        </div>

        <div class="flex-none box-content w-24 h-24 pl-4 md:w-40 md:h-40">
          <Image bind:this={image} />
        </div>
    </div>

    <table class="table w-full text-xs md:text-sm text-white font-light">
      <tbody>
        {#if tracks.next.song}
          <tr>
            <td colspan="3" class="td-title pb-1">Next Track</td>
          </tr>
          <tr>
            <td>{tracks.next.song}</td>
            <td class="hidden md:table-cell">{tracks.next.artist}</td>
            <td class="hidden md:table-cell text-right" width="100">{formatTime(tracks.next.length)}</td>
          </tr>
        {/if}

        {#if tracks.previous.length}
          <tr>
            <td colspan="3" class="td-title">Previous Tracks</td>
          </tr>
        {/if}

        {#each tracks.previous as track}
          <tr>
            <td>{track.song}</td>
            <td class="hidden md:table-cell">{track.artist}</td>
            <td class="hidden md:table-cell text-right" width="100">{formatTime(track.length)}</td>
          </tr>
        {/each}
        
      </tbody>
    </table>
</div>

<Player
  bind:this={player}
  duration={tracks.current.length}
  remaining={tracks.current.remaining}
  colors={colors}
  on:canplay={started} />
