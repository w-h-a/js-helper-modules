"use strict";


function randomIntOfMinMax (min, max) {
    return Math.floor (Math.random () * (max - min + 1) + min);
}


function randomNumOfMinMax (min, max) {
    return Math.random () * (max - min) + min;
}


Object.assign (module.exports, {
    randomIntOfMinMax,
    randomNumOfMinMax,
});
