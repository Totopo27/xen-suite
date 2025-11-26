// temperament-operations.js
// Operaciones matemáticas para temperamento 19 (fijo)

var temperament = 19; // fijo
var originalSet = [];
var normalForm = [];
var currentTransposition = 0;
var currentInversion = 0;

function mod(n, m) {
    return ((n % m) + m) % m;
}

function removeDuplicatesAndSort(arr) {
    if (!arr || !arr.length) return [];
    var unique = [];
    for (var i = 0; i < arr.length; i++) {
        if (unique.indexOf(arr[i]) === -1) unique.push(arr[i]);
    }
    // ordenar simple
    for (var i = 0; i < unique.length - 1; i++) {
        for (var j = 0; j < unique.length - i - 1; j++) {
            if (unique[j] > unique[j + 1]) {
                var t = unique[j];
                unique[j] = unique[j + 1];
                unique[j + 1] = t;
            }
        }
    }
    return unique;
}

function calculateNormalForm(set, temp) {
    if (!set || set.length <= 1) return set ? set.slice() : [];
    var cleanSet = removeDuplicatesAndSort(set);
    var n = cleanSet.length;
    var rotations = [];
    for (var i = 0; i < n; i++) {
        var rot = [];
        for (var j = 0; j < n; j++) rot.push(cleanSet[(i + j) % n]);
        rotations.push(rot);
    }
    var best = rotations[0];
    var minSpan = mod(best[best.length - 1] - best[0], temp);
    for (var i = 1; i < rotations.length; i++) {
        var span = mod(rotations[i][rotations[i].length - 1] - rotations[i][0], temp);
        if (span < minSpan) {
            minSpan = span;
            best = rotations[i];
        }
    }
    return best.slice();
}

function transpose(set, interval, temp) {
    if (!set) return [];
    var res = [];
    for (var i = 0; i < set.length; i++) res.push(mod(set[i] + interval, temp));
    // ordenar resultado para presentación
    return res.sort(function(a,b){return a-b});
}

function invert(set, index, temp) {
    if (!set) return [];
    var res = [];
    for (var i = 0; i < set.length; i++) res.push(mod(index - set[i], temp));
    return res.sort(function(a,b){return a-b});
}
