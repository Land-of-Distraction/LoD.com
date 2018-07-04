define([
    'jquery',
    'module-oneSwatches',
    'module-oneZoom',
    'module-oneSocial',
    'jquery.scrolltofixed',
    'jquery.waypoints',
    'jquery.panelsnap',
    'slick'
], function ($,OneSwatches,OneZoom,OneSocial) {

    "use strict";

    var ViewProduct = Backbone.View.extend({

        initialize: function(opts){
            var self = this,
                selectors = {
                    addToCart: '[data-add-to-cart]',
                    addToCartText: '[data-add-to-cart-text]',
                    comparePrice: '[data-compare-price]',
                    comparePriceText: '[data-compare-text]',
                    originalSelectorId: '[data-product-select]',
                    priceWrapper: '[data-price-wrapper]',
                    productFeaturedImage: '[data-product-featured-image]',
                    productJson: '[data-product-json]',
                    productPrice: '[data-product-price]',
                    productThumbs: '[data-product-single-thumbnail]',
                    singleOptionSelector: '[data-single-option-selector]'
                };

            self.$content = self.$el;
            self.$productInfo = self.$content.find('.product-info');
            self.$media = self.$content.find('.product-media');
            self.$relatedProducts = self.$content.find('.related-products');
            self.$mainImage = self.$media.find('#ProductPhoto');
            self.$thumbImage = self.$media.find('#ProductThumbs');
            self.$mediaSlider = self.$mainImage.find('.images-wrapper');
            self.$socialIcons = self.$content.find('.one-social');

            self.$utilityToggle = self.$content.find('.content-toggle');
            self.$utilityBox = self.$content.find('.pdp-utility');
            self.utilityBodyClass = 'utility-open';

            self.isGiftCard = self.$content.hasClass('gift-card');
            self.productJSON = $(selectors.productJson).length ? JSON.parse($(selectors.productJson).html()) : false;


          setTimeout(function () {
          	$('ul.cross-sell li .money a').each(function (index, element) {
              element.innerHTML = parseInt(element.innerHTML.replace(/[^0-9\.-]+/g,"")) + " USD"
            });
          }, 1000);

          	setTimeout(function () {
                self.swatches();
                self.productMedia();
                self.productInfoFix();
                self.zoom();
                self.social();
                self.pdpUtilities();
            }, 400);


            if (!self.isGiftCard) {
                self.tabs();
                self.measuresToggle();
            }

            $(window).on('click touchstart', function (e) {
                $('body').removeClass('related-open');
            });

            $('.block-minicart').on('click', function (e) {
                $('body').removeClass('related-open');
            });

            $('.content-toggle').on('click', function (e) {
                $('body').removeClass('related-open');
            });

            self.$productInfo.find('.scroll-to').on('click touchstart', function (e) {
                self.closePDPUtilities();
            });


        },

        events: {
            'click .scroll-to' : function(e){
                e.preventDefault();
                e.stopPropagation();
                $('body').toggleClass('related-open');
            },
            'click .related-products .utility-close' : function(e){
                $('body').removeClass('related-open');
            }
        },

        social: function(){
            var self = this;
            var brand = 'Land of Distraction';
            var description = self.$content.find('.product-description .tabs-content .active').length ? self.$content.find('.product-description .tabs-content .active').text() : self.$content.find('.product-description .tab-container').text();
            var events = {
                'click .share-title':function(e){
                    self.$socialIcons.toggleClass('active');
                },
            };

            // Update and delegate adding events
            _.extend(self.events, events);
            self.delegateEvents();

            OneSocial.init({
                el: self.$el,
                title: self.$content.find('h1').text(),
                description: description,
                image: function(){
                    var $image = $('<img>');
                    if (self.isMobile()) {
                        $image = self.$content.find('.slick-active img');
                    } else {
                        $image = self.$content.find('.ps-active img');
                    }
                    return $image.prop('src');
                },
    			pinterestTag: '#' + brand,
    			twitterTag: '@' + brand,
            });

        },

        swatches: function(){
            var self = this;
            // Init Shopify option selector
            // Option init and Swatch init needed to be separated

            new Shopify.OptionSelectors('productSelect', {
                product: self.productJSON,
                onVariantSelected: ShopifyAPI.selectCallback,
                enableHistoryState: true
            });

            OneSwatches.init({ el: self.$content, preSelect: true, product: self.productJSON });

            //preselect color variant
            // self.$productInfo.find('.single-option-selector').first().trigger('change');
        },

        productInfoFix: function(){
            var self = this;
            var marginOffset = 0;
            var $elemToFix = self.$productInfo;

            if(!self.isMobile() && false){
                self.$currentFixItems = $elemToFix.scrollToFixed({
                    removeOffsets: true,
                    spacerClass: 'fixed',
                    fixed: function(){
                        $(this).removeClass('unFixed');
                        $(this).addClass('isFixed');
                    },
                    unfixed: function() {
                        $(this).removeClass('isFixed');
                        $(this).addClass('unFixed');
                    },
                    limit: function() {
                        var limit = $('#fix-stopper').offset().top - $elemToFix.outerHeight() - marginOffset;
                        // console.log('limit at ' + limit);
                        if (!limit) {
                            limit = 0.01;
                        }
                        return limit;
                    },
                    zIndex: 1,
                });
            }

        },

        productMedia: function(){
            var self = this;
            var buildNav = function($images){
                if ($images.length) {
                    // rebuild
                    var $nav = self.$media.find('.image-nav');

                    // var html = '';
                    // if (!$nav.length) {
                    //     $nav = $('<div class="image-nav"></div>');
                    //     $nav.appendTo(self.$media);
                    //     $nav.scrollToFixed({
                    //         removeOffsets: true,
                    //         spacerClass: 'fixed',
                    //         //dontSetWidth: 'not set',
                    //         limit: function() {
                    //             var limit = $('#fix-stopper').offset().top - $nav.outerHeight();
                    //             if (!limit) {
                    //                 limit = 0.01;
                    //             }
                    //             return limit;
                    //         },
                    //         zIndex: 1,
                    //     });
                    // }
                    // _.each($images, function(image,index){
                    //     var $image = $(image),
                    //         num = index + 1;
                    //     html += '<div class="item" data-index="' + $image.data('index') + '">0' + num + '</div>';
                    // });
                    // $nav.html(html);

                    // Scroll to top after select since Image got updated
                    $('html, body').animate({
                        scrollTop: 0
                    }, 0);

                    $images.waypoint({
                        handler: function (direction) {
                            if (direction === 'down') {
                                var $image = $(this.element);
                                var $currNav = $nav.find('[data-index="' + $image.data('index') + '"]');
                                if ($currNav.length) {
                                    $currNav.siblings('.item').removeClass('active');
                                    $currNav.addClass('active');
                                }
                            }
                        },
                        offset: 0
                    });

                    $images.waypoint({
                        handler: function (direction) {
                            if (direction === 'up') {
                                var $image = $(this.element);
                                var $currNav = $nav.find('[data-index="' + $image.data('index') + '"]');
                                if ($currNav.length) {
                                    $currNav.siblings('.item').removeClass('active');
                                    $currNav.addClass('active');
                                }
                            }
                        },
                        offset: -20
                    });

                } else {
                    // build
                    // self.$media.append('<div class="image-nav"></div>');
                }
            }
            var updateNavi = function(selectedValue){
                selectedValue = selectedValue.replace(/\-| |\_|\//g,'').toLowerCase();
                var $filteredResult = self.$thumbImage.find('li').filter(function(index){
                    return $(this).data('option') == selectedValue;
                });
                // console.log($filteredResult);
                buildNav($filteredResult);
            }
            var filterSlider = function(selectedValue){
                selectedValue = selectedValue.replace(/\-| |\_|\//g,'').toLowerCase();
                var $filteredResult = self.$thumbImage.find('li').filter(function(index){
                    return $(this).data('option') == selectedValue;
                });
                // console.log($filteredResult);
                if ($filteredResult.length) {
                    self.$mediaSlider.slick('slickUnfilter');
                    self.$mediaSlider.slick('slickFilter', '[data-option="' + selectedValue + '"]');
                    self.$mediaSlider.slick('setPosition');
                }
            }

            self.pdpMobileSlider();

            $(window).on('resize',function(e){
                self.pdpMobileSlider();
            });

            var events = {
                'change .single-option-selector' : function(e) {
                    var $target = $(e.currentTarget),
                        val = !$target.val() && $target.data('value') ? $target.data('value') : $target.val(),
                        val = val.toLowerCase();

                    // Update slider
                    filterSlider(val);
                    updateNavi(val);
                },
                'click .image-nav .item' : function(e) {
                    // var $curr = $(e.currentTarget);
                    // $('html, body').animate({
                    //     scrollTop: self.$thumbImage.find('li[data-index="' + $curr.data('index') + '"]').offset().top
                    // }, 1000);
                }
            };

            // Desktop Image Slider
            // $('body').panelSnap({
            //     panelSelector: '#ProductThumbs > li.active',
            //     directionThreshold: 10,
            // });

            // Update Desktop Image Scroll Navigation
            // if (!self.isGiftCard) {
            //     buildNav(self.$thumbImage.find('li.active'));
            // }

            // Update Mobile Image slider when loaded
            filterSlider(self.$mediaSlider.data('selected'));

            // Update and delegate adding events
            _.extend(self.events, events);
            self.delegateEvents();
        },

        pdpMobileSlider: function(){
            var self = this;

            // if(self.isMobile()){
                if(!self.$mediaSlider.hasClass('slick-initialized')){
                    self.$mediaSlider.slick({
                        dots:false,
                        arrows: false,
                        infinite: true,
                        speed: 400,
                        slidesToShow: 1,
                        centerMode: false,
                        variableWidth: false
                    });
                }
            // }else{
                // if(self.$mediaSlider.hasClass('slick-initialized')){
                //     self.$mediaSlider.slick('unslick');
                // }
            // }

        },

        zoom: function(){
            var self = this;
            OneZoom.init({
                el: self.$media,
                mainImage: self.$mainImage,
                thumbImage: self.$thumbImage
            });
        },

        pdpUtilities: function(){
            var self = this;
            var events = {
                'click .content-toggle' : function(e){
                    e.preventDefault();
                    e.stopPropagation();

                    var $utilityDrawer = $(e.currentTarget).attr('href');

                    if($($utilityDrawer).length){
                        var $activeUtility = self.$utilityBox.filter('.open');


                        self.$utilityToggle.not(e.currentTarget).removeClass('active');
                        $(e.currentTarget).toggleClass('active');

                        self.$utilityBox.not(e.currentTarget).removeClass('open');
                        $($utilityDrawer).toggleClass('open');

                        if($($utilityDrawer).attr('id') == $activeUtility.attr('id')){
                            self.closePDPUtilities();
                        }else{
                            $('body').toggleClass(self.utilityBodyClass);
                        };
                    }
                },
                'click .utility-close': self.closePDPUtilities
            };

            // Update and delegate adding events
            _.extend(self.events, events);
            self.delegateEvents();

        },

        closePDPUtilities: function(){
            var self = this;

            console.log('closing opened utilities');
            self.$utilityToggle.removeClass('active');
            self.$utilityBox.removeClass('open');
            $('body').removeClass(self.utilityBodyClass);

            var events = {

            };

            // Update and delegate adding events
            _.extend(self.events, events);
            self.delegateEvents();
        },

        tabs: function(){
            var self = this;
            var tabSwitch = function($elem, className){
                $elem.addClass(className);
                $elem.siblings().removeClass(className);
            };
            var tabUpdate = function(e){
                var $curr = $(e.currentTarget);
                var $tabContainer = $curr.parents('.tab-container');
                var tabVal = $curr.attr('data-tab');
                var $activeTab  = $tabContainer.find('.tabs-content [data-tab="' + tabVal + '"]');

                tabSwitch($curr, 'active');
                tabSwitch($activeTab, 'active');
            };
            var events = {
                'click .tab-titles a' : function(e){
                    tabUpdate(e);
                }
            };
            // Update and delegate adding events
            _.extend(self.events, events);
            self.delegateEvents();
        },

        measuresToggle: function(){
            var self = this;

            var events = {
                'click .measures-toggle a' : function(e){
                    var $curr = $(e.currentTarget);
                    var $charts = self.$productInfo.find('.measurement');
                    var $elem = $charts.find('.chart');
                    var measuresVal = $curr.attr('data-show');

                    $curr.addClass('active');
                    $curr.siblings().removeClass('active');

                    $charts.find('.chart.' + measuresVal).addClass('active');
                    $elem.not('.' + measuresVal).removeClass('active');
                }
            };
            // Update and delegate adding events
            _.extend(self.events, events);
            self.delegateEvents();

        },

        responsive: function (flag) {
			// For window resize on Desktop
			var self = this,
			id = '',
            marginOffset = 0;

			function responsive(){
			    var $fixItems = self.$currentFixItems || false;
                if ($fixItems && $fixItems.css('position') == 'absolute') {
                    var limit = $('#fix-stopper').offset().top - $fixItems.outerHeight() - marginOffset;
                    var itemTop = $fixItems.offset().top;
                    // console.log('limit: ' + limit + ' / itemTop: ' + itemTop);
                    if (itemTop > limit) {
                        $fixItems.css({ top: limit });
                    }
                }
			};

			responsive();
            $(window).resize(function() {
                clearTimeout(id);
                id = setTimeout(function(){
                    console.log('window resized');
                    responsive();
                }, 400);
            });

		},

        isMobile: function () {
            var self = this;
            var w = $(window).width();
            if (w <= ORW.responsiveSizes.tablet) {
                return true;
            }
            return false;
        }

    });

    return ViewProduct;

});