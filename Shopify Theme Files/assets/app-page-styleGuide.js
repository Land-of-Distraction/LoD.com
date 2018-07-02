define([
    "view-styleGuide",
    "domReady",
    "jquery"
], function (ViewStyleGuide, domReady, $) {

    "use strict";

    // Global requires
    domReady(function(){
        console.log('init style guide');
        new ViewStyleGuide({el: $('.style-guide-wrapper')});
    });

});
