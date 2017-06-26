"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var aurelia_router_1 = require("aurelia-router");
var aurelia_dependency_injection_1 = require("aurelia-dependency-injection");
var aurelia_history_1 = require("aurelia-history");
var aurelia_event_aggregator_1 = require("aurelia-event-aggregator");
var LogManager = require("aurelia-logging");
var logger = LogManager.getLogger('app-router');
var SSRRouter = (function (_super) {
    __extends(SSRRouter, _super);
    function SSRRouter(container, history, pipelineProvider, events) {
        return _super.call(this, container, history, pipelineProvider, events) || this;
    }
    SSRRouter.inject = function () { return [aurelia_dependency_injection_1.Container, aurelia_history_1.History, aurelia_router_1.PipelineProvider, aurelia_event_aggregator_1.EventAggregator]; };
    SSRRouter.prototype.loadUrl = function (url) {
        var _this = this;
        return this._createNavigationInstruction(url)
            .then(function (instruction) { return _this._queueInstruction(instruction); })
            .catch(function (error) {
            restorePreviousLocation(_this);
            throw error;
        });
    };
    return SSRRouter;
}(aurelia_router_1.AppRouter));
exports.SSRRouter = SSRRouter;
function restorePreviousLocation(router) {
    var previousLocation = router.history.previousLocation;
    if (previousLocation) {
        router.navigate(router.history.previousLocation, { trigger: false, replace: true });
    }
    else if (router.fallbackRoute) {
        router.navigate(router.fallbackRoute, { trigger: true, replace: true });
    }
    else {
        logger.error('Router navigation failed, and no previous location or fallbackRoute could be restored.');
    }
}
