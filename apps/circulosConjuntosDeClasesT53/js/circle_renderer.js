/**
 * Circle Renderer Module
 * Handles SVG rendering and user interaction for the circle interface
 */

// Segment definitions for Temperament 53
const segments = [
    { value: 0, color: '#e0e0e0', label: 'C' },
    { value: 1, color: '#4a90e2' },
    { value: 2, color: '#6fb369' },
    { value: 3, color: '#4a90e2' },
    { value: 4, color: '#000000' },
    { value: 5, color: '#000000' },
    { value: 6, color: '#4a90e2' },
    { value: 7, color: '#6fb369' },
    { value: 8, color: '#4a90e2' },
    { value: 9, color: '#e0e0e0', label: 'D' },
    { value: 10, color: '#4a90e2' },
    { value: 11, color: '#6fb369' },
    { value: 12, color: '#4a90e2' },
    { value: 13, color: '#000000' },
    { value: 14, color: '#000000' },
    { value: 15, color: '#4a90e2' },
    { value: 16, color: '#6fb369' },
    { value: 17, color: '#4a90e2' },
    { value: 18, color: '#e0e0e0', label: 'E' },
    { value: 19, color: '#4a90e2' },
    { value: 20, color: '#4a90e2' },
    { value: 21, color: '#4a90e2' },
    { value: 22, color: '#e0e0e0', label: 'F' },
    { value: 23, color: '#4a90e2' },
    { value: 24, color: '#6fb369' },
    { value: 25, color: '#4a90e2' },
    { value: 26, color: '#000000' },
    { value: 27, color: '#000000' },
    { value: 28, color: '#4a90e2' },
    { value: 29, color: '#6fb369' },
    { value: 30, color: '#4a90e2' },
    { value: 31, color: '#e0e0e0', label: 'G' },
    { value: 32, color: '#4a90e2' },
    { value: 33, color: '#6fb369' },
    { value: 34, color: '#4a90e2' },
    { value: 35, color: '#000000' },
    { value: 36, color: '#000000' },
    { value: 37, color: '#4a90e2' },
    { value: 38, color: '#6fb369' },
    { value: 39, color: '#4a90e2' },
    { value: 40, color: '#e0e0e0', label: 'A' },
    { value: 41, color: '#4a90e2' },
    { value: 42, color: '#6fb369' },
    { value: 43, color: '#4a90e2' },
    { value: 44, color: '#000000' },
    { value: 45, color: '#000000' },
    { value: 46, color: '#4a90e2' },
    { value: 47, color: '#6fb369' },
    { value: 48, color: '#4a90e2' },
    { value: 49, color: '#e0e0e0', label: 'B' },
    { value: 50, color: '#4a90e2' },
    { value: 51, color: '#000000' },
    { value: 52, color: '#4a90e2' }
];

const centerX = 200;
const centerY = 200;
const outerRadius = 180;
const innerRadius = 110;
const totalSegments = segments.length;
const anglePerSegment = (2 * Math.PI) / totalSegments;

const selectedSegments = new Set();
const fnElements = [];
const tnElements = [];
const tniElements = [];

function createSegmentPath(index) {
    const startAngle = index * anglePerSegment;
    const endAngle = (index + 1) * anglePerSegment;
    const x1 = centerX + outerRadius * Math.cos(startAngle);
    const y1 = centerY + outerRadius * Math.sin(startAngle);
    const x2 = centerX + outerRadius * Math.cos(endAngle);
    const y2 = centerY + outerRadius * Math.sin(endAngle);
    const x3 = centerX + innerRadius * Math.cos(endAngle);
    const y3 = centerY + innerRadius * Math.sin(endAngle);
    const x4 = centerX + innerRadius * Math.cos(startAngle);
    const y4 = centerY + innerRadius * Math.sin(startAngle);
    return `M ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 0 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 0 0 ${x4} ${y4} Z`;
}

function createSegmentText(index, value) {
    const angle = (index + 0.5) * anglePerSegment;
    const textRadius = outerRadius - 20;
    const x = centerX + textRadius * Math.cos(angle);
    const y = centerY + textRadius * Math.sin(angle);
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', x);
    text.setAttribute('y', y);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('dominant-baseline', 'middle');
    text.setAttribute('fill', 'white');
    text.setAttribute('font-size', '11');
    text.setAttribute('font-weight', 'bold');
    text.setAttribute('transform', `rotate(${(angle * 180 / Math.PI) + 90}, ${x}, ${y})`);
    text.textContent = value;
    text.style.pointerEvents = 'none';
    text.classList.add('segment-text');
    return text;
}

