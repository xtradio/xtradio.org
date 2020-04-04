<script>
    export let spacing = 0.5, smoothing = 0.5, peaks = false, fftSize = 8192, colors;

    let canvas, analyser, audioCtx, canvasCtx, animation, bgColor = 'transparent',
        groupNotes  = 3, 
        minFreq     = 60, 
        maxFreq     = 12000, 
        barWidth    = 0,
        barSpacePx  = 0,
        analyzerBars = [],
        dataArray    = [],
        width = 0, height = 0, initDone = false;

    $: isOn = animation !== undefined;
    $: showPeaks = peaks || false;
    $: barSpace = spacing || 2;

    export function init(audio) {
      if (initDone) {
        return;
      }

      // Create analyser node, connect audio source and connect it to the destination
      audioCtx      = new (window.AudioContext || window.webkitAudioContext)();
      const source  = audioCtx.createMediaElementSource( audio );
      analyser      = audioCtx.createAnalyser();
      
      source.connect( analyser );
      analyser.connect( audioCtx.destination );

      analyser.smoothingTimeConstant = smoothing;
      analyser.minDecibels = -85;
      analyser.maxDecibels = -25;
      analyser.fftSize = fftSize;
      dataArray = new Uint8Array( analyser.frequencyBinCount );
      
      width = canvas.width;
      height = canvas.height;

      // analyser canvas
      canvasCtx = canvas.getContext( '2d', { alpha: true } );

      // adjust canvas on window resize
      window.addEventListener( 'resize', () => {
        if ( ! width || ! height ) // fluid width or height
          setCanvas('resize');
      });

      toggleAnalyzer(true);

      initDone = true;
      setCanvas('create');
    }

    function setCanvas() {
      if ( ! initDone )
        return;

      let pixelRatio = 4;//window.devicePixelRatio; // for Retina / HiDPI devices
      
      // Set correct pixel ratio
      canvas.width = width * pixelRatio;
			canvas.height = height * pixelRatio;

      // clear the canvas
      canvasCtx.fillStyle = bgColor;
      canvasCtx.clearRect( 0, 0, canvas.width, canvas.height );
      //canvasCtx.fillRect( 0, 0, canvas.width, canvas.height );

      canvasCtx.lineJoin = 'bevel';

      // calculate bar positions
      precalculateBarPositions();
    }

    function draw() {
      // clear the canvas
      canvasCtx.fillStyle = bgColor;
      canvasCtx.clearRect( 0, 0, canvas.width, canvas.height );
      //canvasCtx.fillRect( 0, 0, canvas.width, canvas.height );

      // get a new array of data from the FFT
      analyser.getByteFrequencyData( dataArray );

      // set bar color
      canvasCtx.fillStyle = colors.visualizer;

      // compute the effective bar width, considering the selected bar spacing
      let width = barWidth - barSpacePx;

      // if no bar spacing is required, make sure width is integer for pixel accurate calculation
      if ( barSpace == 0 )
        width |= 0;
      
      // draw bars / lines
      let bar, barHeight;
      const nBars = analyzerBars.length;

      for ( let i = 0; i < nBars; i++ ) {
        bar = analyzerBars[ i ];

        if ( bar.endIdx == 0 ) { // single FFT bin
          barHeight = dataArray[ bar.dataIdx ];
          // apply smoothing factor when several bars share the same bin
          if ( bar.factor )
            barHeight += ( dataArray[ bar.dataIdx + 1 ] - barHeight ) * bar.factor;
        } else { 	// range of bins
          barHeight = 0;
          // use the highest value in the range
          for ( let j = bar.dataIdx; j <= bar.endIdx; j++ )
            barHeight = Math.max( barHeight, dataArray[ j ] );
        }

        barHeight = barHeight / 255 * canvas.height | 0;

        if ( barHeight >= bar.peak ) {
          bar.peak = barHeight;
          bar.hold = 30; // set peak hold time to 30 frames (0.5s)
          bar.accel = 0;
        }

        let posX = bar.posX;
        let adjWidth = width; // bar width may need small adjustments for some bars, when barSpace == 0

        // Draw line / bar
        if ( barSpace == 0 ) {
          posX |= 0;
          if ( i > 0 && posX > analyzerBars[ i - 1 ].posX + width ) {
            posX--;
            adjWidth++;
          }
        } else {
          posX += barSpacePx / 2;
        }

        canvasCtx.fillRect( posX, canvas.height, adjWidth, -barHeight );

        // Draw peak
        if ( bar.peak > 0 ) {
          if ( showPeaks ) {
            canvasCtx.fillRect( posX, canvas.height - bar.peak, adjWidth, 2 );
          }

          if ( bar.hold )
            bar.hold--;
          else {
            bar.accel++;
            bar.peak -= bar.accel;
          }
        }
      } // for ( let i = 0; i < l; i++ )

      animation = requestAnimationFrame( () => draw() );
    }

    function precalculateBarPositions() {
      // generate a table of frequencies based on the equal tempered scale
      const root24 = 2 ** ( 1 / 24 );
      const c0 = 440 * root24 ** -114; // ~16.35 Hz

      let temperedScale = [], i = 0, freq;

      while ( ( freq = c0 * root24 ** i ) <= maxFreq ) {
        if ( freq >= minFreq && i % groupNotes == 0 )
          temperedScale.push( freq );
        i++;
      }

      let minLog = Math.log10( temperedScale[0] );
      let bandWidth = canvas.width / ( Math.log10( temperedScale[ temperedScale.length - 1 ] ) - minLog );

      // divide canvas space by the number of frequencies (bars) to display
      barWidth = canvas.width / temperedScale.length;
      calculateBarSpacePx();

			let prevBin = 0,  // last bin included in previous frequency band
			    prevIdx = -1, // previous bar FFT array index
			    nBars   = 0;  // count of bars with the same index

			temperedScale.forEach(( freq, index ) => {
				// which FFT bin represents this frequency?
				const bin = findFrequencyBin( freq );

        // start from the last used FFT bin
        let idx = prevBin > 0 && prevBin + 1 <= bin ? prevBin + 1 : bin;
        let nextBin; // bin included in next frequency band

				// FFT does not provide many coefficients for low frequencies, so several bars may end up using the same data
				if ( idx == prevIdx ) {
					nBars++;
				} else {
					// update previous bars using the same index with a smoothing factor
					if ( nBars > 1 ) {
						for ( let i = 1; i <= nBars; i++ )
							analyzerBars[ analyzerBars.length - i ].factor = ( nBars - i ) / nBars;
					}
					prevIdx = idx;
					nBars = 1;
        }

				prevBin = nextBin = bin;
				// check if there's another band after this one
				if ( temperedScale[ index + 1 ] !== undefined ) {
					nextBin = findFrequencyBin( temperedScale[ index + 1 ] );
					// and use half the bins in between for this band
					if ( nextBin - bin > 1 )
						prevBin += Math.round( ( nextBin - bin ) / 2 );
				}

				const endIdx = prevBin - idx > 0 ? prevBin : 0;

				analyzerBars.push( {
					posX: index * barWidth,
					dataIdx: idx,
					endIdx,
          //freq, // nominal frequency for this band
          //range: [ this._findBinFrequency( idx ), this._findBinFrequency( endIdx || idx ) ], // actual range of frequencies
					factor: 0,
					peak: 0,
					hold: 0,
					accel: 0
				} );

			});
    }

    function calculateBarSpacePx() {
      barSpacePx = Math.min(
        barWidth - 1, (barSpace > 0 && barSpace < 1) ? barWidth * barSpace : barSpace
      );
    }

    function findFrequencyBin( freq, func ) {
      const bin = freq * analyser.fftSize / audioCtx.sampleRate;

      if ( ! ['floor', 'ceil'].includes( func ) )
        func = 'round';

      return Math[ func ]( bin );
    }

    function toggleAnalyzer( value ) {
      if ( value === undefined )
        value = ! isOn;

      if ( isOn && ! value ) {
        cancelAnimationFrame( animation );
        animation = undefined;
      } else if ( ! isOn && value ) {
        animation = requestAnimationFrame( () => draw() );
      }
    }
</script>

<canvas bind:this={canvas} class="w-full h-40 max-w-full absolute bottom-0 mb-16 z-100"/>