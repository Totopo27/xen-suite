// temperament-operations.js
// Operaciones matemáticas para temperamento 31

var temperament = 31;
var originalSet = [];
var normalForm = [];
var currentTransposition = 0;
var currentInversion = 0;

function mod(n, m) {
  return ((n % m) + m) % m;
}

function removeDuplicatesAndSort(arr) {
  var unique = [];
  for (var i = 0; i < arr.length; i++) {
    if (!unique.includes(arr[i])) unique.push(arr[i]);
  }
  return unique.sort((a, b) => a - b);
}

function calculateNormalForm(set, temp) {
  if (!set || set.length <= 1) return set ? set.slice() : [];
  var cleanSet = removeDuplicatesAndSort(set);
  var n = cleanSet.length;
  var rotations = [];
  for (var i = 0; i < n; i++) {
    rotations.push(cleanSet.map((_, j) => cleanSet[(i + j) % n]));
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
  return set.map(x => mod(x + interval, temp));
}

function invert(set, index, temp) {
  return set.map(x => mod(index - x, temp)).sort((a, b) => a - b);
}
