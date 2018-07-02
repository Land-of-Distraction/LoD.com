define([
    "view-login",
    "domReady",
    "jquery"
], function (viewLogin, domReady, $) {

    "use strict";

    // Global requires
    domReady(function(){
        console.log('init login');
        new viewLogin({el: $('.login-page')});
    });

});