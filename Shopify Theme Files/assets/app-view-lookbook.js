define([
    'jquery',
    'module-oneSocial',
    'jquery.viewport',
    'slick'
], function ($, OneSocial) {

    "use strict";

    var ViewLookbook = Backbone.View.extend({

        initialize: function (opts) {
            var self = this;
            
            self.$pager = self.$el.find('.collection-pagination');
            self.$productGrid = self.$el.find('.lookbook-products');
            self.$products = self.$productGrid.find('.item');
            
            self.quickview();
            self.infinityScroll();
        },

        events: {
            
        },
        
        infinityScroll: function () {
            var self = this;
            var loadMore = function(prev){ // Passing param to determin whether loading next page or prev
                var addPage = function(d){
                    var $content = $(d).find('.lookbook-main');
                    var $pager = $content.find('.collection-pagination');
                    var $newItems = $content.find('.lookbook-products .item');
                    var loadingPageNum = ORW.utilities.getUrlParam(self.url,'page');
                    var afterAppend = function (index, item) {
                        
                        $(item).data('page',loadingPageNum);
                        
                        if (index == $newItems.length-1) {
                            // Perform re-init of product grid if needed
                            ORW.rebuildLookbook();
                            ORW.isLoading = false;
                            
                            if (prev) {
                                loadMore(true); // Recursive!!
                                $('html, body').animate({
                                    scrollTop: self.$productGrid.prop("scrollHeight")
                                }, 0);
                            } else {
                                return false;
                            }
                        }
                    }
                    
                    ORW.pagerStack.push(self.url);

                    if (!ORW.isFinished) {
                        self.$pager = $pager;
                        $newItems.prependTo(self.$productGrid).each(afterAppend);
                    } else {
                        self.$pager.replaceWith($pager);
                        self.$pager = $pager;
                        $newItems.appendTo(self.$productGrid).each(afterAppend);
                        window.history.pushState(null, null, self.url);
                    }
                    
                }
                
                // Start of Load More
                if (!ORW.isLoading) {
                    var status = prev ? 'prev' : 'next';
                    if (ORW.isFinished) {
                        // Load next page
                        self.url = self.$pager.find('.next a').length ? self.$pager.find('.next a').attr('href') : '';
                    } else {
                        // Load prev page
                        self.url = self.$pager.find('.prev a').length ? self.$pager.find('.prev a').attr('href') : '';
                    }

                    if ($.inArray(self.url, ORW.pagerStack) == -1 && self.url) {
                        console.log('load ' + status);
                        ORW.isLoading = true;
                        $.get(self.url).done(addPage);
                    } else {
                        if (prev) {
                            // Loading Prev Finished
                            ORW.isFinished = true;
                            console.log('load prev finished');
                            
                            // Check if need to load a look detial modal
                            var lookHandle = ORW.utilities.getUrlParam(undefined,'look');
                            if (lookHandle && lookHandle != 'false') {
                                setTimeout(function() {
                                    $('[data-handle=' + lookHandle + ']').trigger('click');
                                }, 800);
                            }
                            
                        } else {
                            $('#loadmore').addClass('disabled');
                            return false;
                        }
                    }
                }
            }
            
            // Load Prev Page Trigger
            loadMore(true);
            
            // Load Next Page Triggers
            if ($('#loadmore:in-viewport').length) {
		    	loadMore();
		    }
		    $(window).on('scroll.listview', function () {
				if ($('#loadmore:in-viewport').length) {
			    	loadMore();
			    }
			});
        },
        
        quickview: function(){
            var self = this;
            self.qvBuild();
            
            var events = {
                'click .lookbook-products .item' : 'qvHandle',
                'click #quick-view-modal .close' : 'qvHandle'
            };
            // Update and delegate adding events
			_.extend(self.events, events);
			self.delegateEvents();
        },
        
        qvBuild: function(){
            var self = this;
            var html = '<div id="quick-view-modal"><a class="close">close</a><div class="slider-wrapper">';
                _.each(self.$productGrid.find('.item'),function(item){
                    html += '<div class="slide-item">' + $(item).html() + '</div>';
                });
                html += '</div></div>';
            
            self.overlayEngaged = false;
            self.$overlay = $(html);
            self.$productGrid.after(self.$overlay);

            self.$slider = self.$overlay.find('.slider-wrapper').slick({
                zIndex: 100,
                centerMode: true,
                slidesToShow: 1,
                centerPadding: '60px',
                variableWidth: true,
                infinite: false,
                responsive: [
                    {
                        breakpoint: 768,
                        settings: {
                            arrows: false,
                            centerMode: true,
                            centerPadding: '40px',
                            slidesToShow: 1
                        }
                    }
                ]
            });
        },
        
        qvHandle: function(e){
            e.preventDefault();
            var self = this;
            var currentUrl,newurl;
            currentUrl = newurl = window.location.href;
            
            // Close if opened
            if (self.$overlay.hasClass('active')) {
                self.$overlay.removeClass('active');
                newurl = ORW.utilities.updateUrlParam(currentUrl,'look','false');
                window.history.pushState(null, null, newurl);
                return false;
            }
            
            var $curr = $(e.currentTarget);
            var index = $curr.parent().find('.item').index($curr);
            var handle = $curr.data('handle');
            var pageIndex = $curr.data('page');
            
            
            if (pageIndex) {
                currentUrl = ORW.utilities.getUrlParam(currentUrl,'page', pageIndex);
            }
            newurl = ORW.utilities.updateUrlParam(currentUrl,'look',handle);
            window.history.pushState(null, null, newurl);
            
            if (!ORW.isLoading) {
                self.$overlay.addClass('active');
                self.$slider.resize();
                self.$slider.slick('slickGoTo', index);
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
        
        destroy: function() {
            var self = this;
            self.undelegateEvents();
            self.$overlay.remove();
            $(window).off('scroll.listview');
        }

    });

    return ViewLookbook;

});