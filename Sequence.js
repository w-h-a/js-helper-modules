"use strict";


class Stream {
    constructor (curr, next) {
        this.curr = curr;
        this.next = next;
    }
}


class Nil { }


function head (seq) {
    return !(seq instanceof Stream) ? new Error ()
                                    : seq.curr;
}


function tail (seq) {
    return !(seq instanceof Stream) ? new Error
                                    : seq.next ();
}


function iterates (func) {
    return ele => new Stream (ele, () => iterates (func) (func (ele)));
}


function takeN (seq, n) {
    if (!(seq instanceof Stream)) return [];
    return !n ? []
              : [ seq.curr, ...takeN (seq.next (), n - 1) ];
}


function takeUpToN (seq, n) {
    if (!(seq instanceof Stream)) return [];
    return seq.curr <= n ? [ seq.curr, ...takeUpToN (seq.next (), n) ]
                         : [];
}


// functional reduce helper
const foldR = func => init => list =>
    list.length === 0 ? init
                      : func (list[0], foldR (func) (init) (list.slice (1)));


function seqOfArr (arr) {
    return foldR ( (x, q) => new Stream (x, () => q) ) (new Nil ()) (arr);
}


function arrOfSeq (seq) {
    return !(seq instanceof Stream) ? []
                                    : [ seq.curr, ...arrOfSeq (seq.next ()) ];
}


function seqConcat (seqX, seqY) {
    return seqX instanceof Nil ? seqY
                               : new Stream (seqX.curr, () => seqConcat (seqX.next (), seqY));
}


function interleave (seqX, seqY) {
    return seqX instanceof Nil ? seqY
                               : new Stream (seqX.curr, () => interleave (seqY, seqX.next ()));
}


function seqMap (mapper, seq) {
    return seq instanceof Nil ? seq
                              : new Stream (mapper (seq.curr), () => seqMap (mapper, seq.next ()));
}


function seqFilter (condition, seq) {
    return seq instanceof Nil ? seq
                              : condition (seq.curr) ? new Stream (seq.curr, () => seqFilter (condition, seq.next ()))
                                                     : seqFilter (condition, seq.next ());
}


function depthFirst (nextFunc, x, mapper = y => y) {
    const dfs = xs =>
        xs.length === 0 ? new Nil ()
                        : new Stream ( mapper (xs[0]), () => dfs ( [ ...nextFunc (xs[0]), ...xs.slice (1) ] ) );
    return dfs ( [ x ] );
}


function breadthFirst (nextFunc, x, mapper = y => y) {
    const bfs = xs =>
        xs.length === 0 ? new Nil ()
                        : new Stream ( mapper (xs[0]), () => bfs ( [ ...xs.slice (1), ...nextFunc (xs[0]) ] ) );
    return bfs ( [ x ] );
}

/*
Object.assign (module.exports, {
    Nil,
    Stream,
    arrOfSeq,
    breadthFirst,
    depthFirst,
    head,
    interleave,
    iterates,
    seqConcat,
    seqFilter,
    seqMap,
    seqOfArr,
    tail,
    takeN,
    takeUpToN,
});
*/
