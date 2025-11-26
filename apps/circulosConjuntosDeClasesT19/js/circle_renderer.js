// circle_renderer.js
// Renderizado SVG y UI para temperamento 19 (con notas CDEFGAB en teclas blancas)

const segments = [
    // 19 segmentos (0..18) — colores y etiquetas según notas naturales
    { value: 0,  color: '#e0e0e0', label: 'C' },
    { value: 1,  color: '#4a90e2' },
    { value: 2,  color: '#000000' },
    { value: 3,  color: '#e0e0e0', label: 'D' },
    { value: 4,  color: '#000000' },
    { value: 5,  color: '#4a90e2' },
    { value: 6,  color: '#e0e0e0', label: 'E' },
    { value: 7,  color: '#000000' },
    { value: 8,  color: '#e0e0e0', label: 'F' },
    { value: 9,  color: '#000000' },
    { value: 10, color: '#4a90e2' },
    { value: 11, color: '#e0e0e0', label: 'G' },
    { value: 12, color: '#000000' },
    { value: 13, color: '#4a90e2' },
    { value: 14, color: '#e0e0e0', label: 'A' },
    { value: 15, color: '#000000' },
    { value: 16, color: '#4a90e2' },
    { value: 17, color: '#e0e0e0', label: 'B' },
    { value: 18, color: '#4a90e2' }
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

function createSegmentTexts(index, value, label) {
    const angle = (index + 0.5) * anglePerSegment;
    const baseRadius = (outerRadius + innerRadius) / 2;
    const x = centerX + baseRadius * Math.cos(angle);
    const y = centerY + baseRadius * Math.sin(angle);

    // número (arriba)
    const numberText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    numberText.setAttribute('x', x);
    numberText.setAttribute('y', y - 8);
    numberText.setAttribute('text-anchor', 'middle');
    numberText.setAttribute('dominant-baseline', 'middle');
    numberText.setAttribute('fill', 'white');
    numberText.setAttribute('font-size', '20');
    numberText.setAttribute('font-weight', 'bold');
    numberText.setAttribute('transform', `rotate(${(angle * 180/Math.PI) + 90}, ${x}, ${y})`);
    numberText.textContent = value;
    numberText.classList.add('segment-text');
    numberText.style.pointerEvents = 'none';

    const elements = [numberText];

    // etiqueta (debajo)
    if (label) {
        const labelText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        labelText.setAttribute('x', x);
        labelText.setAttribute('y', y + 14);
        labelText.setAttribute('text-anchor', 'middle');
        labelText.setAttribute('dominant-baseline', 'middle');
        labelText.setAttribute('fill', 'white');
        labelText.setAttribute('font-size', '16');
        labelText.setAttribute('font-weight', 'normal');
        labelText.setAttribute('transform', `rotate(${(angle * 180/Math.PI) + 90}, ${x}, ${y})`);
        labelText.textContent = label;
        labelText.classList.add('segment-label');
        labelText.style.pointerEvents = 'none';
        elements.push(labelText);
    }

    return elements;
}

function initCircle(svgId, elementsArray, selectable) {
    const svg = document.getElementById(svgId);
    while (svg.firstChild) svg.removeChild(svg.firstChild);

    segments.forEach((segment, index) => {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', createSegmentPath(index));
        path.setAttribute('fill', segment.color);
        path.setAttribute('stroke', 'white');
        path.setAttribute('stroke-width', '2');
        path.classList.add('segment');

        if (selectable) {
            path.classList.add('selectable');
            path.addEventListener('click', () => toggleSegment(segment, elementsArray));
        }

        svg.appendChild(path);
        const texts = createSegmentTexts(index, segment.value, segment.label);
        texts.forEach(t => svg.appendChild(t));

        elementsArray.push({ path, segment, texts });
    });
}

function toggleSegment(segment, elementsArray) {
    const element = elementsArray.find(el => el.segment.value === segment.value);
    if (!element) return;
    if (selectedSegments.has(segment.value)) {
        selectedSegments.delete(segment.value);
        element.texts.forEach(t => t.classList.remove('selected'));
    } else {
        selectedSegments.add(segment.value);
        element.texts.forEach(t => t.classList.add('selected'));
    }
    updateFnDisplay();
}

function updateFnDisplay() {
    const display = document.getElementById('fnValues');
    const values = Array.from(selectedSegments).sort((a,b)=>a-b);
    display.textContent = values.length ? values.join(', ') : '-';
}

function clearSelection() {
    selectedSegments.clear();
    [fnElements, tnElements, tniElements].forEach(group =>
        group.forEach(e => e.texts.forEach(t => {
            t.classList.remove('selected','highlighted-yellow','highlighted-red');
        }))
    );
    document.getElementById('fnValues').textContent = '-';
    document.getElementById('tnValues').textContent = '-';
    document.getElementById('tniValues').textContent = '-';
}

function displayTransposition(resultArray) {
    tnElements.forEach(e => e.texts.forEach(t => t.classList.remove('highlighted-yellow')));
    resultArray.forEach(v => {
        const el = tnElements.find(e => e.segment.value === v);
        if (el) el.texts.forEach(t => t.classList.add('highlighted-yellow'));
    });
    document.getElementById('tnValues').textContent = resultArray.length ? resultArray.join(', ') : '-';
}

function displayInversion(resultArray) {
    tniElements.forEach(e => e.texts.forEach(t => t.classList.remove('highlighted-red')));
    resultArray.forEach(v => {
        const el = tniElements.find(e => e.segment.value === v);
        if (el) el.texts.forEach(t => t.classList.add('highlighted-red'));
    });
    document.getElementById('tniValues').textContent = resultArray.length ? resultArray.join(', ') : '-';
}

function handleSubmit() {
    const values = Array.from(selectedSegments).sort((a,b)=>a-b);
    originalSet = values.slice();
    normalForm = calculateNormalForm(originalSet, temperament);
    const T = mod(parseInt(document.getElementById('transpositionInput').value || 0, 10), temperament);
    const I = mod(parseInt(document.getElementById('inversionInput').value || 0, 10), temperament);
    const transposed = transpose(normalForm, T, temperament);
    const inverted = invert(normalForm, I, temperament);
    displayTransposition(transposed);
    displayInversion(inverted);
}

document.addEventListener('DOMContentLoaded', () => {
    initCircle('fnSvg', fnElements, true);
    initCircle('tnSvg', tnElements, false);
    initCircle('tniSvg', tniElements, false);
    updateFnDisplay();
    document.getElementById('bangBtn').addEventListener('click', handleSubmit);
    document.getElementById('clearBtn').addEventListener('click', clearSelection);
});
