define([
    "view-product",
    "domReady",
    "jquery"
], function (ViewProduct, domReady, $) {
    "use strict";

    // Global requires
    domReady(function() {
    	console.info('init product');

      new ViewProduct({
      	el: $('.product-page')
      });
    });
	}
);