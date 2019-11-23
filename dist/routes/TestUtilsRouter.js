"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var POST = "POST";
exports.POST = POST;
var GET = "GET";
exports.GET = GET;
/**
 * A utility for checking whether a path and method combo is defined on a router.
 */
var RouteChecker = /** @class */ (function () {
    function RouteChecker(router) {
        var _this = this;
        this._registeredRoutes = new Set();
        router.stack.forEach(function (middleWare) {
            if (!middleWare.route)
                return;
            _this._getRouteSignature(middleWare.route).forEach(function (signature) {
                _this._registeredRoutes.add(signature);
            });
        });
    }
    /**
     * @returns strings used to represent the path/method combinations in `route`
     */
    RouteChecker.prototype._getRouteSignature = function (route) {
        var signatures = [];
        if (route.methods.get) {
            signatures.push(route.path + "-" + GET);
        }
        else if (route.methods.post) {
            signatures.push(route.path + "-" + POST);
        }
        return signatures;
    };
    /**
     * @returns `true` iff the router has a route with `path` and HTTP method
     * `method`.
     */
    RouteChecker.prototype.hasRoute = function (path, method) {
        return this._registeredRoutes.has(path + "-" + method);
    };
    return RouteChecker;
}());
exports.RouteChecker = RouteChecker;
//# sourceMappingURL=TestUtilsRouter.js.map