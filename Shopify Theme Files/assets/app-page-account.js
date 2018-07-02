define([
    "view-account",
    "domReady",
    "jquery"
], function (viewAccount, domReady, $) {

    "use strict";

    // Global requires
    domReady(function(){
    	console.log('init account');
        new viewAccount({el: $('.account-page')});
    });

});