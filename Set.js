"use strict";


function member (val, list) {
    return list.includes (val);
}


function newMem (val, list) {
    return member (val, list) ? list
                              : [ val, ...list ];
}


function setOf ([ x, ...xs ]) {
    return x === undefined ? []
                           : newMem (x, setOf (xs));
}


function isEmpty (xs) {
    return xs.length === 0;
}


function card (xs) {
    return xs.length;
}


function union (xs, ys) {
    if (xs.length === 0 && ys.length === 0) return [];
    if (xs.length === 0) return ys;
    if (ys.length === 0) return xs;
    return newMem (xs[0], union (xs.slice (1), ys));
}


function intersection (xs, ys) {
    if (xs.length === 0 || ys.length === 0) return [];
    return member (xs[0], ys) ? [ xs[0], ...intersection (xs.slice (1), ys) ]
                              : intersection (xs.slice (1), ys);
}


function difference (xs, ys) {
    if (xs.length === 0 || ys.length === 0) return xs;
    return member (xs[0], ys) ? [ xs[0], ...difference (xs.slice (1), ys) ]
                              : difference (xs.slice (1), ys);
}


function subset (xs, ys) {
    return xs.every (x => member (x, ys));
}


function disjoint (xs, ys) {
    return xs.every (x => !member (x, ys));
}


function setEquality (xs, ys) {
    return subset (xs, ys) && subset (ys, xs);
}


function powerSet (xs) {
    let xs = xs.slice ().reverse ();
    return (function keepGoing (xs, base) {
        return xs.length === 0 ? base
                               : [ keepGoing (xs.slice (1), base), keepGoing (xs.slice (1), [ xs[0], ...base ]) ];
    }) (xs, []).flat (xs.length - 1);
}


function cartesianProd (xs, ys) {
    if (xs.length === 0) return [];
    return (function (xsprod) {
        return (function pair (ys) {
            return ys.length === 0 ? xsprod
                                   : [ [ xs[0], ys[0] ], ...pair (ys.slice (1)) ];
        }) (ys);
    }) (cartesianProd (xs.slice (1), ys));
}


Object.assign (module.exports, {
    card,
    cartesianProd,
    difference,
    disjoint,
    intersection,
    isEmpty,
    member,
    newMem,
    powerSet,
    setEquality,
    setOf,
    subset,
    union,
});
