define([
	"jquery",
    "vimeo"
    // "modernizr",
    // "modernizr_autoplay"
], function ($, Player) {

	"use strict";

	/*
		OneVideo 1.2.0 Usage
		Yang @onerockwell
  	*/

  	var OneVideoView = Backbone.View.extend({
		
		initialize: function (settings) {
			var self = this;
            self.$videoBoxes = self.$el;
            self.isResponsive = settings.isResponsive || false;
            
            self.initVideos();
		},

		events: {

		},
        
        initVideos: function() {
            var self = this;
			
            _.each(self.$videoBoxes, function(box){
                var $box = $(box);
                var boxId = $box.attr('id');
                var type = $box.data('video-type');
                var videoId = $box.data('video-id');
                var videoSrc = $box.data('video-src');
                if (type == 'vimeo') {
					// Vimeo videos
                    self.loadVimeoPlayer(videoId,videoSrc,$box,boxId);
                } else {
                    // Self-host videos
                    self.loadHostPlayer(videoId,videoSrc,$box,boxId);
                }
            });
        },
        
        isMobile: function () {
            var self = this;
            var w = $(window).width();
            if (w <= ORW.responsiveSizes.tablet) {
                return true;
            }
            return false;
        },
		
		isTablet: function () {
			var self = this;
            var w = $(window).width();
            if (w <= ORW.responsiveSizes.tablet && w >= ORW.responsiveSizes.phone) {
                return true;
            }
            return false;
		},
        
        loadHostPlayer: function(video_id,video_src,$video_box,video_box_id){
            var self = this, id = '', $videoWrapper = $video_box;
            var videoRatio = $videoWrapper.data('ratio') ? $videoWrapper.data('ratio') : 0.6; // 0.6 is default for product video
            var $playerCtl = $videoWrapper.siblings('.video-controls');
            var responsive = function(r){
                var wrapperRatio = $videoWrapper.width()/$videoWrapper.height();
                // console.log(wrapperRatio + '/' + r);
                if (wrapperRatio >= r) {
                    $videoWrapper.find('video').css({
                        'width' : '100%',
                        'height': $videoWrapper.width()/r
                    });
                } else {
                    $videoWrapper.find('video').css({
                        'height' : '100%',
                        'width': $videoWrapper.height()*r
                    });
                }
            };
            
            if (self.isMobile()) {
                var $video = $('<video loop><source src="' + video_src + '" type="video/mp4"></video>');
                $playerCtl.text('Play');
                $playerCtl.removeClass('playing').addClass('paused');
            } else { //autoplay
                var $video = $('<video  loop><source src="' + video_src + '" type="video/mp4"></video>');
            }
            
            $video_box.html($video);
            
            var theVideo = $video[0]; 
            theVideo.muted;
            $video.on('play', function() {
                $video.isPlaying = true;
                $playerCtl.text('Pause');
                $playerCtl.removeClass('paused').addClass('playing');
				$video.isPlaying = true;
				if (self.isMobile()) {
					$video_box.find('video').css({
						'opacity' : '1'
					})
				}
                console.log('play the video!');
            });
            $video.on('pause', function() {
                $video.isPlaying = false;
                $playerCtl.text('Play');
                $playerCtl.removeClass('playing').addClass('paused');
				$video.isPlaying = false;
				if (self.isMobile()) {
					$video_box.find('video').css({
						'opacity' : '0'
					})
				}
                console.log('pause the video!');
            });
            
            if ($playerCtl.length) {
                $playerCtl.text('Pause');
                $playerCtl.removeClass('paused').addClass('playing');
                $playerCtl.on('click', function(){
                    if ($video.isPlaying) {
                        theVideo.pause();
                        $playerCtl.text('Play');
                        $playerCtl.removeClass('playing').addClass('paused');
                    } else {
                        theVideo.play();
                        $playerCtl.text('Pause');
                        $playerCtl.removeClass('paused').addClass('playing');
                    }
                })
            }
            
            $video.on('loadstart', function(){
                if (self.isResponsive) {
                    responsive(videoRatio);
                }
                console.log('init video');
            })
            
            if (self.isResponsive) {
                $(window).resize(function() {
                    clearTimeout(id);
                    id = setTimeout(function(){
                        responsive(videoRatio);
                    }, 400);
                });
            }
        },
        
        loadVimeoPlayer: function(video_id,video_src,$video_box,video_box_id){
            var self = this, id = '', $videoWrapper = $video_box;
            var videoRatio = $videoWrapper.data('ratio') ? $videoWrapper.data('ratio') : 0.6; // 0.6 is default for product video
            var $playerCtl = $videoWrapper.siblings('.video-controls');
            var responsive = function(r){
                var wrapperRatio = $videoWrapper.width()/$videoWrapper.height();
                // console.log(wrapperRatio + '/' + r);
                if (wrapperRatio >= r) {
                    $videoWrapper.find('iframe').css({
                        'width' : '100%',
                        'height': $videoWrapper.width()/r
                    });
                } else {
                    $videoWrapper.find('iframe').css({
                        'height' : '100%',
                        'width': $videoWrapper.height()*r
                    });
                }
            };
            
            if (self.isMobile()) {

                // var vmplayer = new Player(video_box_id, options);
                var $iframe = $('<iframe frameborder="0" src="' + video_src + '?title=0&amp;byline=0&amp;controls=0">');
                $video_box.html($iframe);
                var vmplayer = new Player($iframe);
            } else {
                var $iframe = $('<iframe frameborder="0" src="' + video_src + '?title=0&amp;byline=0&amp;portrait=1&amp;autoplay=1&amp;loop=1&amp;controls=0&amp;background=1">');
                $video_box.html($iframe);
                var options = {
                    id: video_id,
                    byline: false,
                    portrait: false,
                    autoplay: true,
                    title: false,
                    loop: true,
                };
                var vmplayer = new Player($iframe, options);
            }
			
			if ($playerCtl.length) {
				
				if (!self.isMobile()) {
					$playerCtl.text('Pause');
					$playerCtl.removeClass('paused').addClass('playing');
					$playerCtl.on('click', function(){
						if (vmplayer.isPlaying) {
							vmplayer.pause();
							$playerCtl.text('Play');
							$playerCtl.removeClass('playing').addClass('paused');
						} else {
							vmplayer.play();
							$playerCtl.text('Pause');
							$playerCtl.removeClass('paused').addClass('playing');
						}
					})
				} else if (self.isTablet()) {
					$playerCtl.text('Play');
					$playerCtl.removeClass('playing').addClass('paused');
					$playerCtl.on('click', function(){
						if (vmplayer.isPlaying) {
							vmplayer.pause();
						} else {
							vmplayer.play();
						}
					})
				} else {
					$playerCtl.text('Play');
					$playerCtl.removeClass('playing').addClass('paused');
					$playerCtl.on('click', function(){
						if (vmplayer.isPlaying) {
							vmplayer.pause();
						}
						vmplayer.play();
					})
				}
				
			}
			
			vmplayer.setVolume(0);
			vmplayer.on('play', function() {
				vmplayer.isPlaying = true;
                vmplayer.setVolume(0);
				if (self.isMobile()) {
					$video_box.find('iframe').css({
						'opacity' : '1'
					})
					$playerCtl.css({
						'z-index' : '3'
					});
					$playerCtl.text('Pause');
					$playerCtl.removeClass('paused').addClass('playing');
				}
				console.log('played vm video!');
			});
			vmplayer.on('pause', function() {
				vmplayer.isPlaying = false;
				if (self.isMobile()) {
					$video_box.find('iframe').css({
						'opacity' : '0'
					});
					$playerCtl.text('Play');
					$playerCtl.removeClass('playing').addClass('paused');
				}
				console.log('pause vm video!');
			});
            vmplayer.on('loaded', function() {
                vmplayer.setVolume(0);
                vmplayer.setLoop(1);
                if (!self.isMobile()) {
                    vmplayer.play();
                }
                $(video_box_id).find('iframe').css('opacity', 1);
                if (self.isResponsive) {
                    responsive(videoRatio);
                }
                console.log('init vm video');
            });
            
            if (self.isResponsive) {
                $(window).resize(function() {
                    clearTimeout(id);
                    id = setTimeout(function(){
                        responsive(videoRatio);
                    }, 400);
                });
            }
        },
		
		destroy: function() {
            var self = this;
            self.undelegateEvents();
        }

	});

	var OneVideo = {
		init: function (settings) {
			return new OneVideoView(settings);
		}
	}

	return OneVideo;


});