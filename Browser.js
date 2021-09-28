"use strict";


function empty (node) {
    while (node.lastChild) {
        node.removeChild (node.lastChild);
    }
}


const nodeOfId = id => document.getElementById (id);


const domTreeTracer = node => stopId =>
    node.id === stopId ? []
                       : [ Array.from (node.parentElement.children, child => child.nodeName)
                         , ...domTreeTracer (node.parentElement) (stopId)
                         ];


const ancestorIdsOfNode = node => stopId =>
    node.id === stopId ? []
                       : [ node.id, ...ancestorIdsOfNode (node.parentElement) (stopId) ];


const isValidSliceInput = (start, end) => stopId =>
    ( start && end &&
        (Number (start.id) <= Number (end.id)) &&
        (ancestorIdsOfNode (end) (stopId).includes (start.id))
    );


const sliceOfTree = (start, end) => stopId =>
    end.id === stopId || Number (end.id) < Number (start.id) ? []
                                                             : [ ...sliceOfTree (start, end.parentElement) (stopId), end.nodeName ];


const sliceTree = (start, end) => stopId =>
    !isValidSliceInput (start, end) (stopId) ? new Error ()
                                             : sliceOfTree (start, end) (stopId);


const childrenOfNodes = nodes =>
    nodes.length === 0 ? []
                       : [ ...Array.from (nodes[0].children), ...childrenOfNodes (nodes.slice (1)) ];


const nextElements = nodes =>
    (nodes =>
        nodes.length === 0 ? []
                           : [ nodes ]
    ) (childrenOfNodes (nodes));


const nextNode = node => node.childNodes;

/*
Object.assign (module.exports, {
    ancestorIdsOfNode,
    domTreeTracer,
    empty,
    nextElements,
    nextNode,
    nodeOfId,
    sliceTree,
});
*/
