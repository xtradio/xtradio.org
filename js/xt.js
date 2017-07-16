var reload = "30000";
var total = "0";
var oldTitle = "";
var length = "";
function duration() {
var percent = reload/total*100;
var eqLineColor = "rgb(0, 0, 0)";
}

function nowplaying() {
    $.getJSON('https://xtradio.org/API/np.php', function (data) {

        if ( typeof data.song !== 'undefined' || data.song !== oldTitle ) {
            if ( data.song === oldTitle ) { 
                setTimeout( "nowplaying()", reload );
    	 }
        else {
            var title = data.song;
            oldTitle = data.song;
            var artist = data.artist;
            var show = data.show;
            if ( data.lenght != 'false' || data.lenght !== 'false' ) { 
    	        length = ' (' + data.lenght + ')'; 
    	    }
    	    else { 
    	        length = ''; 
    	    }
    	if ( typeof data.secs !== 'undefined' ) { total = data.secs; }
    
    //	if ( data.share !== '' && typeof data.share !== 'undefined' ) { 
    //	document.getElementById("share").innerHTML = '<a href="' + data.share + '" target="_blank"><img src="//blog.xtradio.org/wp-content/themes/xtradio/images/social_soundcloud.png" height="40" width="40" title="' + data.artist + ' - ' + data.song + ' on Soundcloud" ></a>'
    //	$("#share").show();
    //	}
    //	else {
    //	$("#share").hide();
    //	}
    
    	if ( typeof data.lenght !== 'undefined') {
    	    document.getElementById("title").innerHTML = title + ' (' + data.lenght + ')';
                var ongoing = data.secs - data.remaining
    //    $("#progressbar").val(ongoing);
    //    $("#progressbar").attr("max", data.secs);
    //                        var progressbar = $('#progressbar'),
    //                                max = data.secs,
    //                                time = 1000,
    //                        value = progressbar.val();
    //
    //
    //                    var loading = function() {
    //                        value += 1;
    //                        addValue = progressbar.val(value);
    //
    //                        if (value == max) {
    //                            clearInterval(animate);
    //                        }
    //                    };
    //
    //                    var animate = setInterval(function() {
    //                        loading();
    //                    }, time);
    
    
    	}
    	else {
    	    document.getElementById("title").innerHTML = title;
    	}

	var img = 'https:' + data.image;
    	if ( typeof data.remaining !== 'undefined' ) {
    	    reload = data.remaining * 1000 + 1000;
    	    setTimeout( "nowplaying()", reload )
    	}
    	else { reload = "10000";
    	    setTimeout( "nowplaying()", reload );
            }
        document.getElementById("artist").innerHTML ='<a href="' + data.share + '" target="_blank">' + artist + '</a>';
        document.getElementById("title").innerHTML ='<a href="' + data.share + '" target="_blank">' + title + '</a>';
        document.getElementById("albumart").innerHTML = '<img src="' + img + '" width=250 height=250 title="' + artist  + title + '" id="albumartImg"/>';
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
		console.log(chroma(secondaryColor, 'hex'));
		$(".full").css('background-color', secondaryColor);
		$("#metadata").css('color', payload.dominant);
                console.log('Dominant color:', payload.dominant);
                console.log('Secondary color:', payload.secondary);
                console.log('Palette:', payload.palette);
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

// var npr = setInterval(function(){nowplaying()},reload);

window.onload = function(){
nowplaying();
//$("#metadata").toggle();
//$("#player").toggle();
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
