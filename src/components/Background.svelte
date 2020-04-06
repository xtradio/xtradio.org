<script>
  import * as StackBlur from 'stackblur-canvas';
  export let colors;
  
  let canvas, background = "", loading = false;
  export function change(image) {
    loading = true;
    convertImage(image);

    setTimeout(() => {
        background = canvas.toDataURL();
        loading = false;
    }, 1200);
  }

  function rgbToHsl(r, g, b) {
    r /= 255, g /= 255, b /= 255;
    const max = Math.max(r, g, b),
      min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max == min) {
      h = s = 0; // achromatic
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }

    return [h, s, l];
  }

  function convertToDueTone(imageData, pixelCount, color1, color2) {
    let pixels = imageData.data, pixelArray = [], gradientArray = [];

    // Creates a gradient of 255 colors between color1 and color2
    for (let d = 0; d < 255; d += 1) {
      const ratio = d / 255;
      gradientArray.push([
        Math.floor(color1[0] * ratio + color2[0] * (1 - ratio)), 
        Math.floor(color1[1] * ratio + color2[1] * (1 - ratio)), 
        Math.floor(color1[2] * ratio + color2[2] * (1 - ratio))
      ]);
    }

    for (let i = 0, offset, r, g, b, a; i < pixelCount; i++) {
      offset = i * 4;
      // Gets every color and the alpha channel (r, g, b, a)
      r = pixels[offset + 0];
      g = pixels[offset + 1];
      b = pixels[offset + 2];
      a = pixels[offset + 3];

      // Gets the avg
      var avg = Math.floor(0.299 * r + 0.587 * g + 0.114 * b);
      // Gets the hue, saturation and luminosity
      var hsl = rgbToHsl(avg, avg, avg);
      // The luminosity from 0 to 255
      var luminosity = Math.max(0, Math.min(254, Math.floor((hsl[2] * 254))));

      // Swap every color with the equivalent from the gradient array
      r = gradientArray[luminosity][0];
      g = gradientArray[luminosity][1];
      b = gradientArray[luminosity][2];

      pixelArray.push(r);
      pixelArray.push(g);
      pixelArray.push(b);
      pixelArray.push(a);
    }

    return pixelArray;
  };

  function convertImage(image) {
    const w = image.naturalWidth,
          h = image.naturalHeight;

    canvas.width = w;
    canvas.height = h;

    const context = canvas.getContext('2d');
    context.clearRect(0, 0, w, h);
    context.drawImage(image, 0, 0);

    let imageData = context.getImageData(0, 0, w, h);

    var pixelCount = canvas.width * canvas.height;
    const dueToneData = convertToDueTone(
      imageData, pixelCount, [20,21,23], colors.duotone
    );

    imageData = new ImageData(new Uint8ClampedArray(dueToneData), canvas.width, canvas.height);
    imageData = StackBlur.imageDataRGBA(imageData, 0, 0, canvas.width, canvas.height, 4);

    context.putImageData(imageData, 0, 0, 0, 0, canvas.width, canvas.height);
  }
</script>

<style lang="postcss">
  .background {
    --background: transparent;

    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;

    @apply fixed w-full h-full inset-0 overflow-hidden bg-splash z-10;
    
    canvas {
      transition: opacity 1s ease-out;
      width: 100% !important;
      height: 100% !important;
      @apply absolute inset-0 z-13;
      object-fit: cover;
    }

    .overlay {
      background-color: var(--background);
      transition: background-color 1s ease-out;

      @apply w-full h-full absolute top-0 left-0 z-14;
    }

    &::after {
      content: "";
      background-image: linear-gradient(to top, rgba(20, 21, 23, 0.1) 0, rgba(20, 21, 23, 1) 100%);

      @apply w-full h-full absolute inset-0 z-15;
    }
  }
</style>

<div class="background" style="background-image:url({background});">
  <div class="overlay" style="background-color:{colors.gradient};"></div>
  <canvas bind:this={canvas} class:opacity-0={!loading} class:opacity-100={loading}></canvas>
</div>
