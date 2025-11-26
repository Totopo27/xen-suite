// ============================================
// FUNCIONES DE INTERFAZ DE USUARIO
// ============================================

let currentMOS = null;

function calculateMOS() {
    const period = parseInt(document.getElementById('period').value);
    const generator = parseInt(document.getElementById('generator').value);
    
    // Validaciones básicas
    if (period <= 0 || generator <= 0) {
        alert("Por favor, introduce valores positivos para Período y Generador");
        return;
    }
    
    if (generator >= period) {
        alert("El generador debe ser menor que el período");
        return;
    }
    
    currentMOS = makeMos(period, generator);
    renderMOSTable(currentMOS);
    
    document.getElementById('secondary-mos-results').innerHTML = '';
}

function renderMOSTable(mosData) {
    const resultsDiv = document.getElementById('mos-results');
    const unit = Math.round(500 / mosData.scales[0].reduce((a, b) => a + b, 0));
    
    let html = '<h2 class="section-title">Escalas MOS Primarias</h2>';
    
    if (!mosData.trueMos) {
        html += '<div class="warning">';
        html += '<strong>Nota:</strong> El período y el generador no son coprimos. ';
        html += 'Este no es un MOS verdadero según la definición estricta.';
        html += '</div>';
    }
    
    mosData.scales.forEach((intervals, index) => {
        html += '<table>';
        html += '<thead><tr><td></td><td></td></tr></thead>';
        html += '<tbody><tr>';
        html += '<td class="wt__mos-table-interval">';
        
        intervals.forEach((interval, i) => {
            const width = unit * interval;
            html += `<span style="width: ${width}px;">`;
            html += `<span>${interval}</span>`;
            html += '</span>';
        });
        
        html += '</td>';
        html += `<td><span style="display: inline-block; text-align: center; width: 20px;">${intervals.length}</span>`;
        html += `<button class="wt__mos-table-generate-secondary-mos-button" onclick="calculateSecondaryMOS(${index})">Generar MOS Secundario</button>`;
        html += '</td>';
        html += '</tr></tbody></table>';
    });
    
    resultsDiv.innerHTML = html;
}

function calculateSecondaryMOS(index) {
    if (!currentMOS) {
        alert("Primero debes calcular un MOS primario");
        return;
    }
    
    const selectedMOS = currentMOS.scales[index];
    const generator = currentMOS.generator;
    
    const allSubmos = makeAllSubmos(generator, selectedMOS);  
      
    renderSecondaryMOS(selectedMOS, allSubmos, generator);  
}  

function renderSecondaryMOS(pattern, submosData, generator) {  
    const resultsDiv = document.getElementById('secondary-mos-results');  
    const period = pattern.reduce((a, b) => a + b, 0);  
      
    let html = '<div class="wt__mos-secondary-data">';  
    html += '<div class="wt__mos-secondary-data-main">';  
    html += `<h4>Viendo datos para: ${pattern.length}) ${period}</h4>`;  
    html += `<small class="wt__mos-secondary-data-mos-description">Fila: ${pattern.length}, MOS: [${pattern.join(', ')}]</small>`;  
      
    // Filtrar MOS secundarios verdaderos  
    const trueSubmos = getTrueSubmos(submosData);  
      
    html += '<h3>MOS Secundario</h3>';  
      
    if (trueSubmos.length === 0) {  
        html += '<div class="warning">No se encontraron MOS secundarios verdaderos para este patrón.</div>';  
    } else {  
        // Renderizar en orden inverso  
        trueSubmos.reverse().forEach((submosGroup, groupIndex) => {  
            html += '<div class="wt__mos-secondary-data-detail">';  
            html += '<div>';  
            html += `<div><b class="wt__mos-secondary-data-detail-description">${pattern.length}) ${submosGroup.generator}/${submosGroup.period}</b></div>`;  
            html += `<small class="wt__mos-secondary-data-detail-explanation">Generador: ${submosGroup.generator}, Divisor: ${submosGroup.divisor}</small>`;  
            html += `<small class="wt__mos-secondary-data-detail-explanation">MOS: [${pattern.join(', ')}]</small>`;  
            html += '</div>';  
              
            // Ordenar los modos usando la estrategia del generador  
            const orderedSubmos = orderSubmosUsingGeneratorStrategy(  
                submosGroup.generator,   
                submosGroup.submos  
            );  
              
            orderedSubmos.forEach(item => {  
                html += `<div class="wt__mos-secondary-data-main-data">`;  
                html += `<code>modo ${item.degree}: [${item.mos.join(', ')}], grados: [${item.mosDegrees.join(', ')}]</code>`;  
                html += '</div>';  
            });  
              
            html += '</div>';  
        });  
    }  
      
    html += '</div>';  
    html += '</div>';  
    resultsDiv.innerHTML = html;  
}

// Inicializar con un ejemplo al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    calculateMOS();
    
    // Theme Toggle Logic
    const themeToggleBtn = document.getElementById('themeToggle');
    const body = document.body;
    
    // Check local storage or default to dark
    const savedTheme = localStorage.getItem('theme') || 'dark';
    if (savedTheme === 'light') {
        body.classList.add('light-mode');
        themeToggleBtn.textContent = 'CLARO';
    } else {
        body.classList.remove('light-mode');
        themeToggleBtn.textContent = 'OSCURO';
    }
    
    themeToggleBtn.addEventListener('click', function() {
        if (body.classList.contains('light-mode')) {
            body.classList.remove('light-mode');
            themeToggleBtn.textContent = 'OSCURO';
            localStorage.setItem('theme', 'dark');
        } else {
            body.classList.add('light-mode');
            themeToggleBtn.textContent = 'CLARO';
            localStorage.setItem('theme', 'light');
        }
    });
});
