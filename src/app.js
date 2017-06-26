"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var aurelia_pal_1 = require("aurelia-pal");
var App = (function () {
    function App() {
    }
    App.prototype.configureRouter = function (config, router) {
        config.title = 'Aurelia';
        config.options.pushState = true;
        config.options.root = '/';
        config.map([
            { route: ['', 'welcome'], name: 'welcome', moduleId: aurelia_pal_1.PLATFORM.moduleName('./welcome'), nav: true, title: 'Welcome' },
            { route: 'users', name: 'users', moduleId: aurelia_pal_1.PLATFORM.moduleName('./users'), nav: true, title: 'Github Users' },
            { route: 'child-router', name: 'child-router', moduleId: aurelia_pal_1.PLATFORM.moduleName('./child-router'), nav: true, title: 'Child Router' }
        ]);
        this.router = router;
    };
    return App;
}());
exports.App = App;