function createSegmentLabel(index, label) {
    const angle = (index + 0.5) * anglePerSegment;
    const labelRadius = innerRadius + 20;
    const x = centerX + labelRadius * Math.cos(angle);
    const y = centerY + labelRadius * Math.sin(angle);
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', x);
    text.setAttribute('y', y);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('dominant-baseline', 'middle');
    text.setAttribute('fill', 'white');
    text.setAttribute('font-size', '12');
    text.setAttribute('font-weight', 'normal');
    text.setAttribute('transform', `rotate(${(angle * 180 / Math.PI) + 90}, ${x}, ${y})`);
    text.textContent = label;
    text.style.pointerEvents = 'none';
    text.style.opacity = '0.9';
    return text;
}

function initCircle(svgId, elementsArray, selectable) {
    const svg = document.getElementById(svgId);
    segments.forEach((segment, index) => {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', createSegmentPath(index));
        path.setAttribute('fill', segment.color);
        path.setAttribute('stroke', 'white');
        path.setAttribute('stroke-width', '1.5');
        path.classList.add('segment');
        if (selectable) {
            path.classList.add('selectable');
            path.addEventListener('click', () => toggleSegment(segment, path, elementsArray));
        }
        svg.appendChild(path);
        const text = createSegmentText(index, segment.value);
        svg.appendChild(text);
        if (segment.label) {
            const label = createSegmentLabel(index, segment.label);
            svg.appendChild(label);
        }
        elementsArray.push({ path, segment, index, text });
    });
}

function toggleSegment(segment, path, elementsArray) {
    const element = elementsArray.find(el => el.segment.value === segment.value);
    if (selectedSegments.has(segment.value)) {
        selectedSegments.delete(segment.value);
        element.text.classList.remove('selected');
    } else {
        selectedSegments.add(segment.value);
        element.text.classList.add('selected');
    }
    updateFnDisplay();
}

function updateFnDisplay() {
    const display = document.getElementById('fnValues');
    if (selectedSegments.size === 0) {
        display.textContent = '-';
    } else {
        const values = Array.from(selectedSegments).sort((a, b) => a - b);
        display.textContent = values.join(', ');
    }
}

function clearSelection() {
    selectedSegments.clear();
    fnElements.forEach(({ text }) => text.classList.remove('selected'));
    updateFnDisplay();
    tnElements.forEach(({ text }) => text.classList.remove('highlighted-yellow'));
    document.getElementById('tnValues').textContent = '-';
    tniElements.forEach(({ text }) => text.classList.remove('highlighted-red'));
    document.getElementById('tniValues').textContent = '-';
}

function displayTransposition(resultArray) {
    tnElements.forEach(({ text }) => text.classList.remove('highlighted-yellow'));
    resultArray.forEach(value => {
        const element = tnElements.find(el => el.segment.value === value);
        if (element) element.text.classList.add('highlighted-yellow');
    });
    document.getElementById('tnValues').textContent = resultArray.length > 0 ? resultArray.join(', ') : '-';
}

function displayInversion(resultArray) {
    tniElements.forEach(({ text }) => text.classList.remove('highlighted-red'));
    resultArray.forEach(value => {
        const element = tniElements.find(el => el.segment.value === value);
        if (element) element.text.classList.add('highlighted-red');
    });
    document.getElementById('tniValues').textContent = resultArray.length > 0 ? resultArray.join(', ') : '-';
}

// --- 🔹 handleSubmit and init ---
function handleSubmit() {
    const values = Array.from(selectedSegments).sort((a, b) => a - b);
    originalSet = values;
    normalForm = calculateNormalForm(originalSet, temperament);
    currentTransposition = parseInt(document.getElementById('transpositionInput').value) || 0;
    currentInversion = parseInt(document.getElementById('inversionInput').value) || 0;
    const transposeValue = mod(currentTransposition, temperament);
    const invertValue = mod(currentInversion, temperament);
    const transposed = transpose(normalForm, transposeValue, temperament);
    const inverted = invert(normalForm, invertValue, temperament);
    displayTransposition(transposed);
    displayInversion(inverted);
}

document.addEventListener('DOMContentLoaded', function() {
    initCircle('fnSvg', fnElements, true);
    initCircle('tnSvg', tnElements, false);
    initCircle('tniSvg', tniElements, false);
    updateFnDisplay();
});
