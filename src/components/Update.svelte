<script>
  import { Workbox } from "workbox-window";
  import { onMount } from "svelte";

  export let loaded = false;

  let update = false;
  function reload() {
    window.location.reload();
  }

  onMount(() => {
    if (navigator.serviceWorker) {
      const wb = new Workbox("/sw.js");

      wb.addEventListener("installed", event => {
        if (event.isUpdate) {
          update = true;
        }
      });

      wb.addEventListener("externalinstalled", event => {
        if (event.isUpdate) {
          update = true;
        }
      });

      wb.register();
    }
  });
</script>

<style>
  div {
    max-width: 288px;
  }
</style>

<div
  class="fixed w-full flex flex-row items-center justify-between bottom-0
  right-0 mb-4 mr-4 z-101 px-4 py-3 bg-white text-sm text-black rounded"
  class:hidden={!update}
  class:mb-20={loaded}>
  A new version is available
  <a class="font-bold text-blue-600 cursor-pointer" on:click={reload}>RELOAD</a>
</div>
