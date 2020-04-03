<script>
  export let val = 0,
    max = 0,
    dot = false;

  $: progress = (100 * val) / max || 0;
</script>

<style lang="postcss">
  .slider {

    @apply w-full h-1 inline-block rounded-lg bg-rail relative;

    .progress {
      height: inherit;

      @apply w-0 rounded-lg bg-progress;

      .dot {
        bottom: -150%;
        margin-left: calc(0rem - theme("spacing.2"));

        @apply w-4 h-4 inline-block rounded-full bg-dot absolute left-0;
      }
    }
  }
</style>

<div class="slider">
  <div class="progress" style="width: {progress}%;">
    {#if dot}
      <span class="dot" style="left: {progress}%;" />
    {/if}
  </div>
</div>
