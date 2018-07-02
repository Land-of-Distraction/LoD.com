define([
    "view-home",
    "domReady",
    "jquery"
], function (ViewHome, domReady, $) {

    "use strict";

    // Global requires
    domReady(function(){
        console.log('init homepage');
        new ViewHome({el: $('.homepage-container')});
    });

});
