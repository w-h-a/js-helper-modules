const notate =
    (p, k) =>
        p instanceof Atom
            ? p.value
            : p instanceof Negation
                ? `~${notate (p.base, 3)}`
                : p instanceof Conjunction
                    ? k > 2
                        ? `(${notate (p.left, k)} & ${notate (p.right, k)})`
                        : `${notate (p.left, 2)} & ${notate (p.right, 2)}`
                    : p instanceof Disjunction
                        ? k > 1
                            ? `(${notate (p.left, k)} | ${notate (p.right, k)})`
                            : `${notate (p.left, 1)} | ${notate (p.right, 1)}`
                        : null;


class Atom {
    constructor (value) {
        this.value = value;
    }
}


class Negation {
    constructor (prop) {
        this.base = prop;
        this.value = `~${notate (prop, 3)}`;
    }
}


class Conjunction {
    constructor (conjunct1, conjunct2) {
        this.left = conjunct1;
        this.right = conjunct2;
        this.value = `(${notate (conjunct1, 2)} & ${notate (conjunct2, 2)})`;
    }
}


class Disjunction {
    constructor (disjunct1, disjunct2) {
        this.left = disjunct1;
        this.right = disjunct2;
        this.value = `(${notate (disjunct1, 1)} | ${notate (disjunct2, 1)})`;
    }
}


const implies =
    (p, q) =>
        new Disjunction (new Negation (p), q);


// isTautology and its helpers
const negationNormalForm =
    p =>
        p instanceof Atom || (p instanceof Negation && p.base instanceof Atom)
            ? p
            : p instanceof Negation && p.base instanceof Negation
                ? negationNormalForm (p.base.base)
                : p instanceof Negation && p.base instanceof Conjunction
                    ? negationNormalForm (new Disjunction (new Negation (p.base.left), new Negation (p.base.right)))
                    : p instanceof Negation && p.base instanceof Disjunction
                        ? negationNormalForm (new Conjunction (new Negation (p.base.left), new Negation (p.base.right)))
                        : p instanceof Conjunction
                            ? new Conjunction (negationNormalForm (p.left), negationNormalForm (p.right))
                            : p instanceof Disjunction
                                ? new Disjunction (negationNormalForm (p.left), negationNormalForm (p.right))
                                : null;


const distribute =
    (p, q) =>
        q instanceof Conjunction
            ? new Conjunction (distribute (p, q.left), distribute (p, q.right))
            : p instanceof Conjunction
                ? new Conjunction (distribute (p.left, q), distribute (p.right, q))
                : new Disjunction (p, q);


const conjunctiveNormalForm =
    p =>
        p instanceof Conjunction
            ? new Conjunction (conjunctiveNormalForm (p.left), conjunctiveNormalForm (p.right))
            : p instanceof Disjunction
                ? distribute (conjunctiveNormalForm (p.left), conjunctiveNormalForm (p.right))
                : p;


const positives =
    p =>
        p instanceof Atom
            ? [ p ]
            : p instanceof Negation
                ? []
                : p instanceof Disjunction
                    ? [ ...positives (p.left), ...positives (p.right) ]
                    : new Error ("whoops!");


const negatives =
    p =>
        p instanceof Atom
            ? []
            : p instanceof Negation
                ? [ p.base ]
                : p instanceof Disjunction
                    ? [ ...negatives (p.left), ...negatives (p.right) ]
                    : new Error ("whoops!");


const intersection =
    (xs, ys) =>
        xs.length === 0 || ys.length === 0
            ? []
            : ys.includes (xs[0])
                ? [ xs[0], ...intersection (xs.slice (1), ys) ]
                : intersection (xs.slice (1), ys);


const valueOfProp =
    prop =>
        prop.value;


const getAnswer =
    p =>
        p instanceof Conjunction
            ? getAnswer (p.left) && getAnswer (p.right)
            : intersection ( positives (p).map (valueOfProp)
                           , negatives (p).map (valueOfProp)
                           )
                           .length !== 0;


const isTautology =
    p =>
        getAnswer (conjunctiveNormalForm (negationNormalForm (p)));


Object.assign (module.exports, {
    Atom,
    Conjunction,
    Disjunction,
    Negation,
    implies,
    isTautology,
});
