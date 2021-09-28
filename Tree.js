"use strict";


class Branch {
    constructor (value, left, right) {
        this.value = value;
        this.left = left;
        this.right = right;
    }
}


class Leaf { }


function size (tree) {
    return tree instanceof Leaf ? 0
                                : 1 + size (tree.left) + size (tree.right);
}


function depth (tree) {
    return tree instanceof Leaf ? 0
                                : 1 + Math.max ( dpeth (tree.left), depth (tree.right) );
}


function reflect (tree) {
    return tree instanceof Leaf ? new Leaf ()
                                : new Branch ( tree.value, reflect (tree.right), reflect (tree.left) );
}


function inorder (tree, values = []) {
    return tree instanceof Leaf ? values
                                : inorder ( tree.left, [ tree.value, ...inorder (tree.right, values) ] );
}


function balanced (list) {
    if (list.length === 0) return new Leaf ();
    const k = Math.floor (list.length / 2);
    const [ y, ...ys ] = list.slice (k);
    return new Branch (y, balanced (list.slice (0, k)), balanced (ys));
}


function completeTree (k, n) {
    return n === 0 ? new Leaf ()
                   : new Branch (k, completeTree (2 * k, n - 1), completeTree (2 * k + 1, n - 1));
}


Object.assign (module.export, {
    Branch,
    Leaf,
    balanced,
    completeTree,
    depth,
    inorder,
    reflect,
    size,
});
