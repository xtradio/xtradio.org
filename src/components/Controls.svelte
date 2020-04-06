<script>
  import Slider from "./Slider.svelte";

  import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

  export let quality = "low",
    volume = 1,
    duration = 0,
    remaining = 0;

  $: currentTime = duration - remaining;

  function notify(type, val) {
    dispatch('change', { type, val });
  }
</script>

<style lang="postcss">
  .control {
    @apply h-full relative flex items-center justify-center;

    .button {
      @apply text-white w-10 h-6 bg-controls cursor-pointer;

      &:after {
        content: "";
        background: transparent;
        top: calc(0rem - theme("spacing.3"));

        @apply text-white w-10 h-4 absolute inset-x-0 cursor-default;
      }
    }

    .popout {
      top: calc(0rem - theme("spacing.2"));
      @apply text-white h-10 absolute bg-controls
        flex-row items-center justify-center rounded left-0
        transform origin-top-left -rotate-90;

      .button {
        @apply transform rotate-90 h-8 my-2;

        &.is-selected {
          opacity: 0.6;
          cursor: default;
        }
      }
    }
  }
</style>

<div class="w-full h-16 fixed bottom-0 z-50 flex items-center px-2 bg-controls">
  <div class="control group">
    <div
      class="button"
      class:icon-volume-up={volume > 0.5}
      class:icon-volume-down={volume > 0 && volume <= 0.5}
      class:icon-volume-mute={volume <= 0}
      on:click={() => notify('mute')}
    />
    <div class="popout w-40 px-5 hidden md:group-hover:flex">
      <Slider val={volume} max="1" dot on:change={(e) => notify('volume', e.detail)} />
    </div>
  </div>

  <div class="control group">
    <div class="button icon-quality-{quality}" id="quality-button" />

    <div class="popout w-32 hidden group-hover:flex">
      {#each ['low', 'mid', 'high'] as q}
        <span
          class="button icon-quality-{q}"
          class:is-selected={quality === q}
          on:click={() => notify('quality', q)} />
      {/each}
    </div>
  </div>

  <div class="text-xs text-white opacity-75 w-8 mx-3 mr-4">
    {formatTime(currentTime)}
  </div>

  <Slider val={currentTime} max={duration} />

  <div class="text-xs text-white opacity-75 w-8 mx-3 ml-4">
    {formatTime(duration)}
  </div>

  <!-- <a class="button icon-cast"></a> -->
</div>
