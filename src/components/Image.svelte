<script>
    export let src;
    let background = "", loading = false;
    function loaded() {
        loading = true;

        setTimeout(() => {
            background  = src;
            loading     = false;
        }, 1000);
    }
</script>

<style lang="postcss">
.image {
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    padding-top: 100%;

    @apply w-full relative overflow-hidden;

    img {
        transition: opacity 1s ease-out;
        object-fit: cover;
        @apply w-full h-full inset-0 absolute;
    }
}
</style>

<div class="image" style="background-image:url({background});">
    {#if src}
        <img class:opacity-0={!loading} class:opacity-100={loading} {src} on:load={loaded}/>
    {/if}
</div>

