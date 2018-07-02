define([
    "jquery",
    "jquery.doubletap",
    "jquery.panzoom"
    ], function ($) {

    "use strict";

    /*
        OneZoom 1.0.0 Usage
        Yang@onerockwell
    */

    var OneZoomView = Backbone.View.extend({
        
        initialize: function (settings) {
            var self = this;
            self.zoomEngaging = false;
            self.$productMedia = self.$el;
            self.$mainImage = settings.mainImage;
            self.$thumbImage = settings.thumbImage;
            
            self.buildDesktopZoom();
            self.buildMobileZoom();
            
        },

        events: {
            'click .image-slide' : 'desktopZoomHandle',
            'click #onezoom.opened' : 'desktopZoomClose',
            'doubletap .image-slide' : 'mobileZoomHandle',
            'doubletap #onezoom-mobile' : 'mobileZoomHandle',
            'click .onezoom-close': 'mobileZoomeOut'
        },
        
        buildDesktopZoom: function(){
            var self = this;
            self.$zoomContainer = $('<div id="onezoom"></div>');
            self.$zoomContainer.appendTo(self.$productMedia);
        },
        
        buildMobileZoom: function(){
            var self = this;
            self.zoomMobileEngaging = false;
            self.$zoomMobileContainer = $('<div id="onezoom-mobile"></div>');
            self.$zoomMobileContainer.appendTo(self.$productMedia);
        },
        
        desktopZoomHandle: function(e){
            var self = this;
            e.preventDefault();
            if (!self.isMobile()) {
                var $curr = $(e.currentTarget);
                var $zoomImage = $('<img class="zoomed-image" src="' + $curr.attr('href') + '" />');
                
                self.$zoomContainer.html($zoomImage);
                
                if (!self.zoomEngaging) {
                    self.zoomStatus('engage');
                    self.$zoomContainer.addClass('opened');
                }
            }
        },
        
        mobileZoomHandle: function(e){
            var self = this;
            if (self.isMobile()) {
                if (self.$zoomMobileEngaging) {
                    self.mobileZoomeOut();
                } else {
                    self.mobileZoomeIn(e);
                }
            }
        },
        
        mobileZoomeIn: function(e){
            var self = this;
            var $curr = $(e.currentTarget);
            var $currImage = $curr.find('img');
            var $bigImage = $('<img src="' + $curr.attr('href') + '" />');

            self.$zoomMobileCloseIcon = $('<div class="onezoom-close"></div>');
            self.$zoomMobileContainer.addClass('opened').html($bigImage);
            self.$zoomMobileContainer.prepend(self.$zoomMobileCloseIcon);
            
            // get proper coordinates for touchend event
            if (e.changedTouches) {
                e = e.changedTouches[0];
            }
            
            $bigImage.load(function(){
                
                console.log($bigImage.width());
                
                $bigImage.panzoom({
                    contain: 'automatic',
                    minScale: 1,
                    maxScale: 5
                });
                
                var rate = $bigImage.width() / $currImage.width();
                var pan = {
                    x: (self.$mainImage.offset().left - e.pageX) * rate + ($currImage.width() / 2),
                    y: (self.$mainImage.offset().top - e.pageY) * rate + ($currImage.height() / 2)
                };
                $bigImage.panzoom('pan', pan.x, pan.y);
            })
            
            // mark as zoomed
            this.$zoomMobileEngaging = true;
        },
        
        mobileZoomeOut: function(e){
            var self = this;
            if (!this.$zoomMobileContainer) {
                return false;
            }
            this.$zoomMobileContainer.removeClass('opened');
            self.$zoomMobileEngaging = false;
        },
        
        desktopZoomClose: function(e){
            var self = this;
            self.$zoomContainer.removeClass('opened');
            self.zoomStatus('disengage');
        },
        
        zoomStatus: function(opt){
            var self = this;
            if (opt == 'engage') {
                self.zoomEngaging = true;
                $('html').addClass('zooming');
            } else if (opt == 'disengage'){
                self.zoomEngaging = false;
                $('html').removeClass('zooming');
            }
        },
        
        isMobile: function () {
            var self = this;
            var w = $(window).width();
            if (w < ORW.responsiveSizes.tablet) {
                return true;
            }
            return false;
        }
        
    });

    var OneZoom = {
        init: function (settings) {
            return new OneZoomView(settings);
        }
    }

    return OneZoom;


});