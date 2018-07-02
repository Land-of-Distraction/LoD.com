define([
    "view-collection", // ViewCollection
    "view-collectionNav", // ViewCollectionNav
    "domReady",
    "jquery"
], function (ViewCollection, ViewCollectionNav, domReady, $) {

    "use strict";
    
    var collection,
        rebuilt = false;
    
    // For lazy loading
    ORW.pagerStack = [];
    ORW.isLoading = false;
    ORW.isFinished = false;
        
    ORW.rebuildListing = function(){
        if (rebuilt) {
            console.log('rebuilt listing');
        } else {
            console.log('init listing');
        }

        if (collection) { 
            collection.destroy();
        }
        
        collection = $('.product-collection').length ? new ViewCollection({el: $('.product-collection') }) : false;

        if (!rebuilt) rebuilt = true;
    };

    // Global requires
    domReady(function(){
        $('.collection-nav').length && new ViewCollectionNav({el: $('.collection-nav') });
        ORW.rebuildListing();
    });

});
