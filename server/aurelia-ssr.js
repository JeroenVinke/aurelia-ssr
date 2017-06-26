"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t;
    return { next: verb(0), "throw": verb(1), "return": verb(2) };
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
require("aurelia-polyfills");
var aurelia_framework_1 = require("aurelia-framework");
var aurelia_router_1 = require("aurelia-router");
var ssr_router_1 = require("./ssr-router");
var aurelia_loader_nodejs_1 = require("aurelia-loader-nodejs");
var aurelia_pal_nodejs_1 = require("aurelia-pal-nodejs");
var jsdom = require("jsdom");
var preboot = require("preboot");
var path = require("path");
var ejs = require("ejs");
var aurelia = null;
function initializeSSR(options) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // ignore importing '.css' files, useful only for Webpack codebases that do stuff like require('./file.css'):
                    require.extensions['.css'] = function (m, filename) {
                        return;
                    };
                    // set the root directory where the aurelia loader will resolve to
                    // this is the 'src' dir in case of skeleton
                    aurelia_loader_nodejs_1.Options.relativeToDir = options.srcRoot || path.resolve(__dirname, '..', 'src');
                    // initialize PAL and set globals (window, document, etc.)
                    aurelia_pal_nodejs_1.globalize();
                    // aurelia expects console.debug
                    // this also allows you to see aurelia logging in cmd/terminal
                    console.debug = console.log;
                    return [4 /*yield*/, initializeApp(options)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.initializeSSR = initializeSSR;
function render(options) {
    return __awaiter(this, void 0, void 0, function () {
        var router, e_1, body, html, prebootOptions, inlinePrebootCode, _i, _a, bundle, _b, _c, stylesheet;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    if (!options.route || !options.templateContext || !options.template) {
                        throw new Error('Missing property (route | templateContext | template)');
                    }
                    router = aurelia.container.get(aurelia_router_1.Router);
                    console.log("Routing to " + options.route);
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, router.navigate(options.route)];
                case 2:
                    _d.sent();
                    return [3 /*break*/, 4];
                case 3:
                    e_1 = _d.sent();
                    throw new Error('404');
                case 4:
                    // <input> .value property does not map to @value attribute, .defaultValue does.
                    // so we need to copy that value over if we want it to serialize into HTML <input value="">
                    [].forEach.call(document.body.querySelectorAll('input'), function (input) {
                        if (input.value != null)
                            input.defaultValue = input.value;
                    });
                    body = document.body.outerHTML;
                    html = ejs.compile(options.template)({
                        htmlWebpackPlugin: {
                            options: {
                                metadata: Object.assign(options.templateContext, {
                                    body: body
                                })
                            }
                        }
                    });
                    if (options.preboot) {
                        prebootOptions = {
                            appRoot: ['body']
                        };
                        inlinePrebootCode = preboot.getInlineCode(prebootOptions);
                        html = appendBeforeHead(html, "\r\n<script>" + inlinePrebootCode + "</script>\r\n");
                        // preboot_browser can replay events that were stored by the preboot code
                        html = appendBeforeBody(html, "\r\n<script src=\"preboot_browser.js\"></script>\n    <script>\n      document.addEventListener('aurelia-started', function () {\n        // Aurelia has started client-side\n        // but the view/view-model hasn't been loaded yet so we need a small\n        // delay until we can playback all events.\n        setTimeout(function () { preboot.complete(); }, " + (options.replayDelay || 10) + ");\n      });\n    </script>");
                    }
                    for (_i = 0, _a = options.bundles || []; _i < _a.length; _i++) {
                        bundle = _a[_i];
                        html = appendBeforeBody(html, "\r\n<script src=\"" + bundle + "\" type=\"text/javascript\"></script>");
                    }
                    for (_b = 0, _c = options.stylesheets || []; _b < _c.length; _b++) {
                        stylesheet = _c[_b];
                        html = appendBeforeHead(html, "<link rel=\"stylesheet\" type=\"text/css\" href=\"" + stylesheet + "\">");
                    }
                    return [2 /*return*/, html];
            }
        });
    });
}
exports.render = render;
function appendBeforeBody(htmlString, toAppend) {
    return htmlString.replace('</body>', toAppend + "</body>");
}
function appendBeforeHead(htmlString, toAppend) {
    return htmlString.replace('</head>', toAppend + "</head>");
}
function initializeApp(options) {
    return __awaiter(this, void 0, void 0, function () {
        var attribute;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // this needs to be a valid url format
                    // without this location.pathname is set to /blank
                    // https://github.com/tmpvar/jsdom/tree/a6acac4e9dec4f859fff22676fb4e9eaa9139787#changing-the-url-of-an-existing-jsdom-window-instance
                    jsdom.changeURL(global.window, 'http://localhost:8765');
                    aurelia = new aurelia_framework_1.Aurelia(new aurelia_loader_nodejs_1.NodeJsLoader());
                    aurelia.host = document.body;
                    aurelia.configModuleId = options.serverMainId;
                    // Custom AppRouter which throws an error on 404
                    // so we can handle this event in the express/koa/etc
                    aurelia.container.registerSingleton(aurelia_router_1.Router, ssr_router_1.SSRRouter);
                    // need to get "require('../src/main')" out of here
                    // but it fails to import styles.css from main.ts when you do require('../src/main') this in server/index.ts
                    // probably because 
                    // require.extensions['.css'] = function (m, filename) {
                    //    return
                    // };
                    // hasn't executed yet in initializeSSR()
                    return [4 /*yield*/, require('../src/main').configure(aurelia)];
                case 1:
                    // need to get "require('../src/main')" out of here
                    // but it fails to import styles.css from main.ts when you do require('../src/main') this in server/index.ts
                    // probably because 
                    // require.extensions['.css'] = function (m, filename) {
                    //    return
                    // };
                    // hasn't executed yet in initializeSSR()
                    _a.sent();
                    attribute = document.createAttribute('aurelia-app');
                    attribute.value = options.clientMainId;
                    document.body.attributes.setNamedItem(attribute);
                    return [2 /*return*/];
            }
        });
    });
}
