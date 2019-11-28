import { Router } from "express";

const POST = "POST"; 
export { POST };

const GET = "GET";
export { GET };

/**
 * A utility for checking whether a path and method combo is defined on a router.
 */
export class RouteChecker {
    private _registeredRoutes: Set<String> = new Set();

    constructor(router: Router) {
        router.stack.forEach((middleWare) => {
            if (!middleWare.route) return;
            this._getRouteSignature(middleWare.route).forEach((signature) => {
                this._registeredRoutes.add(signature);
            });
        });
    }

    /**
     * @returns strings used to represent the path/method combinations in `route`
     */
    private _getRouteSignature(route: any): string[] {
        let signatures = [];
        if (route.methods.get) {
            signatures.push(`${route.path}-${GET}`); 
        } else if (route.methods.post) {
            signatures.push(`${route.path}-${POST}`);
        }
        return signatures;
    }

    /**
     * @returns `true` iff the router has a route with `path` and HTTP method 
     * `method`.
     */
    hasRoute(path: String, method: String) {
        return this._registeredRoutes.has(`${path}-${method}`);
    }
}