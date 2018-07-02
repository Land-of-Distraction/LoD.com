define([
    "view-utility",
    "domReady",
    "jquery"
], function (viewUtility, domReady, $) {

    "use strict";

    // Global requires
    domReady(function(){
    	console.log('init utility');
        new viewUtility({el: $('.page-utility')});
    });

});