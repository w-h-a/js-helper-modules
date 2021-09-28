"use strict"


function member (val, list) {
    return list.includes (val);
}


function nexter (vertex, graph) {
    if (graph.length === 0) return [];
    return (function ([ [ x, y ], ...edges ]) {
        return vertex === x ? [ y, ...nexter (vertex, edges) ]
                            : nexter (vertex, edges);
    }) (graph);
}


function graphDepthFirst (startingVertices, graph, visited = []) {
    if (startingVertices.length === 0) return visited.slice ().reverse ();
    return member (startingVertices[0], visited) ? depthFirst (startingVertices.slice (1), graph, visited)
                                                 : depthFirst (nexter (startingVertices[0], graph).concat (startingVertices.slice (1)), graph, [ startingVertices[0], ...visited ]);
}


function unzip ( [ [ x, y ], ...pairs ] ) {
    if (pairs.length === 0) return [ [ x ], [ y ] ];
    return (function ( [ xs, ys ] ) {
        return [ [ x, ...xs ], [ y, ...ys ] ];
    }) (unzip (pairs));
}


function topologicalSorting (graph) {
    return (function sortEm (starts, visited) {
        if (starts.length === 0) return visited;
        return sortEm (starts.slice (1), member (starts[0], visited) ? visited : [ starts[0], ...sortEm (nexter (starts[0], graph), visited) ]);
    }) (unzip (graph)[0], []);
}


Object.assign (module.exports, {
    graphDepthFirst,
    member,
    nexter,
    topologicalSorting,
    unzip,
});
