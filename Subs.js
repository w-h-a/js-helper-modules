function subs (dispatch, model) {
    const searchTerm = document.querySelector ("#searchTerm");
    if (!searchTerm.oninput) {
        const fun =
            e =>
                dispatch ({ type: MSGS.GET_SEARCH_RESULTS, payload: e });
        searchTerm.oninput =
            debounce (fun);
    }
}


function debounce (fun, delay = 500) {
    let timeoutId;
    return (...args) => {
        if (timeoutId) clearTimeout (timeoutId);
        timeoutId = setTimeout (() => {
            fun (...args);
        }, delay);
    }
}
