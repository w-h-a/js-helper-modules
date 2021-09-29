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


const leftRem =
    tree =>
        tree.left instanceof Leaf && tree.right instanceof Leaf
            ? [ tree.value, new Leaf () ]
            : (([ w, t ]) =>
                  [ w
                  , new Branch (tree.value, tree.right, t)
                  ]
              ) (leftRem (tree.left));


const siftDown =
    (priority, tree1, tree2) =>
        tree1 instanceof Leaf && tree2 instanceof Leaf
            ? new Branch (priority, new Leaf (), new Leaf ())
            : tree2 instanceof Leaf
                ? priority <= tree1.value
                    ? new Branch (priority, tree1, new Leaf ())
                    : new Branch (tree1.value, new Branch (priority, new Leaf (), new Leaf ()), new Leaf ())
                : priority <= tree1.value && priority <= tree2.value
                    ? new Branch (priority, tree1, tree2)
                    : tree1.value <= tree2.value
                        ? new Branch (tree1.value, siftDown (priority, tree1.left, tree1.right), tree2)
                        : new Branch (tree2.value, tree1, siftDown (priority, tree2.left, tree2.right));


const heapify =
    (n, arr) =>
        n === 0
            ? [ new Leaf (), arr ]
            : (([ t1, arr1 ]) =>
                  (([ t2, arr2 ]) =>
                      [ siftDown (arr[0], t1, t2)
                      , arr2
                      ]
                  ) (heapify (Math.floor ((n - 1) / 2), arr1))
              ) (heapify (Math.floor (n / 2), arr.slice (1)));


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
                                         ); // will fix


const max =
    tree =>
        tree.right instanceof Branch
            ? max (tree.right)
            : tree.value;


const isEmpty =
    tree =>
        tree instanceof Leaf
            ? true
            : tree instanceof Branch
                ? false
                : null;


// heaps only
const heapInsert =
    (priority, tree) =>
        tree instanceof Leaf
            ? new Branch (priority, new Leaf (), new Leaf ())
            : priority <= tree.value
                ? new Branch ( priority
                             , heapInsert (tree.value, tree.right)
                             , tree.left
                             )
                : new Branch ( tree.value
                             , heapInsert (priority, tree.right)
                             , tree.left
                             );


const delMin =
    tree =>
        tree instanceof Leaf
            ? new Error ("empty queue")
            : tree.left instanceof Leaf
                ? new Leaf ()
                : (([ w, t ]) =>
                      siftDown (w, tree.right, t)
                  ) (leftRem (tree.left));


const min =
    tree =>
        tree.value;


const heapOfArr =
    arr =>
        heapify (arr.length, arr)[0];


const arrOfHeap =
    tree =>
        tree instanceof Leaf
            ? []
            : [ tree.value
              , ...arrOfHeap (delMin (tree))
              ];


const heapSort =
    arr =>
        arrOfHeap (heapOfArr (arr));


Object.assign (module.exports, {
    Branch,
    Leaf,
    arrOfHeap,
    balanced, // treeOfArr
    completeTree,
    depth,
    delMin, // delete for heaps
    destroy, // delete
    heapInsert, // insert for heaps
    heapOfArr,
    heapSort,
    inorder, // arrOfTree
    insert, // insert
    isEmpty,
    lookup, // search
    max,
    min, // heaps
    reflect,
    size,
});
