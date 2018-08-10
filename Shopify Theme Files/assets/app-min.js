// 1R global
ORW.responsiveSizes = {
    'phone' : 768,
    'tablet' : 1024,
    'desktopSmall' : 1200,
    'desktopLarge' : 1600
}
ORW.utilities = {
    'isMobile' : function() {
        var check = false;
        (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od|ad)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
        return check;
    },
    'isTouchEnabled' : function() {
        return 'ontouchstart' in document.documentElement;
    },
    'getUrlParam' : function(url, sParam, value) {
        var sPageURL = url != undefined ? url : decodeURIComponent(window.location.search.substring(1));
        if (sPageURL.indexOf("?") >= 0) { sPageURL = sPageURL.replace("?", "&"); }
        var sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;

        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');
            if (sParameterName[0] === sParam) {
                if (value && sParameterName[1] !== undefined) {
                    var st1 = sParameterName[0] + '=' + sParameterName[1];
                    var st2 = sParameterName[0] + '=' + value;
                    return url.replace(st1, st2);
                } else {
                    return sParameterName[1] === undefined ? true : sParameterName[1];
                }
            }
        }
    },
    'updateUrlParam' : function(url, sParam, value) {
        url = url ? url : window.location.href;
        var newurl = url;
        var currentParams = window.location.search;
        var currentHandle = ORW.utilities.getUrlParam(url,sParam);
        if (currentHandle) {
            // Replace
            newurl = ORW.utilities.getUrlParam(url,sParam,value);
        } else {
            // Create new depends on current params and url structure
            if (currentParams) {
                newurl += '&' + sParam + '=' + value;
            }
        }
        return newurl;
    },
    'setCookie' : function(name,value,days,domain) {
        if (days) {
            var date = new Date();
            date.setTime(date.getTime()+(days*24*60*60*1000));
            var expires = "; expires="+date.toGMTString();
        } else {
            var expires = "";
        }
        if (domain) {
            document.cookie = name+"="+value+expires+"; path=/; domain=" + domain;
        } else {
            document.cookie = name+"="+value+expires+"; path=/";
        }
    },
    'getCookie' : function(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
    },
    'deleteCookie' : function(name) {
        ORW.setCookie(name,"",-1);
    },
    'searchCookie' : function(term) {
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            var s = c.split('=');
            if (s.length > 0 && s[0].indexOf(term) > -1) return s[0];
        }
        return null;
    }
}

// Config for requireJs
require.config({

    waitSeconds: 0,
    baseUrl: '.',
    paths: {
        // Core
        "underscore": "underscore",
        "backbone": "backbone",
        "jquery": "jquery.noconflict",

        // Libraries
        "jquery.easing": "jquery.easing",
        "jquery.transit": "jquery.transit",
        "jquery.actual": "jquery.actual",
        "jquery.hoverintent": "jquery.hoverintent",
        "jquery.scrollLock": "jquery.scrollLock",
        "jquery.scrolltofixed": "jquery.scrolltofixed",
        "jquery.doubletap": "jquery.doubletap",
        "jquery.panzoom": "jquery.panzoom",
        "jquery.fullpage": "jquery.fullpage",
        "jquery.fullpage.extensions": "jquery.fullpage.extensions.min",
        "jquery.waypoints": "jquery.waypoints",
        "jquery.viewport": "jquery.viewport",
        "jquery.panelsnap": "jquery.panelsnap",
        "slick": "slick",
        "scrolloverflow": "scrolloverflow",
        "masonry": "masonry.pkgd",
        "modernizr_autoplay": "modernizr_autoplay-detect",
        "imagesLoaded": "imagesloaded.pkgd.min",
        "aos": "aos",
        "vimeo": "//player.vimeo.com/api/player",
        "facebook": "//connect.facebook.net/en_US/sdk",

        // Main
        "router": "app-router",

        // Modules
        "module-oneModal": "app-module-oneModal",
        "module-oneSwatches": "app-module-oneSwatches",
        "module-oneZoom": "app-module-oneZoom",
        "module-oneSocial": "app-module-oneSocial",
        "module-oneExpand": "app-module-oneExpand",
        "module-oneTab": "app-module-oneTab",
        "module-oneSizeChart": "app-module-oneSizeChart",
        "module-oneSubscribe": "app-module-oneSubscribe",
        "module-oneContact": "app-module-oneContact",
        "module-oneVideo": "app-module-oneVideo",

        // Pages
        "page-collection": "app-page-collection",
        "page-product": "app-page-product",
        "page-lookbook": "app-page-lookbook",
        "page-home": "app-page-home",
        "page-login": "app-page-login",
        "page-account": "app-page-account",
        "page-utility": "app-page-utility",
        "page-styleGuide": "app-page-styleGuide",

        // Views
        "view-header": "app-view-header",
        "view-collection": "app-view-collection",
        "view-collectionNav": "app-view-collectionNav",
        "view-lookbook": "app-view-lookbook",
        "view-product": "app-view-product",
        "view-home": "app-view-home",
        "view-login": "app-view-login",
        "view-account": "app-view-account",
        "view-utility": "app-view-utility",
        "view-styleGuide": "app-view-styleGuide"

        // Templates
    },

    shim: {
        'underscore': { exports: "_" },
        'backbone': { deps: ["jquery", "underscore"], exports: "Backbone" },
        'jquery.easing': ["jquery"],
        'jquery.transit': { deps: ["jquery", "jquery.easing"] },
        'jquery.actual': ["jquery"],
        "jquery.hoverintent": ["jquery"],
        "jquery.scrollLock": ["jquery"],
        "jquery.scrolltofixed": ["jquery"],
        "jquery.doubletap": ["jquery"],
        "jquery.panzoom": ["jquery"],
        "jquery.fullpage": ["jquery","scrolloverflow"],
        "jquery.fullpage.extensions": ["jquery","scrolloverflow","jquery.fullpage"],
        "jquery.waypoints": ["jquery"],
        "jquery.viewport": ["jquery"],
        "jquery.panelsnap": ["jquery"],
        "scrolloverflow": ["jquery"],
        "slick": ["jquery"],
        "facebook" : {
            exports: 'FB'
        }
    },

    config: {
        text: {
            useXhr: function (url, protocol, hostname, port) {
                //Override function for determining if XHR should be used.
                //url: the URL being requested
                //protocol: protocol of page text.js is running on
                //hostname: hostname of page text.js is running on
                //port: port of page text.js is running on
                //Use protocol, hostname, and port to compare against the url
                //being requested.
                //Return true or false. true means "use xhr", false means
                //"fetch the .js version of this resource".
                return true;
            }
        }
    }

});

require([
    'underscore',
    'backbone'
], function () {
    console.info('main JS loaded');

    require(["router"]);
});
