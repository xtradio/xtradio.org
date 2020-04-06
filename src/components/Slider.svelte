<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  export let val = 0,
    max = 0,
    dot = false;

  $: progress = +(((100 * val) / max).toFixed(1)) || 0;

  let _slider, _dot, moving = false;
  function change(event) {
    const posX = (event.offsetX != null) ? event.offsetX : event.originalEvent.layerX;
    const percentage = Math.round((100 * posX) / _slider.offsetWidth || 0);
    val = +(((percentage / 100) * max).toFixed(1));
    dispatch('change', val);
  }
  
  function click(event) {
    event.preventDefault();
    if (dot && event.target != _dot) {
      change(event);
    }
  }

  function start(event) {
    event.preventDefault();
    moving = true;
  }

  function move(event) {
    if (moving) {
      change(event);
    }
  }

  function end(event) {
    moving = false;
  }
</script>

<style lang="postcss">
  .slider {

    @apply w-full h-1 inline-block rounded-lg bg-rail relative;

    &:after {
      content: '';
      bottom: -250%;

      @apply w-full h-6 absolute left-0 z-1 bg-transparent block;
    }

    .progress {
      height: inherit;

      @apply w-0 rounded-lg bg-progress z-1;
    }

    .dot {
      bottom: -150%;
      margin-left: calc(0rem - theme("spacing.2"));

      @apply w-4 h-4 inline-block rounded-full bg-dot absolute left-0 z-2 cursor-pointer;
    }

    &.moving {
      .dot {
        pointer-events: none;
      }

       &:after {
        @apply block;
      }
    }
  }
</style>

<svelte:body
	on:mouseup={end}
/>

<div bind:this={_slider} class="slider" class:moving={moving} on:mousedown={click} on:mousemove={move}>
  <div class="progress" style="width: {progress}%;"/>
  {#if dot}
    <span bind:this={_dot} class="dot" style="left: {progress}%;" 
    on:mousedown={start} />
  {/if}
</div>
