var reload = "30000";
var total = "0";
var oldTitle = "";
var length = "";
function duration() {
    var percent = reload/total*100;
    }

function fmtMSS(s){return(s-(s%=60))/60+(9<s?':':':0')+s}

function nowplaying() {
    $.getJSON('https://api.xtradio.org/api', function (data) {

        if ( typeof data.song !== 'undefined' || data.song !== oldTitle ) {
            if ( data.song === oldTitle ) { 
                setTimeout( "nowplaying()", reload );
    	 }
        else {
            var title = data.song;
            oldTitle = data.song;
            var artist = data.artist;
            var show = data.show;
            if ( data.length != 'false' || data.length !== 'false' ) { 
		        length = ' (' + fmtMSS(data.length) + ')';
    	    }
    	    else { 
    	        length = ''; 
    	    }
    	if ( typeof data.secs !== 'undefined' ) { total = data.secs; }
    
    	if ( typeof data.length !== 'undefined') {
    	    document.getElementById("title").innerHTML = title + ' (' + data.length + ')';
                var ongoing = data.secs - data.remaining
    
    	}
    	else {
    	    document.getElementById("title").innerHTML = title;
    	}

	var img = data.image + '?callback=?';
    	if ( typeof data.remaining !== 'undefined' ) {
    	    reload = data.remaining * 1000 + 1000;
    	    setTimeout( "nowplaying()", reload )
    	}
    	else { reload = "10000";
    	    setTimeout( "nowplaying()", reload );
            }
        document.getElementById("artist").innerHTML ='<a href="' + data.share + '" target="_blank">' + artist + '</a>';
        document.getElementById("title").innerHTML ='<a href="' + data.share + '" target="_blank">' + title + '</a>';
        document.getElementById("albumart").innerHTML = '<img src="' + img + '" width=300 height=300 title="' + artist  + title + '" id="albumartImg"/>';
        document.getElementById("barSongInfo").innerHTML = '<a href="' + data.share + '" target="_blank">' + artist + ' - ' + title + length + '</a>';
// Color Thief
// Get main color from the albumart to use in navbar
        var myImage = document.getElementById("albumartImg");
        RGBaster.colors(myImage, {
            success: function (payload) {
		eqLineColor = payload.dominant;
		var secondaryColor = chroma(chroma.random(), 'rgb');
		while ( chroma.distance(payload.dominant, secondaryColor, 'rgb') < 100 ) {
			secondaryColor = chroma(chroma.random(), 'hex');
		}
		$(".full").css('background-color', secondaryColor);
		$("#metadata").css('color', payload.dominant);
		$("meta[name=theme-color]").attr('content', secondaryColor);
            }
        });
        }
    }

});

if ( typeof durVar === 'undefined' ) {
    duration();
    var durVar = "1";
}

}


window.onload = function(){
nowplaying();
setTimeout( "nowplaying()", reload );

$(window).keypress(function(e) {
    if (e.which === 32) {
        var x = document.getElementById("audioElement");
	if (x.paused) {
		x.play();
	}
	else {
                x.pause();
	}
	e.preventDefault();
    }
});

};
