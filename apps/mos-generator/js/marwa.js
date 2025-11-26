// Funciones auxiliares  
function getGeneratorSequence(scale, interval) {  
  const repeated = Array(scale.length * 2).fill(scale).flat();  
  const result = [];  
    
  for (let i = 0; i < scale.length; i++) {  
    let sum = 0;  
    for (let j = 0; j < interval; j++) {  
      sum += repeated[i + j];  
    }  
    result.push(sum);  
  }  
    
  return result;  
}  
  
function getReciprocalInterval(G, C) {  
  return (2 * G) - C;  
}  
  
function basePermutations(scaleLen, G, C) {  
  const R = getReciprocalInterval(G, C);  
  const group = [R, C];  
  const maxGroups = Math.floor(scaleLen / 2);  
  const results = [];  
    
  for (let total = 1; total < maxGroups; total++) {  
    const generatorSeq = [  
      ...Array(total).fill(group).flat(),  
      ...Array(scaleLen - 1 - (2 * total)).fill(G),  
      C  
    ];  
      
    results.push({  
      groupSize: 2 * total,  
      generatorSeq: generatorSeq,  
      initialIndex: 0  
    });  
  }  
    
  return results;  
}  
  
function permutateRangeFwd(start, end, vec) {  
  const part1 = vec.slice(0, start);  
  const part2 = vec.slice(end + 1);  
  const range = vec.slice(start, end);  
  const permutatedItem = vec.slice(end, end + 1);  
    
  return [...part1, ...permutatedItem, ...range, ...part2];  
}  
  
function allRangePermutations(generatorSeq, rangeLen, initialIndex) {  
  const permsStartIndexes = [];  
  const limit = generatorSeq.length - rangeLen - 2 - initialIndex;  
    
  for (let i = 0; i < limit; i++) {  
    permsStartIndexes.push(i + initialIndex);  
  }  
    
  const results = [{  
    generatorSeq: generatorSeq,  
    groupSize: rangeLen,  
    initialIndex: initialIndex  
  }];  
    
  for (const idx of permsStartIndexes) {  
    const prevScale = results[results.length - 1].generatorSeq;  
    const scale = permutateRangeFwd(idx, idx + rangeLen, prevScale);  
      
    results.push({  
      generatorSeq: scale,  
      groupSize: rangeLen,  
      initialIndex: idx + 1  
    });  
  }  
    
  return results;  
}  
  
function intervalSeqToDegs(scaleSize, intervalSeq) {  
  const degs = [];  
  let current = 0;  
    
  for (const interval of intervalSeq) {  
    current = (current + interval) % scaleSize;  
    degs.push(current);  
  }  
    
  return degs;  
}  
  
function degsToScale(scaleSize, degs) {  
  const sorted = [...degs, scaleSize].sort((a, b) => a - b);  
  const scale = [];  
    
  for (let i = 0; i < sorted.length - 1; i++) {  
    scale.push(sorted[i + 1] - sorted[i]);  
  }  
    
  return scale;  
}  
  
function intervalsToScale(scaleSize, intervals) {  
  const degs = intervalSeqToDegs(scaleSize, intervals);  
  return degsToScale(scaleSize, degs);  
}  
  
// Función principal para obtener secuencias generadoras posibles  
function getPossibleGeneratorSequences(scale) {  
  const results = [];  
    
  for (let generator = 1; generator < scale.length; generator++) {  
    const sequence = getGeneratorSequence(scale, generator);  
    const freqs = {};  
      
    for (const val of sequence) {  
      freqs[val] = (freqs[val] || 0) + 1;  
    }  
      
    const keys = Object.keys(freqs);  
    const isBestSequence = keys.length === 2 &&   
                          Object.values(freqs).includes(1);  
      
    results.push({  
      generator: generator,  
      sequence: sequence,  
      generatorFreqs: freqs,  
      bestSequence: isBestSequence,  
      sortedGeneratorsByHighFreq: Object.entries(freqs)  
        .sort((a, b) => b[1] - a[1])  
        .map(([k, v]) => parseInt(k))  
    });  
  }  
    
  return results;  
}