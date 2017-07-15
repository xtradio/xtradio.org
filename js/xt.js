var reload = "30000";
var total = "0";
var oldTitle = "";
function duration() {
var percent = reload/total*100;
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
	if ( typeof data.secs !== 'undefined' ) { total = data.secs; }

//	if ( data.share !== '' && typeof data.share !== 'undefined' ) { 
//	document.getElementById("share").innerHTML = '<a href="' + data.share + '" target="_blank"><img src="//blog.xtradio.org/wp-content/themes/xtradio/images/social_soundcloud.png" height="40" width="40" title="' + data.artist + ' - ' + data.song + ' on Soundcloud" ></a>'
//	$("#share").show();
//	}
//	else {
	$("#share").hide();
//	}

	if ( typeof data.lenght !== 'undefined' ) {
	document.getElementById("title").innerHTML = title + ' (' + data.lenght + ')';

        var ongoing = data.secs - data.remaining
    $("#progressbar").val(ongoing);
    $("#progressbar").attr("max", data.secs);
                        var progressbar = $('#progressbar'),
                                max = data.secs,
                                time = 1000,
                        value = progressbar.val();


                    var loading = function() {
                        value += 1;
                        addValue = progressbar.val(value);

                        if (value == max) {
                            clearInterval(animate);
                        }
                    };

                    var animate = setInterval(function() {
                        loading();
                    }, time);


	}
	else {
	document.getElementById("title").innerHTML = title;
	}

	var img = data.image;

	if ( typeof data.remaining !== 'undefined' ) {
	reload = data.remaining * 1000 + 1000;
	setTimeout( "nowplaying()", reload )
	}
	else { reload = "10000";
	    setTimeout( "nowplaying()", reload );
}
    document.getElementById("artist").innerHTML ='<a href="http://google.com/search?q=' + encodeURIComponent(artist) + '" target="_blank">' + artist + '</a>';
    document.getElementById("albumart").innerHTML = '<img src="' + img + '" width=250 height=250 title="' + artist  + title + '" />';

    document.getElementById("barSongInfo").innerHTML = artist + ' - ' + title;
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

};
