class Node {
    constructor (data, next = null) {
        this.data = data;
        this.next = next;
    }
}


class LinkedList {
    constructor (head = null) {
        this.head = head;
    }
}


// unexposed helpers
const search =
    list =>
        value =>
            current =>
                !list.head
                    ? null
                    : list.head.data === value
                        ? current
                        : search (new LinkedList (list.head.next)) (value) (current + 1);


const finalNodes =
    list =>
        !list.head
            ? null
            : new Node ( list.head.data
                       , finalNodes (new LinkedList (list.head.next))
                       );


const insert =
    list =>
        idx =>
            value =>
                current =>
                    current === idx - 1
                        ? new Node ( list.head.data
                                   , new Node ( value
                                              , finalNodes (new LinkedList (list.head.next))
                                              )
                                   )
                        : new Node ( list.head.data
                                   , insert (new LinkedList (list.head.next)) (idx) (value) (current + 1)
                                   );


const deleteHelper =
    list =>
        idx =>
            current =>
                current === idx - 1
                    ? new Node ( list.head.data
                               , finalNodes (new LinkedList (list.head.next.next))
                               )
                    : new Node ( list.head.data
                               , deleteHelper (new LinkedList (list.head.next)) (idx) (current + 1)
                               );


const ofCollectionHelper =
    col =>
        col.length === 1
            ? new Node (col[0])
            : new Node (col[0], ofCollectionHelper (col.slice (1)));


const addLen =
    (n, list) =>
        !list.head
            ? n
            : addLen (n + 1, new LinkedList (list.head.next));


const takeHelper =
    (list, idx) =>
        idx <= 0 || !list.head
            ? null
            : new Node ( list.head.data
                       , takeHelper (new LinkedList (list.head.next), idx - 1)
                       );


const dropHelper =
    (list, idx) =>
        idx <= 0 || !list.head
            ? new Node ( list.head.data
                       , list.head.next
                       )
            : dropHelper (new LinkedList (list.head.next), idx - 1);


const appendHelper =
    (xs, ys) =>
        !xs.head
            ? ys.head
            : !ys.head
                ? xs.head
                : new Node ( xs.head.data
                           , appendHelper (new LinkedList (xs.head.next), ys)
                           );


const revAppendHelper =
    (xs, ys) =>
        new Node ( xs.head.data
                 , ys.head
                 );


const revAppend =
    (xs, ys) =>
        !xs.head
            ? ys
            : revAppend ( new LinkedList (xs.head.next)
                        , new LinkedList (revAppendHelper (xs, ys))
                        );


const zipHelper =
    (xs, ys) =>
        !xs.head || !ys.head
            ? null
            : new Node ( [ xs.head.data, ys.head.data ]
                       , zipHelper ( new LinkedList (xs.head.next)
                                   , new LinkedList (ys.head.next)
                                   )
                       );


const unzipHelper =
    listOfPairs =>
        x =>
            !listOfPairs.head
                ? null
                : x
                    ? new Node ( listOfPairs.head.data[0]
                               , unzipHelper (new LinkedList (listOfPairs.head.next)) (x)
                               )
                    : new Node ( listOfPairs.head.data[1]
                               , unzipHelper (new LinkedList (listOfPairs.head.next)) (x)
                               );


// exposed
const indexOfValue =
    list =>
        value =>
            search (list) (value) (0);


const insertAtIndex =
    list =>
        idx =>
            value =>
                !list.head
                    ? new LinkedList (new Node (value))
                    : idx === 0
                        ? new LinkedList (new Node (value, list.head))
                        : new LinkedList (insert (list) (idx) (value) (0));


const deleteAtIndex =
    list =>
        idx =>
            !list.head
                ? new LinkedList ()
                : idx === 0
                    ? new LinkedList (list.head.next)
                    : new LinkedList (deleteHelper (list) (idx) (0));


const listOfArr =
    arr =>
        arr.length === 0
            ? new LinkedList ()
            : new LinkedList (ofCollectionHelper (arr));


const arrOfList =
    list =>
        !list.head
            ? []
            : [ list.head.data
              , ...arrOfList (new LinkedList (list.head.next))
              ];


const nLength =
    list =>
        addLen (0, list);


const upto =
    (m, n) =>
        (newList = new LinkedList ()) =>
            m === n
                ? insertAtIndex (newList) (0) (n)
                : upto (m, n - 1) (insertAtIndex (newList) (0) (n));


const maxOfList =
    list =>
        !list.head
            ? null
            : !list.head.next
                ? list.head.data
                : (greatest =>
                      list.head.data > greatest
                          ? list.head.data
                          : greatest
                  ) (maxOfList (new LinkedList (list.head.next)));


const explode =
    str =>
        str.length === 0
            ? new LinkedList ()
            : new LinkedList (ofCollectionHelper (str));


const implode =
    list =>
        !list.head
            ? ""
            : `${list.head.data}${implode (new LinkedList (list.head.next))}`;


const isEmpty =
    list =>
        !list.head;


const head =
    list =>
        !(list instanceof LinkedList) || !list.head
            ? null
            : list.head.data;


const tail =
    list =>
        !list.head
            ? null
            : new LinkedList (list.head.next);


const last =
    list =>
        !list.head
            ? null
            : !list.head.next
                ? list.head.data
                : last (new LinkedList (list.head.next));


const take =
    (list, idx) =>
        !list.head
            ? new LinkedList ()
            : new LinkedList (takeHelper (list, idx));


const drop =
    (list, idx) =>
        !list.head
            ? new LinkedList ()
            : new LinkedList (dropHelper (list, idx));


const nth =
    (list, idx) =>
        head (drop (list, idx));


const append =
    (xs, ys) =>
        new LinkedList (appendHelper (xs, ys));


const reverse =
    xs =>
        revAppend (xs, new LinkedList ());


const concat =
    listOfLists =>
        !listOfLists.head
            ? new LinkedList ()
            : append ( listOfLists.head.data
                     , concat (new LinkedList (listOfLists.head.next))
                     );


const zip =
    (xs, ys) =>
        new LinkedList (zipHelper (xs, ys));


const unzip =
    listOfPairs =>
        !listOfPairs.head
            ? [ new LinkedList (), new LinkedList () ]
            : [ new LinkedList (unzipHelper (listOfPairs) (true))
              , new LinkedList (unzipHelper (listOfPairs) (false))
              ];


Object.assign (module.exports, {
    Node,
    LinkedList,
    indexOfValue, // search
    insertAtIndex, // update
    deleteAtIndex, // delete
    listOfArr,
    arrOfList,
    nLength,
    upto,
    maxOfList,
    explode,
    implode,
    isEmpty,
    head,
    tail,
    last,
    take,
    drop,
    nth, // read
    append,
    reverse,
    concat,
    zip,
    unzip,
});
