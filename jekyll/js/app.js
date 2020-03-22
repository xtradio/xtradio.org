var audioCtx;
$(document).ready(function () {
  if (/Android|BlackBerry|iPhone|iPad|iPod|webOS/i.test(navigator.userAgent) === false) {
  audioCtx = new (window.AudioContext)();
  var audioElement = document.getElementById('audioElement');
//   console.log(audioCtx.state)
  audioElement.crossOrigin = "anonymous";
  var audioSrc = audioCtx.createMediaElementSource(audioElement);
  var analyser = audioCtx.createAnalyser();

  // Bind our analyser to the media element source.
  audioSrc.crossOrigin = "use-credentials";
  audioSrc.connect(analyser);
  audioSrc.connect(audioCtx.destination);

  // var frequencyData = new Uint8Array(analyser.frequencyBinCount);
  var frequencyData = new Uint8Array(175);

  var svgHeight = $(".full-width-content").height() * 2;
  var svgWidth = $(".full-width-content").width();
  var barPadding = '1';

  function createSvg(parent, height, width) {
    return d3.select(parent).append('svg').attr('height', height).attr('width', width);
  }

  var svg = createSvg('.full-width-content', svgHeight, svgWidth);

  // Create our initial D3 chart.
  svg.selectAll('rect')
     .data(frequencyData)
     .enter()
     .append('rect')
     .attr('x', function (d, i) {
        return i * (svgWidth / frequencyData.length);
     })
     .attr('height', function(d) {
        return d * 2;
     })
     .attr('width', svgWidth / frequencyData.length - barPadding);

  // Continuously loop and update chart with frequency data.
  function renderChart() {
     requestAnimationFrame(renderChart);

     // Copy frequency data to frequencyData array.
     analyser.getByteFrequencyData(frequencyData);

     // Update d3 chart with new data.
     svg.selectAll('rect')
        .data(frequencyData)
        .attr('y', function(d) {
           return svgHeight - ( 2 * d ) ;
        })
        .attr('height', function(d) {
           return d * 2;
        })
        .attr('fill', function(d) {
	if ( typeof eqLineColor !== 'undefined' ) {  
           return eqLineColor;
        }
	else {
	   return 'rgb(0, 0, 0)';
        }
        });
  }

  // Run the loop
  renderChart();
}
});
