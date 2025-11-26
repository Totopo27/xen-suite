# Sistema de Círculos - Temperamento 53

Sistema interactivo de círculos para visualización y manipulación de conjuntos de clases de alturas en el temperamento de 53 divisiones por octava.

##  Características

- **53 divisiones por octava** - Representación completa del temperamento 53-TET
- **Transposición (Tn)** - Aplica operaciones de transposición a conjuntos de alturas
- **Inversión (TnI)** - Calcula inversiones de conjuntos
- **Forma Normal** - Determina automáticamente la forma normal de los conjuntos
- **Interfaz visual interactiva** - Selección intuitiva mediante clicks
- **Identificación de notas** - Etiquetas para las notas blancas (C, D, E, F, G, A, B)

## Uso

- **Abrir en el navegador:**
- Simplemente abre el archivo `index.html` en tu navegador web
- No requiere instalación ni servidor

## Cómo Usar

1. **Seleccionar notas:**
   - Haz click en los segmentos del círculo **Fn** para seleccionar alturas
   - Los números seleccionados se mostrarán en violeta

2. **Configurar transformaciones:**
   - Ajusta el valor de **Transposición (T)** (0-52)
   - Ajusta el valor de **Inversión (I)** (0-52)

3. **Calcular resultados:**
   - Presiona el botón **Bang**
   - Los resultados aparecen en:
     - Círculo **Tn** (amarillo) - Transposición
     - Círculo **TnI** (rojo) - Inversión

4. **Limpiar:**
   - Usa el botón **Limpiar selección** para reiniciar

## Teoría Musical

### Operaciones Implementadas

- **Forma Normal:** Rotación que minimiza el espacio entre la primera y última nota del conjunto
- **Transposición Tn:** Suma modular de un intervalo a cada elemento: `Tn(x) = (x + n) mod 53`
- **Inversión TnI:** Reflexión del conjunto alrededor de un eje: `TnI(x) = (n - x) mod 53`

### Temperamento 53-TET

El temperamento de 53 divisiones por octava (53-TET) es una aproximación extremadamente precisa al sistema de afinación justa:

- **1 grado = 22.64 cents**
- **5 grados ≈ semitono cromático** (113.21 cents)
- **9 grados ≈ tono mayor** (203.77 cents)
- **31 grados ≈ quinta justa** (701.89 cents)

Este sistema fue propuesto por Jing Fang en China (siglo I a.C.) y redescubierto por Nicholas Mercator en el siglo XVII.


### v1.1 (Planeado)
- [ ] Soporte multi-temperamento
- [ ] Exportar/Importar
- [ ] Presets de acordes
- [ ] Exportar/Importar conjuntos en formato JSON
- [ ] Historial de operaciones con deshacer/rehacer
- [ ] Presets de acordes comunes
- [ ] Modo oscuro/claro
- [ ] Reproducción de audio
- [ ] Análisis de intervalos y vectores interválicos
