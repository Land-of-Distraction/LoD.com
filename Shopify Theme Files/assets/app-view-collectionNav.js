define([
    'jquery',
    'jquery.scrolltofixed'
], function ($) {

    "use strict";

    var ViewCollectionNav = Backbone.View.extend({

        initialize: function (opts) {
            var self = this;
            self.$nav = self.$el;
            self.$navToggle = self.$nav.find('.collection-nav-toggle');
            self.$navWrapper = self.$nav.find('.collection-nav-wrapper');
            self.$sorter = self.$nav.find('.collection-nav-block.sorting');
            self.$filter = self.$nav.find('.collection-nav-block.filters');
            self.$body = $('body');
            self.$header = $('header.site-header');
            self.$footer = $('footer.site-footer');
            
            // self.navFix();
            self.initSorting();
            self.initFiltering();
            
            // Click outside to close
            $(window).on('click', function (e) {
                self.$body.removeClass('collection-nav-opened');
                self.$nav.removeClass('opened');
            });
            $('.collection-nav').on('click', function(e){
                e.stopPropagation();
            });
        },

        events: {
            'click .collection-nav' : function(e){
                console.log('click on collection nav');
                e.stopPropagation();
            },
            'click .collection-nav-toggle' : function(e){
                e.preventDefault();
                e.stopPropagation();
                var self = this;
                var $curr = $(e.currentTarget);

                if (self.$nav.hasClass('opened')) {
                    self.$nav.removeClass('opened');
                    self.$body.removeClass('collection-nav-opened');
                } else {
                    self.$body.addClass('collection-nav-opened');
                    self.$nav.addClass('opened');
                }
            },
            'click .collection-nav-close' : function(e){
                var self = this;
                var $curr = $(e.currentTarget);
                self.$body.removeClass('collection-nav-opened');
                self.$nav.removeClass('opened');
            }
        },
        
        navFix: function(){
            var self = this,
                lastScrollTop = 0;

            self.$nav.scrollToFixed({
                removeOffsets: true,
                spacerClass: 'fixed',
                zIndex: 999,
                dontSetWidth: true,
                marginTop: self.$header.outerHeight(true) + 10,
                limit: function() {
                    var limit = self.$footer.offset().top - self.$nav.outerHeight(true);
                    return limit;
                }
            });
        },
        
        initSorting: function(){
            var self = this;
            var $clearAllSort = self.$sorter.find('.clear-all-sort');
            var shoppableProductsTag = 'shoppable';
            var events = {
                'click .collection-nav-block.sorting a' : function(e){
                    // e.preventDefault();
                    // var $curr = $(e.currentTarget),
                    //     sortVal = $curr.attr('href');
                    
                    // if (sortVal != '') {
                    //     $curr.addClass('active').siblings('a').removeClass('active');
                    //     Shopify.queryParams.sort_by = $curr.attr('href');
                    // } else {
                    //     delete Shopify.queryParams.sort_by;
                    // }
                    
                    // location.search = $.param(Shopify.queryParams);
                }
            }
            
            // Active Status
            if (Shopify.queryParams.sort_by) {
                self.$sorter.find('a[href="'+shoppableProductsTag+'?sort_by=' + Shopify.queryParams.sort_by + '"]').addClass('active');
                $clearAllSort.removeClass('hide');
            }
            
            // Update and delegate adding events
            _.extend(self.events, events);
            self.delegateEvents();
        },
        
        initFiltering: function(){
            var self = this;
            var $filterSelects = self.$filter.find('select');
            var shoppableProductsTag = 'shoppable';
            var events = {
                'click .collection-nav-block.filters a' : function(e){
                    e.preventDefault();
                    var $curr = $(e.currentTarget),
                        $filterParent = $curr.parents('.filter-swatches'),
                        $fitlerSelect = $filterParent.siblings('select'),
                        filterVal = $curr.attr('href');
                        
                    if ($curr.hasClass('disabled')) {
                        return false;
                    }
                    
                    if (filterVal != '') {
                        $curr.addClass('active').siblings('a').removeClass('active');
                        $fitlerSelect.val(filterVal).change();
                    } else {
                        var newURL = '/collections/' + Shopify.collectionHandle;
                        var search = $.param(Shopify.queryParams);
                        if (search.length) {
                            newURL += '?' + search;
                        }
                        location.href = newURL;
                    }
                    
                },
                'change .collection-nav-block.filters select' : function(e){
                    delete Shopify.queryParams.page;
                    var newTags = [];
                    _.each($filterSelects, function(select){
                        if ($(select).val()) {
                            newTags.push($(select).val());
                        }
                    });
                    newTags.push(shoppableProductsTag);
                    if (Shopify.collectionHandle) {
                        // PLP
                        var newURL = '/collections/' + Shopify.collectionHandle;
                        var search = $.param(Shopify.queryParams);
                        
                        if (newTags.length) {
                            newURL += '/' + newTags.join('+');
                        }
                        if (search.length) {
                            newURL += '?' + search;
                        }
                        
                        location.href = newURL;
                    } else {
                        // Search
                        if (newTags.length) {
                            Shopify.queryParams.constraint = newTags.join('+');
                        } else {
                            delete Shopify.queryParams.constraint;
                        }

                        location.search = $.param(Shopify.queryParams);
                    }
                }
            }
            
            // Update and delegate adding events
            _.extend(self.events, events);
            self.delegateEvents();
        },
        
        destroy: function() {
            var self = this;
            self.undelegateEvents();
        }

    });

    return ViewCollectionNav;

});