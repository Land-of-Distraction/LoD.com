define([
    'jquery',
    'module-oneVideo',
    'slick',
    'jquery.waypoints',
    'jquery.viewport'
], function ($, OneVideo) {

    "use strict";

    var ViewHome = Backbone.View.extend({

        initialize: function (opts) {
            var self = this;
            self.$content = self.$el;
            self.$body = $('body');
            self.$header = self.$body.find('.site-header');
            self.$hpModule = self.$content.find('.module');

            self.imageModule();
            self.initVideo();
            self.headerColor();
        },
        
        events: {

        },

        headerColor: function(){
            var self = this;

            var headerColorChange = function($module){
                var moduleHeaderColor = $module.data('header-color');
                var headerColor = "white-header black-header";
                self.$body.removeClass(headerColor).addClass(moduleHeaderColor);
            }

            //Init
            headerColorChange(self.$hpModule.first());

            // Header color update
            self.$hpModule.waypoint({
                handler: function(direction) {
                    if (direction == 'down') {
                        var $currentModule = $(this.element);
                        headerColorChange($currentModule);
                    }
                },
                offset: '0'
            });
            self.$hpModule.waypoint({
                handler: function(direction) {
                    if (direction == 'up') {
                        var $currentModule = $(this.element);
                        headerColorChange($currentModule);
                    }
                },
                offset: '-100%'
            });
        },

        imageModule: function(){
            var self = this;
            var events = {

            };

            self.$imageModule = self.$content.find('.layout-4').first();
            self.$sliderModule = self.$imageModule.find('.images-blocks').first();
            self.$sliderModule.slick({
                dots:false,
                arrows: true,
                infinite: true,
                speed: 400,
                slidesToShow: 1,
                centerMode: true,
                variableWidth: true
            });

            // Update and delegate adding events
            _.extend(self.events, events);
                self.delegateEvents();
        },

        initVideo: function(){
            var self = this;
            self.$videoBoxes = self.$content.find('.video-box');
            
            OneVideo.init({
                el: self.$videoBoxes
            });

            if(self.isMobile()){

                _.each(self.$content.find('.poster-image'), function(posterImgs){
                    var thePoster = $(posterImgs).attr('data-poster');
                    if(typeof thePoster !== 'undefined' && thePoster.length){
                        $(posterImgs).css({ 'background-image': 'url('+ thePoster +')' });
                    }
                    thePoster = "";
                });
            }
        },
        
        isMobile: function () {
            var self = this;
            var w = $(window).width();
            if (w <= ORW.responsiveSizes.tablet) {
                return true;
            }
            return false;
        },

    });

    return ViewHome;

});