/**
 * Safe route wrapper to prevent Ziggy runtime errors from crashing the UI.
 * Returns '#' if the route does not exist.
 */
export const safeRoute = (name: string, params?: any): string => {
    try {
        // @ts-ignore - check if route exists in Ziggy's global list
        if (typeof route !== 'undefined' && route.has && route.has(name)) {
            // @ts-ignore
            return route(name, params);
        }
    } catch (e) {
        console.warn(`SafeRoute: Route "${name}" not found in current Ziggy context.`);
    }
    return '#';
};
