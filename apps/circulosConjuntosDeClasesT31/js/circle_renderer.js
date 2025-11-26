// circle_renderer.js (versión corregida: letras debajo de los números)
// Renderizado de los círculos para temperamento 31

const temperamentValue = 31;

// Segmentos (igual que antes)
const segments = [
  { value: 0, color: '#e0e0e0', label: 'C' },
  { value: 1, color: '#4a90e2' },
  { value: 2, color: '#000000' },
  { value: 3, color: '#000000' },
  { value: 4, color: '#4a90e2' },
  { value: 5, color: '#e0e0e0', label: 'D' },
  { value: 6, color: '#4a90e2' },
  { value: 7, color: '#000000' },
  { value: 8, color: '#000000' },
  { value: 9, color: '#4a90e2' },
  { value: 10, color: '#e0e0e0', label: 'E' },
  { value: 11, color: '#4a90e2' },
  { value: 12, color: '#000000' },
  { value: 13, color: '#e0e0e0', label: 'F' },
  { value: 14, color: '#4a90e2' },
  { value: 15, color: '#000000' },
  { value: 16, color: '#000000' },
  { value: 17, color: '#4a90e2' },
  { value: 18, color: '#e0e0e0', label: 'G' },
  { value: 19, color: '#4a90e2' },
  { value: 20, color: '#000000' },
  { value: 21, color: '#000000' },
  { value: 22, color: '#4a90e2' },
  { value: 23, color: '#e0e0e0', label: 'A' },
  { value: 24, color: '#4a90e2' },
  { value: 25, color: '#000000' },
  { value: 26, color: '#000000' },
  { value: 27, color: '#4a90e2' },
  { value: 28, color: '#e0e0e0', label: 'B' },
  { value: 29, color: '#4a90e2' },
  { value: 30, color: '#4a90e2' }
];

const centerX = 200, centerY = 200, outerRadius = 180, innerRadius = 110;
const anglePerSegment = (2 * Math.PI) / segments.length;

const selectedSegments = new Set();
const fnElements = [], tnElements = [], tniElements = [];

/* Path del segmento */
function createSegmentPath(index) {
  const start = index * anglePerSegment;
  const end = (index + 1) * anglePerSegment;
  const x1 = centerX + outerRadius * Math.cos(start);
  const y1 = centerY + outerRadius * Math.sin(start);
  const x2 = centerX + outerRadius * Math.cos(end);
  const y2 = centerY + outerRadius * Math.sin(end);
  const x3 = centerX + innerRadius * Math.cos(end);
  const y3 = centerY + innerRadius * Math.sin(end);
  const x4 = centerX + innerRadius * Math.cos(start);
  const y4 = centerY + innerRadius * Math.sin(start);
  return `M ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 0 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 0 0 ${x4} ${y4} Z`;
}

/* Crea texto(s) dentro del slice:
   - número (arriba)
   - etiqueta (letter) opcional (debajo) */
function createSegmentTexts(index, value, label) {
  const angle = (index + 0.5) * anglePerSegment;
  // centramos en el grosor del anillo, luego ajustamos verticalmente:
  const baseRadius = (outerRadius + innerRadius) / 2;
  const x = centerX + baseRadius * Math.cos(angle);
  const y = centerY + baseRadius * Math.sin(angle);

  // Número: ligeramente hacia arriba dentro del slice
  const numberText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  numberText.setAttribute('x', x);
  numberText.setAttribute('y', y - 8); // subir un poco
  numberText.setAttribute('text-anchor', 'middle');
  numberText.setAttribute('dominant-baseline', 'middle');
  numberText.setAttribute('fill', 'white');
  numberText.setAttribute('font-size', '13');
  numberText.setAttribute('font-weight', 'bold');
  numberText.setAttribute('transform', `rotate(${angle * 180 / Math.PI + 90}, ${x}, ${y})`);
  numberText.textContent = value;
  numberText.classList.add('segment-text');
  numberText.style.pointerEvents = 'none';

  const result = [numberText];

  // Si hay etiqueta, la colocamos por debajo del número (mismo centro, pero y + offset)
  if (label) {
    const labelText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    labelText.setAttribute('x', x);
    labelText.setAttribute('y', y + 12); // debajo del número
    labelText.setAttribute('text-anchor', 'middle');
    labelText.setAttribute('dominant-baseline', 'middle');
    labelText.setAttribute('fill', 'white');
    labelText.setAttribute('font-size', '16');
    labelText.setAttribute('font-weight', '700');
    labelText.setAttribute('transform', `rotate(${angle * 180 / Math.PI + 90}, ${x}, ${y})`);
    labelText.textContent = label;
    labelText.classList.add('segment-label');
    labelText.style.pointerEvents = 'none';
    result.push(labelText);
  }

  return result; // [numberText, (labelText?)]
}

