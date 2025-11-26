// ============================================
// GENERADOR COMPLETO DE MOMENTOS DE SIMETRÍA (MOS)
// ============================================

/**
 * Verifica si dos números son coprimos (no comparten factores comunes excepto 1)
 */
function coprime(...numbers) {
    const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
    
    if (numbers.length < 2) return true;
    
    let result = numbers[0];
    for (let i = 1; i < numbers.length; i++) {
        result = gcd(result, numbers[i]);
        if (result === 1) return true;
    }
    return result === 1;
}

/**
 * Genera los puntos de escala acumulando el generador dentro del período
 */
function getMosPoints(period, generator) {
    const mosPoints = [0];
    let nextPoint = generator % period;
    
    while (nextPoint !== 0) {
        mosPoints.push(nextPoint);
        nextPoint = (nextPoint + generator) % period;
    }
    
    mosPoints.push(period);
    return mosPoints;
}

/**
 * Calcula las diferencias entre puntos consecutivos (intervalos)
 */
function getDiffs(points) {
    const diffs = [];
    for (let i = 0; i < points.length - 1; i++) {
        diffs.push(points[i + 1] - points[i]);
    }
    return diffs;
}

/**
 * Extrae los momentos válidos de MOS de la secuencia de puntos
 */
function mosPointsToMos(mosPoints) {
    const moses = [];
    let waiting = [mosPoints[mosPoints.length - 1]];
    
    for (let i = 0; i < mosPoints.length - 1; i++) {
        const point = mosPoints[i];
        const points = [...waiting, ...(moses.length > 0 ? moses[moses.length - 1] : []), point].sort((a, b) => a - b);
        const intervals = getDiffs(points);
        
        const intervalSet = new Set(intervals);
        
        if (intervalSet.size === 2 && intervalSet.has(1) && intervalSet.has(2)) {
            moses.push(points);
            break;
        }
        
        if (intervalSet.size <= 2) {
            const frequencies = {};
            intervals.forEach(interval => {
                frequencies[interval] = (frequencies[interval] || 0) + 1;
            });
            
            const counts = Object.values(frequencies);
            if (coprime(...counts)) {
                moses.push(points);
                waiting = [];
                continue;
            }
        }
        
        waiting.push(point);
    }
    
    return moses;
}

/**
 * Convierte puntos de grados a intervalos
 */
function mosAsIntervals(mos) {
    return mos.map(points => getDiffs(points));
}

/**
 * Genera todas las escalas MOS para un par período/generador
 */
function makeMos(period, generator) {
    const trueMos = coprime(period, generator);
    
    if (!trueMos) {
        console.warn(`El período (${period}) y el generador (${generator}) no son coprimos. No es un MOS verdadero.`);
    }
    
    const mosPoints = getMosPoints(period, generator);
    const mos = mosPointsToMos(mosPoints);
    const intervals = mosAsIntervals(mos);
    
    return {
        scales: intervals,
        trueMos: trueMos,
        period: period,
        generator: generator
    };
}

/**
 * Obtiene todas las rotaciones de un array
 */
function getAllRotations(arr) {
    const rotations = [];
    for (let i = 0; i < arr.length; i++) {
        rotations.push([...arr.slice(i), ...arr.slice(0, i)]);
    }
    return rotations;
}

/**
 * Agrupa un MOS según un patrón
 */
function group(mos, pattern) {
    const groups = [];
    let mosIndex = 0;
    
    for (const groupSize of pattern) {
        const group = mos.slice(mosIndex, mosIndex + groupSize);
        groups.push(group);
        mosIndex += groupSize;
    }
    
    return groups;
}

/**
 * Convierte grupos a subMOS sumando cada grupo
 */
function groupsToSubmos(groups) {
    return groups.map(group => group.reduce((sum, val) => sum + val, 0));
}

/**
 * Aplica un patrón a todas las rotaciones del MOS
 */
function makeSubmosForPattern(mos, pattern) {
    const rotations = getAllRotations(mos);
    
    return rotations.map((rotation, index) => {
        const submos = groupsToSubmos(group(rotation, pattern));
        return {
            mos: submos,
            degree: index,
            rotation: rotation
        };
    });
}

