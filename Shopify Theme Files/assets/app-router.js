define([
    "view-header",
    "domReady",
    "jquery",
    "jquery.easing",
    "jquery.transit"
], function (ViewHeader, domReady, $) {

    "use strict";

    if (!$.support.transition) {
        $.fn.transition = $.fn.beforeanimate;
    };

    // Global requires
    domReady(function(){
        ORW.Header = new ViewHeader({el: $(document.body)});
    });

    // Start routing by template type
    var $body = $(document.body);

    console.info('routing: ' + ' ' + $body.attr('class'));

    if ($body.hasClass('template-index') || $body.hasClass('template-home') || $body.hasClass('page-home')) {
        require(["page-home"]);
    }


    if ( $body.data('tempsuffix') == 'lookbook' ) {
        require(["page-lookbook"]);
    }

    if ( ($body.hasClass('template-collection') || $body.hasClass('template-search')) && $body.data('tempsuffix') != 'lookbook' ) {
        require(["page-collection"]);
    }

    if ($body.hasClass('template-product')) {
        require(["page-product"]);
    }

    if ($body.hasClass('template-style-guide') || $body.hasClass('page-style-guide')) {
        require(["page-styleGuide"]);
    }

    if ($body.hasClass('template-customers-login') || $body.hasClass('template-customers-register')) {
        require(["page-login"]);
    }

    if ($body.hasClass('template-customers-account') || $body.hasClass('template-customers-addresses') || $body.hasClass('template-customers-order')) {
        require(["page-account"]);
    }

    if ($body.hasClass('template-page') && $body.data('tempsuffix') == '') {
        require(["page-utility"]);
    }

});
