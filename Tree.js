class Branch {
    constructor (value, left, right) {
        this.value = value;
        this.left = left;
        this.right = right;
    }
}


class Leaf { }


// non-exposed helpers
const rightOf =
    transient =>
        transient.left instanceof Branch
            ? new Branch ( transient.value
                         , rightOf (transient.left)
                         , transient.right
                         )
            : transient.right;


const lift =
    transient =>
        transient.left instanceof Branch
            ? lift (transient.left)
            : transient.value;


// exposed
const size =
    tree =>
        tree instanceof Leaf
            ? 0
            : 1 + size (tree.left) + size (tree.right);


const depth =
    tree =>
        tree instanceof Leaf
            ? 0
            : 1 + Math.max (depth (tree.left), depth (tree.right));


const reflect =
    tree =>
        tree instanceof Leaf
            ? new Leaf ()
            : new Branch (tree.value, reflect (tree.right), reflect (tree.left));


const inorder =
    (tree, values = []) =>
        tree instanceof Leaf
            ? values
            : inorder (tree.left, [ tree.value, ...inorder (tree.right, values) ]);


const balanced =
    arr =>
        arr.length === 0
            ? new Leaf ()
            : (k =>
                  (([ y, ...ys ]) =>
                      new Branch (y, balanced (arr.slice (0, k)), balanced (ys))
                  ) (arr.slice (k))
              ) (Math.floor (arr.length / 2));


const completeTree =
    (k, n) =>
        n === 0
            ? new Leaf ()
            : new Branch ( k
                         , completeTree (2 * k, n - 1)
                         , completeTree (2 * k + 1, n - 1)
                         );


const lookup =
    (tree, value) =>
        tree instanceof Leaf
            ? null
            : tree.value > value
                ? lookup (tree.left, value)
                : tree.value < value
                    ? lookup (tree.right, value)
                    : tree;


const insert =
    (tree, value) =>
        tree instanceof Leaf
            ? new Branch (value, new Leaf (), new Leaf ())
            : tree.value > value
                ? new Branch (tree.value, insert (tree.left, value), tree.right)
                : tree.value < value
                    ? new Branch (tree.value, tree.left, insert (tree.right, value))
                    : new Error ("entry already exists");


const destroy =
    (tree, value) =>
        tree instanceof Leaf
            ? new Leaf ()
            : tree.value > value
                ? new Branch (tree.value, destroy (tree.left, value), tree.right)
                : tree.value < value
                    ? new Branch (tree.value, tree.left, destroy (tree.right, value))
                    : tree.left instanceof Leaf
                        ? tree.right
                        : tree.right instanceof Leaf
                            ? tree.left
                            : new Branch ( lift (tree.right)
                                         , tree.left
                                         , rightOf (tree.right)
                                         ); // not proud of this


const max =
    tree =>
        tree.right instanceof Branch
            ? max (tree.right)
            : tree.value;


Object.assign (module.exports, {
    Branch,
    Leaf,
    balanced,
    completeTree,
    depth,
    destroy, // delete
    inorder,
    insert, // insert
    lookup, // search
    max,
    reflect,
    size,
});
