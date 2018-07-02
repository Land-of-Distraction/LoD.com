define([
    'jquery',
    'module-oneExpand',
    'module-oneContact',
    'aos',
    'jquery.hoverintent',
    'jquery.scrolltofixed',
    'jquery.scrollLock'
], function ($, OneExpand, OneContact, AOS) {

    "use strict";

    var ViewHeader = Backbone.View.extend({

        initialize: function (opts) {
            
            console.log('init header');
            
			var self = this;
			self.$body = self.$el;
            self.$header = self.$body.find('header.site-header');
            self.$miniCart = self.$body.find('#MiniCart');
            self.$mobileNav = self.$body.find('#MobileNav');
            self.$navi = self.$header.find('nav');
            self.$search = self.$header.find('.block-search');
            self.$promoBanner = self.$header.find('.promo-banner');
            self.$footerNews = self.$body.find('.footer-newsletter');
			
            self.initNavi();
            self.initMiniCart();
            // self.initFixedHeader();
            self.initUtilities();
            // self.initCurrency();
            self.initMobileMenu();
            self.promoBanner();
            self.AnimateElementsbyAOS();
            self.newsletterForm();
            self.isIE();
            
            // Global events
            if (self.isMobile()) {
                $(window).on('touchstart', function (e) {
                    self.searchCtl(true);
                    self.miniCartCtl(true);
                    self.mobileMenuCtl(true);
                });
            } else {
                $(window).on('click touchstart', function (e) {
                    self.searchCtl(true);
                    self.miniCartCtl(true);
                    self.mobileMenuCtl(true);
                });
            }
            $(document).keyup(function(e) {
                if (e.keyCode == 27) { // escape
                    self.searchCtl(true);
                    self.miniCartCtl(true);
                    self.mobileMenuCtl(true);
                }
            });
            
		},

		events: {
            'drawer-opt' : 'bodyClassCtl',
            // 'menu-opt' : 'bodyClassCtl',
            'search-opt' : 'bodyClassCtl'
		},

        AnimateElementsbyAOS : function(e){
            var self = this;

            var events = {

            };

            AOS.init({
                offset: 1-0,
                duration: 200,
                easing: 'ease-in-out'
            });

        },

        promoBanner: function(){
            var self = this;

            var events = {
                'click .close-promo' : function(e){
                    // self.$promoBanner.slideUp(200);
                    $('body').removeClass('promo-banner-active');
                    self.$promoBanner.removeClass('activate').addClass('stop-showing');

                    if(!ORW.utilities.getCookie('promo_banner')){
                        ORW.utilities.setCookie('promo_banner','shown',0.02);
                    }
                }
            };

            if(self.$promoBanner.length > 0){
                if(!ORW.utilities.getCookie('promo_banner')){
                    $('body').addClass('promo-banner-active');
                    self.$promoBanner.addClass('activate');
                }else{
                    self.$promoBanner.addClass('stop-showing');
                }
            }

            var promoScrollToggle = function(){
                var lastScrollTop = 0;

                $(window).scroll(function(e){
                    if(!self.$promoBanner.hasClass('stop-showing') && self.$promoBanner.length > 0){
                        var st = $(this).scrollTop();
                        var pixelsScrolled = Math.abs(st - lastScrollTop);

                        if (st > lastScrollTop && lastScrollTop > self.$header.height() && pixelsScrolled > 10){//Down
                            $('body').removeClass('promo-banner-active');
                            self.$promoBanner.removeClass('activate');
                        } else if(lastScrollTop > self.$header.height() && pixelsScrolled > 10) {//Up
                            $('body').addClass('promo-banner-active');
                            self.$promoBanner.addClass('activate');
                        }
                        lastScrollTop = st;
                    }
                });
            };

            promoScrollToggle();
            
            // Update and delegate adding events
            _.extend(self.events, events);
            self.delegateEvents();

        },
        
        bodyClassCtl : function(e){
            // Please prevent operation on more then one drawer at the same time
            var self = this;
            var type = e.type;
            if ( type == 'search-opt' ) {
                self.$body.toggleClass('search-opt');
                if(self.$body.hasClass('search-opt')){
                    setTimeout(function(){
                        self.$search.find('.search-field').focus();
                    },500);
                }
            } else if (type == 'drawer-opt') {
                self.$body.toggleClass('drawer-opt');
                self.$body.toggleClass('show-overlay');
            } else {
                console.log('toggle body class');
                self.$body.toggleClass('show-overlay');
            }
        },
        
        initCurrency: function() {
            var self = this;
            self.$currencySwtich = $('#currencies').length ? $('#currencies') : false;
            
            if (self.$currencySwtich) {
                var events = {
                    'click .currency-list li' : function(e){
                        var $curr = $(e.currentTarget), value = $curr.data('value');
                        self.$currencySwtich.val(value).change();
                    },
                    'click .header-block.block-currency' : function(e){
                        e.preventDefault();
                        $(e.currentTarget).toggleClass('opened');
                    }
                }
                
                // Build list
                var currencyListHtml = '';
                currencyListHtml += '<ul class="currency-list">';
                _.each(self.$currencySwtich.find('option'), function(option){
                    var $option = $(option);
                    currencyListHtml +=     '<li data-value="' + $option.attr('value') + '"><span>' + $option.attr('value') + '</span></li>';
                });
                currencyListHtml += '</ul>';
                
                self.$header.find('.header-block.block-currency').append(currencyListHtml);
                self.$mobileNav.find('.mobile-block-currency .block-content').append(currencyListHtml);
                
                // Update and delegate adding events
                _.extend(self.events, events);
                self.delegateEvents();
            }
        },
        
        initNavi: function() {
            var self = this;
            var events = self.isTouch() ? {
                'touchstart header .block-mobile-nav' : function(e){
                    e.stopPropagation();
        			e.preventDefault();
                    self.mobileMenuCtl();
                },
                'touchstart #MobileNav .drawer-close' : function(e){
                    e.stopPropagation();
        			e.preventDefault();
                    self.mobileMenuCtl(true);
                },
                'touchstart #MobileNav' : function(e){
                    e.stopPropagation();
                }
            } : {
				'click header .block-mobile-nav' : function(e){
                    e.stopPropagation();
        			e.preventDefault();
                    self.mobileMenuCtl();
                },
                'click #MobileNav .drawer-close' : function(e){
                    e.stopPropagation();
        			e.preventDefault();
                    self.mobileMenuCtl(true);
                },
                'click #MobileNav' : function(e){
                    e.stopPropagation();
                }
			};
            
            // Build mobile Nav
            self.$mobileNav.find('.header-utilities').before(self.$navi.clone());

            
            var mobileNavExpand = OneExpand.init({
                el: self.$mobileNav.find('nav'),
                wrapperSlt: '.level-1',
                titleSlt: '.nav-link',
                contentSlt: '.children',
                activeClass: 'opened',
                trigger: 'touchstart',
                noAction: true,
                allowMultiple: false
            });
            
            var mobileMenuExpand = OneExpand.init({
                el: self.$mobileNav,
                wrapperSlt: '.mobile-block',
                titleSlt: '.mobile-block-trigger',
                contentSlt: '.mobile-block-children',
                activeClass: 'opened',
                trigger: 'touchstart',
                noAction: true,
                allowMultiple: false
            });
            
            // Update and delegate adding events
            _.extend(self.events, events);
            self.delegateEvents();
        },
        
        initFixedHeader: function() {
            var self = this;
            self.$header.scrollToFixed({
                dontSetWidth : true
            });
        },
        
        initUtilities: function() {
            var self = this;
            var events = self.isMobile() ? {
                'touchstart .search-toggle' : function(e){
                    e.stopPropagation();
                    e.preventDefault();
                    self.searchCtl();
                },
                'touchstart .block-search' : function(e){
                    // e.stopPropagation();
        			// e.preventDefault();
                },
                'touchstart .block-search button' : function(e){
                    e.preventDefault();
                    var $form = $(e.currentTarget).parent('form');
                    if ($form.find('input').val()) {
                        $(e.currentTarget).parent('form').submit();
                    }
                    self.searchCtl();
                }
            } : {
				'click .search-toggle' : function(e){
                    e.stopPropagation();
                    e.preventDefault();
                    self.searchCtl();
                },
                'click .block-search' : function(e){
                    e.stopPropagation();
        			e.preventDefault();
                },
                'click .block-search button' : function(e){
                    e.preventDefault();
                    var $form = $(e.currentTarget).parent('form');
                    if ($form.find('input').val()) {
                        $(e.currentTarget).parent('form').submit();
                    }
                    self.searchCtl();
                }
			};
            
            // Header hover control
            self.$header.hoverIntent({
                over: function(){
                    self.$body.trigger('menu-opt');
                },
                out: function(){
                    self.$body.trigger('menu-opt');
                },
                sensitivity: 100,
                selector: '.has-dropdown'
            });
            
            // Update and delegate adding events
            _.extend(self.events, events);
            self.delegateEvents();
        },
        
        initMiniCart: function () {
          	console.log('Mini cart being initialized');
            var self = this;
            var events = self.isMobile() ? {
                'touchstart header .block-minicart' : function(e){
                    e.stopPropagation();
        			e.preventDefault();
                    ajaxCart.load();
                    self.miniCartCtl();
                },
                'touchstart #MiniCart .drawer-close' : function(e){
                    e.stopPropagation();
        			e.preventDefault();
                    self.miniCartCtl(true);
                },
                'touchstart #MiniCart' : function(e){
                    e.stopPropagation();
                }
            } : {
				'click header .block-minicart' : function(e){
                    e.stopPropagation();
        			e.preventDefault();
                    ajaxCart.load();
                    self.miniCartCtl();
                },
                'click #MiniCart .drawer-close' : function(e){
                    e.stopPropagation();
        			e.preventDefault();
                    self.miniCartCtl(true);
                },
                'click #MiniCart' : function(e){
                    e.stopPropagation();
                }
			};
            
            ajaxCart.init({
                formSelector: '.add-to-cart-form',
                addToCartSelector: '.add-to-cart-btn',
                cartContainer: '#CartContainer',
                cartCountSelector: '.minicart-count',
                cartCostSelector: '#CartCost',
                moneyFormat: theme.moneyFormat
            });
            // ajaxCart.load();
            
          	window.addEventListener('cart-updated', function (e) {
              	console.log('Detected add to cart event!!!!');
              	self.miniCartCtl();
			});
          
            $(document).on('afterAddToCart.ajaxCart', function(evt, cart) {
              	console.log('Detected add to cart event!!');
                // console.log(cart);
                //self.miniCartCtl();
            });
            
            // Update and delegate adding events
            _.extend(self.events, events);
            self.delegateEvents();
        },
        
        miniCartCtl: function(forceClose){
            var self = this;
            self.drawerCtl(forceClose,self.$miniCart);
        },
        
        mobileMenuCtl: function(forceClose){
            var self = this;
            self.drawerCtl(forceClose,self.$mobileNav);
        },
        
        drawerCtl: function(forceClose,$elem){
            var self = this;
            if (forceClose) {
                self.$body.removeClass('show-overlay drawer-opt');
                $elem.removeClass('opened');
            } else {
                self.$body.trigger('drawer-opt');
                $elem.toggleClass('opened');
            }
        },
        
        searchCtl: function(forceClose){
            var self = this;
            if (!self.isMobile()) {
                if (forceClose) {
                    self.$search.removeClass('active');
                    self.$body.removeClass('search-opt');
                } else {
                    self.$search.toggleClass('active');
                    self.$body.trigger('search-opt');
                    if (self.$search.hasClass('active')) {
                        self.$search.find('input').focus();
                    }
                }
            }
        },
        
        initMobileMenu: function(){
            var self = this;
            var mobileMenuClassCtl = function(e){
                var $curr = $(e.currentTarget);
                if ($curr.hasClass('back-to')) {
                    if (self.$mobileNav.find('.opened').length < 1) {
                        self.$mobileNav.removeClass('child-menu-opened');
                    }
                } else {
                    if ($curr.parent().hasClass('opened')) {
                        self.$mobileNav.addClass('child-menu-opened');
                    } else if (self.$mobileNav.find('.opened').length < 1) {
                        self.$mobileNav.removeClass('child-menu-opened');
                    }
                }
            };
            var mobileMenuSearch = function(e){
                var $searchToggle = $(e.currentTarget);
                var $searchWrapper = $(e.currentTarget).parent();

                $searchWrapper.toggleClass('active');
                self.$mobileNav.toggleClass('search-open');

                if($searchWrapper.hasClass('active')){
                    setTimeout(function(){
                        $searchWrapper.find('.search-field').focus();
                    },500);
                }

                //Toggle caption menu/search
                var $searchToggleOpenedText = $searchToggle.data('opened-text');
                var $searchToggleClosedText = $searchToggle.data('closed-text');
                var $searchToggleCurrentText = $searchToggle.text();

                $searchToggle.text($searchToggleCurrentText == $searchToggleOpenedText ? $searchToggleClosedText : $searchToggleOpenedText);
            };
            var events = {
                'touchstart #MobileNav .has-children > .nav-link' : function(e){
                    mobileMenuClassCtl(e);
                },
                'touchstart #MobileNav .mobile-block-trigger' : function(e){
                    mobileMenuClassCtl(e);
                },
                'touchstart #MobileNav .back-to' : function(e){
                    mobileMenuClassCtl(e);
                },
                'touchstart #MobileNav .mobile-search-toggle' : function(e){
                    mobileMenuSearch(e);
                }
            }
            
            // Update and delegate adding events
            _.extend(self.events, events);
            self.delegateEvents();
        },

        newsletterForm: function(){
            var self = this;
            
            var $newsFormContainer = self.$footerNews.find('.newsletter-form');
            
            var validateEmail = function (email) {
                var re = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
    
                return re.test(email);
            }

            var events = {
                'submit #contact_form': function(e){
                    var $formContainer = $(e.currentTarget).parents('.newsletter-form');
                    if(!validateEmail($formContainer.find('input.input-group-field').val())){
                        e.preventDefault();
                        $formContainer.find('.error-msg').text($formContainer.data('erroremail'));
                    }else{
                        // dataLayer.push = ({'newsletterSignUp': 'true'});
                    }
                },
                'focus input.input-group-field':function(e){
                    var $formContainer = $(e.currentTarget).parents('.newsletter-form');
                    $formContainer.find('.error-msg').text('');
                }
            };

            if(
                ORW.utilities.getUrlParam(location.href, 'customer_posted') == 'true#contact_form' || 
                ORW.utilities.getUrlParam(location.href, 'customer_posted') == 'true' || 
                ORW.utilities.getUrlParam(location.href, 'form_type') == 'customer#contact_form'
            ){
                self.$body.find('.newsletter-toggle').toggleClass('active');
                self.$footerNews.toggleClass('active');
                $('html, body').animate({ scrollTop: self.$footerNews.offset().top }, 500);
                setTimeout(function(){
                    self.$footerNews.removeClass('active');
                    self.$body.find('.newsletter-toggle').toggleClass('active');
                },5000);
            }

            self.$footerNews.find('.reset-news').click(function(e){
                $(e.currentTarget).parent('.form-success').hide();
                self.$footerNews.find('.input-group').removeClass('hide').show();
            });

            self.$body.find('.newsletter-toggle').click(function(e){
                e.stopPropagation();
                e.preventDefault();
                $(e.currentTarget).toggleClass('active');
                self.$footerNews.toggleClass('active');

                if(self.$footerNews.hasClass('active')){
                    self.$footerNews.find('input').focus();
                }
            });
            
            // Update and delegate adding events
            _.extend(self.events, events);
            self.delegateEvents();
        },


        isIE: function () {
            var ua = window.navigator.userAgent;
            var msie = ua.indexOf("MSIE ");

            if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)){ // If Internet Explorer, return version number
                $('body').addClass('is-ie');
                return true;
            }else{  // If another browser, return 0            
                return false;
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
        
        isTouch: function () {
            var self = this;
            if ($('html').hasClass('touchevents')) {
                return true;
            }
            return false;
        }

    });

    return ViewHeader;

});