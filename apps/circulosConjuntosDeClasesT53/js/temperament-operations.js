/**
 * Temperament Operations Module
 * Handles mathematical operations for temperament theory
 */

// Global variables
var temperament = 53;
var originalSet = [];
var normalForm = [];
var currentTransposition = 0;
var currentInversion = 0;

/**
 * Modulo operation that handles negative numbers correctly
 * @param {number} n - The number to perform modulo on
 * @param {number} m - The modulo divisor
 * @returns {number} The result of n mod m
 */
function mod(n, m) {
    return ((n % m) + m) % m;
}

/**
 * Removes duplicates from array and sorts it
 * @param {Array} arr - Input array
 * @returns {Array} Sorted array without duplicates
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
        if (!isDuplicate) {
            unique.push(arr[i]);
        }
    }
    
    for (var i = 0; i < unique.length - 1; i++) {
        for (var j = 0; j < unique.length - i - 1; j++) {
            if (unique[j] > unique[j + 1]) {
                var temp = unique[j];
                unique[j] = unique[j + 1];
                unique[j + 1] = temp;
            }
        }
    }
    return unique;
}

/**
 * Calculates the normal form of a pitch class set
 * @param {Array} set - Input pitch class set
 * @param {number} temp - Temperament (number of divisions per octave)
 * @returns {Array} Normal form of the set
 */
function calculateNormalForm(set, temp) {
    if (set.length <= 1) return set;
    
    var cleanSet = removeDuplicatesAndSort(set);
    var rotations = [];
    
    for (var i = 0; i < cleanSet.length; i++) {
        var rotation = [];
        for (var j = 0; j < cleanSet.length; j++) {
            var index = (i + j) % cleanSet.length;
            rotation.push(cleanSet[index]);
        }
        rotations.push(rotation);
    }
    
    var bestRotation = rotations[0];
    var minSpan = mod(bestRotation[bestRotation.length - 1] - bestRotation[0], temp);
    
    for (var i = 1; i < rotations.length; i++) {
        var span = mod(rotations[i][rotations[i].length - 1] - rotations[i][0], temp);
        if (span < minSpan) {
            minSpan = span;
            bestRotation = rotations[i];
        }
    }
    
    return bestRotation;
}

/**
 * Transposes a pitch class set by a given interval
 * @param {Array} set - Input pitch class set
 * @param {number} interval - Transposition interval
 * @param {number} temp - Temperament
 * @returns {Array} Transposed set
 */
function transpose(set, interval, temp) {
    var result = [];
    for (var i = 0; i < set.length; i++) {
        result.push(mod(set[i] + interval, temp));
    }
    return result;
}

/**
 * Inverts a pitch class set around a given index
 * @param {Array} set - Input pitch class set
 * @param {number} index - Inversion index
 * @param {number} temp - Temperament
 * @returns {Array} Inverted and sorted set
 */
function invert(set, index, temp) {
    var result = [];
    for (var i = 0; i < set.length; i++) {
        result.push(mod(index - set[i], temp));
    }
    
    for (var i = 0; i < result.length - 1; i++) {
        for (var j = 0; j < result.length - i - 1; j++) {
            if (result[j] > result[j + 1]) {
                var temp_val = result[j];
                result[j] = result[j + 1];
                result[j + 1] = temp_val;
            }
        }
    }
    return result;
}
