$(document).ready(function() {

	var container = $('.container');
	//var cover = $('.cover');
	var play = $('#play');
	var pause = $('#pause');
	var song;
	var duration;

	//var mute = $('#mute');
	//var muted = $('#muted');
	//var close = $('#close');

	var playAudio = function(audio_name, element){
		e.preventDefault();
		song = new Audio('music/'+audio_name+'.ogg','music/'+audio_name+'.mp3');
		duration = song.duration;
		if (song.canPlayType('audio/mpeg;')) {
				song.type= 'audio/mpeg';
				song.src= 'music/'+audio_name+'.mp3';
		} else {
				song.type= 'audio/ogg';
				song.src= 'music/'+audio_name+'.ogg';
		}
		container.css('display','block');
		song.play();
		$("#seek").attr("max", parseInt(song.duration, 10));
		$(this).replaceWith('<a class="button gradient" id="pause" href="" title=""></a>');

		play.on('click', function(e) {
			e.preventDefault();
			song.play();
			$("#seek").attr("max", parseInt(song.duration, 10));
			$(this).replaceWith('<a class="button gradient" id="pause" href="" title=""></a>');
			//container.addClass('containerLarge');
			//cover.addClass('coverLarge');
			//$('#close').fadeIn(300);
		});

		pause.on('click', function(e) {
			e.preventDefault();
			song.pause();
			$(this).replaceWith('<a class="button gradient" id="play" href="" title=""></a>');

		});

		song.addEventListener('timeupdate',function (){
			curtime = parseInt(song.currentTime, 10);
			$("#seek").val(curtime);
		});

		song.addEventListener('ended',function (){
			$("#seek").val(0);
			$('#play').replaceWith('<a class="button gradient" id="play" href="" title=""></a>');
			container.css('display','none');
		});
	};






/*
	mute.on('click', function(e) {
		e.preventDefault();
		song.volume = 0;
		$(this).replaceWith('<a class="button gradient" id="muted" href="" title=""></a>');

	});

	muted.on('click', function(e) {
		e.preventDefault();
		song.volume = 1;
		$(this).replaceWith('<a class="button gradient" id="mute" href="" title=""></a>');

	});

	$('#close').click(function(e) {
		e.preventDefault();
		//container.removeClass('containerLarge');
		//cover.removeClass('coverLarge');
		song.pause();
		song.currentTime = 0;
		$('#pause').replaceWith('<a class="button gradient" id="play" href="" title=""></a>');
		$('#close').fadeOut(300);
	});
*/










});