/**
 * Convierte un patrón MOS a grados EDO
 */
function patternToDegrees(pattern) {
    const degrees = [0];
    let sum = 0;
    
    for (let i = 0; i < pattern.length - 1; i++) {
        sum += pattern[i];
        degrees.push(sum);
    }
    
    return degrees;
}

/**
 * Genera ratios EDO para un número de divisiones
 */
function edoRatios(divisions, boundingRatio = 2) {
    const ratios = [];
    for (let i = 0; i < divisions; i++) {
        ratios.push(Math.pow(boundingRatio, i / divisions));
    }
    return ratios;
}

/**
 * Convierte un patrón MOS a una escala EDO tocable
 */
function fromPattern(pattern, period = 2) {
    const divisions = pattern.reduce((sum, val) => sum + val, 0);
    const edo = edoRatios(divisions, period);
    const degrees = patternToDegrees(pattern);
    
    return {
        meta: {
            pattern: pattern,
            divisions: divisions,
            period: period
        },
        scale: degrees.map((degree, index) => ({
            originalDegree: degree,
            degree: index,
            boundedRatio: edo[degree],
            boundingPeriod: period
        }))
    };
}

// ============================================
// FUNCIONES DE MOS SECUNDARIOS
// ============================================

/**
 * Encuentra todos los divisores válidos de un patrón MOS
 */
function findDivisors(mos) {
    const mosLength = mos.length;
    const divisors = [];
    
    for (let i = 2; i <= Math.floor(mosLength / 2); i++) {
        if (mosLength % i === 0) {
            divisors.push(i);
        }
    }
    
    divisors.push(mosLength);
    
    return divisors;
}

/**
 * Crea un patrón de agrupación basado en un divisor
 */
function createPattern(mos, divisor) {
    const groupSize = Math.floor(mos.length / divisor);
    const pattern = [];
    
    for (let i = 0; i < divisor; i++) {
        pattern.push(groupSize);
    }
    
    return pattern;
}

/**
 * Calcula el generador para el MOS secundario
 */
function calculateSubGenerator(originalGenerator, divisor, period) {
    return (originalGenerator * divisor) % period;
}

/**
 * Ordena los submodos usando la estrategia del generador
 */
function orderSubmosUsingGeneratorStrategy(generator, submos) {
    const submosSize = submos.length;
    const mosPoints = getMosPoints(submosSize, generator);
    const indexes = mosPoints.slice(0, -1);
    
    const result = indexes.map(idx => submos[idx]);
    
    return result.length === submosSize ? result : submos;
}

/**
 * Genera todos los MOS secundarios posibles para un patrón MOS dado
 */
function makeAllSubmos(generator, selectedMos) {
    const period = selectedMos.reduce((sum, val) => sum + val, 0);
    const allSubmos = [];
    
    const divisors = findDivisors(selectedMos);
    
    divisors.forEach(divisor => {
        const pattern = createPattern(selectedMos, divisor);
        if (!pattern) return;
        
        const subGenerator = calculateSubGenerator(generator, divisor, period);
        const rotations = getAllRotations(selectedMos);
        
        const submosData = rotations.map((rotation, degree) => {
            const grouped = group(rotation, pattern);
            const mos = groupsToSubmos(grouped);
            const mosDegrees = patternToDegrees(mos);
            
            return {
                mos: mos,
                degree: degree,
                mosDegrees: mosDegrees,
                rotation: rotation
            };
        });
        
        const isTrueSubmos = coprime(subGenerator, period);
        
        allSubmos.push({
            pattern: selectedMos,
            generator: subGenerator,
            period: period,
            divisor: divisor,
            isTrueSubmos: isTrueSubmos,
            submos: submosData
        });
    });
    
    return allSubmos;
}

/**
 * Función de utilidad para obtener solo MOS secundarios verdaderos
 */
function getTrueSubmos(allSubmos) {
    return allSubmos.filter(data => data.isTrueSubmos);
}
