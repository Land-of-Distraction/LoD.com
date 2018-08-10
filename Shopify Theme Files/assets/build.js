({
    name: 'app-min',
    include: [
        'underscore',
        'backbone',
        'router',
        'text',
        'domReady',
        "page-home",
        "page-collection",
        "page-product",
        "page-account",
        "page-login",
        // "page-account",
        "page-utility",
        // "page-about",
        "page-lookbook",
        "page-styleGuide"
    ],
    wrap: {
        start: "(function() {",
        end: "}());"
    },
    preserveLicenseComments: true,
    baseUrl: ".",
    mainConfigFile: "app-min.js",
    out: '1r-min.js'
})