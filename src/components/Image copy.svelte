<script>
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    export let src, ref;
    if (!src) {
        src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
    }

    let loaded = false, 
        source = src;

    function change() {
        loaded = true;
        dispatch('loaded');

        setTimeout(() => {
            source = src;
            loaded = false;
        }, 1200);
    }
</script>

<style lang="postcss">
.image {
    @apply w-full h-full;

    img {
        transition: opacity 1.2s ease-in-out;
        @apply w-full h-full top-0 left-0 absolute border-0;
    }
}
</style>

<div class="image relative">
    <img src={source} {ref} crossorigin="anonymous">
    <img src={src} on:load={change} class:opacity-0={!loaded} class:opacity-100={loaded} {ref} crossorigin="anonymous">
</div>