/* Inicializa un círculo SVG */
function initCircle(svgId, elements, selectable) {
  const svg = document.getElementById(svgId);
  // limpiar por si acaso
  while (svg && svg.firstChild) svg.removeChild(svg.firstChild);

  segments.forEach((seg, i) => {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', createSegmentPath(i));
    path.setAttribute('fill', seg.color);
    path.setAttribute('stroke', 'white');
    path.setAttribute('stroke-width', '2');
    if (selectable) {
      path.classList.add('selectable');
      path.addEventListener('click', () => toggleSegment(seg, elements));
    }
    svg.appendChild(path);

    // textos dentro del slice
    const texts = createSegmentTexts(i, seg.value, seg.label);
    texts.forEach(t => svg.appendChild(t));

    // guardamos las referencias al path y a ambos textos (texto[0] = número, texto[1] = label opcional)
    elements.push({ path, segment: seg, texts });
  });
}

/* toggle selección: aplica la clase a todos los textos asociados */
function toggleSegment(seg, elements) {
  const el = elements.find(e => e.segment.value === seg.value);
  if (!el) return;
  if (selectedSegments.has(seg.value)) {
    selectedSegments.delete(seg.value);
    el.texts.forEach(t => t.classList.remove('selected'));
  } else {
    selectedSegments.add(seg.value);
    el.texts.forEach(t => t.classList.add('selected'));
  }
  updateFnDisplay();
}

function updateFnDisplay() {
  const fn = document.getElementById('fnValues');
  const vals = Array.from(selectedSegments).sort((a, b) => a - b);
  fn.textContent = vals.length ? vals.join(', ') : '-';
}

/* limpia selección y resaltes */
function clearSelection() {
  selectedSegments.clear();
  fnElements.forEach(e => e.texts.forEach(t => t.classList.remove('selected')));
  tnElements.forEach(e => e.texts.forEach(t => t.classList.remove('highlighted-yellow')));
  tniElements.forEach(e => e.texts.forEach(t => t.classList.remove('highlighted-red')));
  document.getElementById('fnValues').textContent = '-';
  document.getElementById('tnValues').textContent = '-';
  document.getElementById('tniValues').textContent = '-';
}

/* muestra transposición (resalta números/labels) */
function displayTransposition(arr) {
  tnElements.forEach(e => e.texts.forEach(t => t.classList.remove('highlighted-yellow')));
  arr.forEach(v => {
    const el = tnElements.find(e => e.segment.value === v);
    if (el) el.texts.forEach(t => t.classList.add('highlighted-yellow'));
  });
  document.getElementById('tnValues').textContent = arr.length ? arr.join(', ') : '-';
}

/* muestra inversión (resalta números/labels) */
function displayInversion(arr) {
  tniElements.forEach(e => e.texts.forEach(t => t.classList.remove('highlighted-red')));
  arr.forEach(v => {
    const el = tniElements.find(e => e.segment.value === v);
    if (el) el.texts.forEach(t => t.classList.add('highlighted-red'));
  });
  document.getElementById('tniValues').textContent = arr.length ? arr.join(', ') : '-';
}

/* handler principal */
function handleSubmit() {
  const values = Array.from(selectedSegments).sort((a, b) => a - b);
  originalSet = values.slice();
  // funciones calculateNormalForm, transpose, invert, mod y variable 'temperament'
  // están en temperament-operations.js y deben estar cargadas antes
  normalForm = calculateNormalForm(originalSet, temperament);
  const T = parseInt(document.getElementById('transpositionInput').value) || 0;
  const I = parseInt(document.getElementById('inversionInput').value) || 0;
  const transposed = transpose(normalForm, mod(T, temperament), temperament);
  const inverted = invert(normalForm, mod(I, temperament), temperament);
  displayTransposition(transposed);
  displayInversion(inverted);
}

/* inicialización al cargar DOM */
document.addEventListener('DOMContentLoaded', () => {
  initCircle('fnSvg', fnElements, true);
  initCircle('tnSvg', tnElements, false);
  initCircle('tniSvg', tniElements, false);
  updateFnDisplay();

  const bang = document.getElementById('bangBtn');
  if (bang) bang.addEventListener('click', handleSubmit);

  const clearBtn = document.getElementById('clearBtn');
  if (clearBtn) clearBtn.addEventListener('click', clearSelection);
});
