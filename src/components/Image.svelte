<script>
    let source, background = "", loading = false;
    export function change(image) {
        source  = image;
        loading = true;

        setTimeout(() => {
            background  = source;
            loading     = false;
        }, 1000);
    }
</script>

<style lang="postcss">
.image {
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;

    @apply w-full h-full relative overflow-hidden;

    img {
        transition: opacity 1s ease-out;
        @apply w-full h-full inset-0 absolute;
    }
}
</style>

<div class="image" style="background-image:url({background});">
    {#if source}
        <img class:opacity-0={!loading} class:opacity-100={loading} src={source}/>
    {/if}
</div>

