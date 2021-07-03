export default !function() {
    if ("undefined" == typeof window.performance && (window.performance = {}),
    !window.performance.now) {
        let t = Date.now();
        performance.timing && performance.timing.navigationStart && (t = performance.timing.navigationStart),
        window.performance.now = function() {
            return Date.now() - t
        }
    }
}()