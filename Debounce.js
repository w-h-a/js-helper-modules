function debounce (fun, delay = 500) {
    let timeoutId;
    return (...args) => {
        if (timeoutId) clearTimeout (timeoutId);
        timeoutId = setTimeout (() => {
            fun (...args);
        }, delay);
    }
}
