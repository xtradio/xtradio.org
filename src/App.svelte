<script>
  import * as Vibrant from 'node-vibrant';
  import Background from "./components/Background.svelte";
  import Splash from "./components/Splash.svelte";
  import Player from "./components/Player.svelte";
  import Image from "./components/Image.svelte";
  import Update from "./components/Update.svelte";

  let player, loaded = false,
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

  let background;
  async function refresh(cb) {
    let start = Date.now();
    let response = await fetch("https://api.xtradio.org/v1/np/");
    let data = await response.json();

    const loader = new window.Image();
    loader.addEventListener('load', async () => {
      const palette = await Vibrant.from(loader, {quality: 1}).getPalette();
    
      colors.duotone = palette.Vibrant.rgb;
      colors.gradient = `rgba(${palette.Muted.rgb.join(', ')}, 0.3)`;
      colors.visualizer = palette.Muted.hex;

      background.change(loader);

      let { show, length, remaining } = data.current;

      // Is live show?
      const live  = show === 'live' || (length === 0 && remaining === 10);
      remaining -= Math.ceil((Date.now() - start) / 1000);

      // Refresh information timer
      setTimeout(refresh, remaining * 1000);

      tracks.current  = {...data.current, remaining: live ? 0 : remaining, image: loader.src};
      tracks.previous = data.previous;
      if (cb) {
        cb();
      }
    }, false,);
    loader.src = `${data.current.image}?${start}`;
    loader.setAttribute('crossOrigin', '');
  }

  let started = false;
  function start() {
    started = true;

    setTimeout(() => {
      player.init();
      player.muted(true);
    }, 200);
  }

  async function canplay() {
    if (loaded) {
      return;
    }

    await refresh(() => {
      loaded = true;
      player.muted(false);
    });
  }

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
    height: calc(100% - theme('spacing.32'));
    -ms-overflow-style: none;
    overflow: -moz-scrollbars-none;
    scrollbar-width: none;
    transform: translateX(-50%);
    left: 50%;
    
    &::-webkit-scrollbar {
      display: none;
    }
  }
</style>

<ul class="h-16 relative flex flex-row z-100 pt-4 px-4">
  <li class="flex-initial">
    <img src="https://xtradio.org/img/logo-text-fixed.png" class="logo">
  </li>
</ul>

<Update {loaded}/>
<Splash {loaded} on:start={start}/>
<Background bind:this={background} colors={colors} />

{#if loaded}
 


<div class="info container absolute mx-auto px-4 pt-8 z-30 overflow-y-auto">
    <div class="flex flex-col-reverse md:flex-row items-center content-center justify-start text-center md:text-left mb-8 md:mb-0">
        <div class="flex-grow mt-6 md:mt-0">
          {#if tracks.current.song}
          <h1 class="font-bold text-2xl md:text-5xl text-white leading-none">{tracks.current.artist}</h1>
          <h6 class="text-sm md:text-base text-white opacity-50 mt-2">{tracks.current.song}</h6>
          {/if}
        </div>

        <div class="flex-none box-content w-3/4 md:w-1/4 md:pl-4">
          <Image src={tracks.current.image} />
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

{/if}

{#if started}

<Player
  bind:this={player}
  duration={tracks.current.length}
  remaining={tracks.current.remaining}
  colors={colors}
  on:canplay={canplay} />

{/if}
