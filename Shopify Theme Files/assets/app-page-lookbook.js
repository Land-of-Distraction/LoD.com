define([
    "view-lookbook", // ViewLookbook
    "domReady",
    "jquery"
], function (ViewLookbook, domReady, $) {

    "use strict";
    
    var collection,
        rebuilt = false;
    
    // For InfinityScroll
    ORW.pagerStack = [];
    ORW.isLoading = false;
    ORW.isFinished = false;
        
    ORW.rebuildLookbook = function(){
        if (rebuilt) {
            console.log('rebuilt lookbook');
        } else {
            console.log('init lookbook');
        }

        if (collection) { 
            collection.destroy();
        }
        
        collection = $('.lookbook-main').length ? new ViewLookbook({el: $('.lookbook-main') }) : false;

        if (!rebuilt) rebuilt = true;
    };

    // Global requires
    domReady(function(){
        ORW.rebuildLookbook();
    });

});
