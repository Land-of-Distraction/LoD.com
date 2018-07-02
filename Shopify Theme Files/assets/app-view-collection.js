define([
    'jquery',
    'module-oneSwatches',
    'masonry',
    'imagesLoaded',
    'jquery.viewport'
], function ($, OneSwatches, Masonry) {

    "use strict";

    var ViewCollection = Backbone.View.extend({

        initialize: function (opts) {
          	console.log('Init View Collection')
            var self = this;
            self.$pager = self.$el.find('.collection-pagination');
            self.$productGrid = self.$el.find('.collection-products');
            self.$products = self.$productGrid.find('.item');

            // self.swatches();
            self.quickbuy();
            self.addAll();

            self.promoMover();

            if(!$('body').hasClass('template-search')){
                // self.columnize();
                $(window).on('resize',function(e){
                    self.columnize();
                });
            }
          
          setTimeout(function () { 
            self.columnize(); 
          }, 1)
        },
        
        events: {
            
        },
        
        swatches: function(){
            var self = this;
            self.swatches = OneSwatches.init({ el: self.$productGrid, preSelect: true });
        },
        
        addAll: function() {
            // Add All requires Quickbuy
            var self = this;
            var addAllToBag = function(e){
                e.preventDefault();
                // Add CTA status change here..
                
                // Collecting data
                var productIds = [];
                _.each(self.$products, function(product){
                    var $productSelected = $(product).find('select.product-single__variants');
                    if ($productSelected.length) {
                        productIds.push($productSelected.val());
                    }
                });
                
                // Add Multiple Products
                var data = {
                    id : productIds,
                    quantity : 1
                }, callback = function(line_item){
                    // Success callback, cart loaded, please add CTA status change here..
                    console.log(line_item);
                    ajaxCart.load();
                    $('header .block-minicart').trigger('click');
                }, errorCallback = function (XMLHttpRequest, textStatus) {
                    // Error callback, please add extra error handling here
                    var data = eval('(' + XMLHttpRequest.responseText + ')');
                    console.log(data);
                };
                ShopifyAPI.addMultipleItems(data, callback, errorCallback);
            }
            
            var events = {
                'click .add-all-to-bag' : addAllToBag
            }
            
            // Update and delegate adding events
            _.extend(self.events, events);
            self.delegateEvents();
        },
        
        quickshop: function(){
            var self = this;
        },
        
        quickbuy: function () {
            var self = this;
            var $products = self.$products.filter(function(index){
                var $qbcontainer = $(this).find('.quick-buy-container');
                return $qbcontainer.length && !$qbcontainer.hasClass('initialized');
            });
            var events = {
                // 'click .quick-buy-ctl' : function(e){
                //     var $curr = $(e.currentTarget);
                //     var $item = $curr.parents('.item');
                //     var temp = '';
                    
                //     temp = $curr.text();
                //     $curr.text($curr.data('toggle'));
                //     $curr.data('toggle', temp);
                    
                //     $item.find('.quick-buy-container').toggleClass('active');
                // }
            };
            
            _.each($products, function(item){
                var $product = $(item);
                if ($product.find('.quick-buy-container').length) {
                    var $form = $product.find('form'),
                    pid = $product.data('id'),
                    pdata = $product.find('[data-product-json]').length ? JSON.parse($product.find('[data-product-json]').html()) : false;

                    new Shopify.OptionSelectors('productSelect-' + pid, {
                        product: pdata,
                        onVariantSelected: ShopifyAPI.selectCallback,
                        enableHistoryState: false
                    });
                    
                    OneSwatches.init({ el: $product, preSelect: false, product: pdata });
                    $product.find('.quick-buy-container').addClass('initialized');
                }
            });
            
            // Update and delegate adding events
            _.extend(self.events, events);
            self.delegateEvents();
        },
        
        columnize: function(){
            var self = this;
            var gridGutter = 0;

            // console.log('columnize activated');
            // console.log(self.$productGrid.hasClass('grid-adjusted'));
            //Check if masonry hasn't been loaded already
            require( [ 'jquery-bridget/jquery-bridget' ],
            function( jQueryBridget ) {
                // make Masonry a jQuery plugin
                jQueryBridget( 'masonry', Masonry, $ );
                // now you can use $().masonry()


                var $itemList = self.$productGrid.masonry({
                    columnWidth: 'article.item',
                    itemSelector: 'article.item',
                    percentPosition: true,
                    initLayout: false,
                    transitionDuration: 0
                });

                if(self.isMobile()){
                    // var $itemList = self.$productGrid.masonry();
                    self.$productGrid.removeClass('grid-adjusted');
                    self.$productGrid.masonry('destroy');
                    self.$products.removeAttr('style');
                }else if(!self.isMobile()){

                    $itemList.masonry( 'on', 'layoutComplete', function() {
                        $itemList.masonry('reloadItems');
                        // console.log('reload items');
                        // self.$productGrid.addClass('grid-adjusted');
                    });
                    $itemList.imagesLoaded().progress( function() {
                        self.$productGrid.removeClass('grid-adjusted');
                    }).done(function(){
                        // console.log('images done');
                        self.$productGrid.addClass('grid-adjusted');
                        $itemList.masonry('layout');
                        $itemList.masonry('reloadItems');
                    });
                }

            });//jQueryBridget

        },

        promoMover: function(){
            //Url Query String
            var self = this;
            var isSortByLowPrice = ORW.utilities.getUrlParam(window.location.href,'sort_by');

            //&& self.preSelect
            if(isSortByLowPrice == 'price-ascending'){
                var thePromos = self.$el.find('.promo-item');
                thePromos.appendTo('.collection-products');
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
            // self.swatches.destroy();
            $(window).off('scroll.listview');
        }

    });

    return ViewCollection;

});