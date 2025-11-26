// temperament-operations.js
// Operaciones matemáticas para temperamento 41

var temperament = 41;
var originalSet = [];
var normalForm = [];
var currentTransposition = 0;
var currentInversion = 0;

/**
 * modulo que funciona con negativos
 */
function mod(n, m) {
    return ((n % m) + m) % m;
}

/**
 * eliminar duplicados y ordenar (implementación simple)
 */
function removeDuplicatesAndSort(arr) {
    var unique = [];
    for (var i = 0; i < arr.length; i++) {
        var isDuplicate = false;
        for (var j = 0; j < unique.length; j++) {
            if (arr[i] === unique[j]) {
                isDuplicate = true;
                break;
            }
        }
        if (!isDuplicate) unique.push(arr[i]);
    }

    // ordenamiento por burbuja (pequeñas listas; suficiente y sin dependencias)
    for (var i = 0; i < unique.length - 1; i++) {
        for (var j = 0; j < unique.length - i - 1; j++) {
            if (unique[j] > unique[j + 1]) {
                var tmp = unique[j];
                unique[j] = unique[j + 1];
                unique[j + 1] = tmp;
            }
        }
    }
    return unique;
}

/**
 * calcula la forma normal del conjunto
 */
function calculateNormalForm(set, temp) {
    if (!set || set.length <= 1) return set ? set.slice() : [];
    var cleanSet = removeDuplicatesAndSort(set);
    var n = cleanSet.length;
    var rotations = [];

    // crear rotaciones
    for (var i = 0; i < n; i++) {
        var rot = [];
        for (var j = 0; j < n; j++) rot.push(cleanSet[(i + j) % n]);
        rotations.push(rot);
    }

    // seleccionar rotación con menor span (último - primero) modulo temp
    var best = rotations[0];
    var minSpan = mod(best[best.length - 1] - best[0], temp);

    for (var i = 1; i < rotations.length; i++) {
        var r = rotations[i];
        var span = mod(r[r.length - 1] - r[0], temp);
        if (span < minSpan) {
            minSpan = span;
            best = r;
        }
    }

    return best.slice();
}

/**
 * Transposición modular Tn
 */
function transpose(set, interval, temp) {
    if (!set) return [];
    var res = [];
    for (var i = 0; i < set.length; i++) {
        res.push(mod(set[i] + interval, temp));
    }
    return res;
}

/**
 * Inversión alrededor de índice dado (I_n)
 */
function invert(set, index, temp) {
    if (!set) return [];
    var res = [];
    for (var i = 0; i < set.length; i++) {
        res.push(mod(index - set[i], temp));
    }

    // ordenar resultado
    for (var i = 0; i < res.length - 1; i++) {
        for (var j = 0; j < res.length - i - 1; j++) {
            if (res[j] > res[j + 1]) {
                var t = res[j];
                res[j] = res[j + 1];
                res[j + 1] = t;
            }
        }
    }
    return res;
}
