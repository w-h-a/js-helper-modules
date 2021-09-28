function httpRequest (dispatch, command) {
    if (!command) return;
    const request = command.request;
    const xhr = new XMLHttpRequest ();
    xhr.open (request.method, request.url);
    // setRequestHeader
    xhr.responseType = "json";
    xhr.send ();
    xhr.onload =
        () =>
            dispatch (command.successMsg (xhr.response));
    xhr.onerror =
        () =>
            dispatch (command.failureMsg ({ status: xhr.status, message: xhr.statusText }));
}


function getSearchResults (model) {
    const command =
        { request: { url: model.url + model.input
                   , method: "GET"
                   }
        , successMsg: resp => ({ type: MSGS.GET_SEARCH_RESULTS_SUCCESS, payload: resp })
        , failureMsg: resp => ({ type: MSGS.GET_SEARCH_RESULTS_FAILURE, payload: resp })
        };
    return command;
}
