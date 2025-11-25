# Componente de Historial de Análisis

## Ubicación
`NewFrontend/src/components/dashboard/HistorySection.jsx`

## Descripción
Componente visual que muestra el historial de análisis médicos con gráficos tipo donut para visualizar las probabilidades de diagnóstico.

## Características

### ✅ Diseño Responsive
- **Desktop**: Tarjetas horizontales con información a la izquierda y gráficos a la derecha
- **Mobile**: Layout en columna con gráficos debajo de la información
- **Tablet**: Transición suave entre ambos layouts

### ✅ Componentes Incluidos

#### 1. DonutChart
Gráfico circular que muestra el porcentaje de probabilidad:
- Abreviación del diagnóstico (NV, BKL, MEL, BCC)
- Porcentaje en el centro
- Nombre del diagnóstico debajo
- Color verde para benignos, naranja para malignos

#### 2. HistoryCard
Tarjeta individual de historial que contiene:
- Fecha y hora del análisis
- Indicador de estado (punto verde/amarillo)
- Diagnóstico principal
- Porcentaje de confianza
- 3 gráficos donut con top 3 diagnósticos

#### 3. HistorySection
Contenedor principal que incluye:
- Header con icono y título
- Badge "Datos mock"
- Lista de tarjetas de historial

## Uso

### En la página Analizar

```jsx
import HistorySection from '../components/dashboard/HistorySection'

// Datos de ejemplo
const mockHistory = [
  {
    id: 1,
    date: '2024-01-15',
    time: '14:30',
    result: 'Nevus (lunar benigno)',
    probability: 89.5,
    status: 'completed',
    top3: [
      { class: 'NV', prob: 0.895 },
      { class: 'BKL', prob: 0.078 },
      { class: 'MEL', prob: 0.027 }
    ]
  },
  // ... más items
]

// Renderizar
<HistorySection historyData={mockHistory} />
```

## Ubicaciones en la Página Analizar

### 1. Step 2 - Revisión y Análisis
Aparece debajo de la sección "Imagen de la Lesión"
```jsx
{currentStep === 1 && (
  <div className="space-y-4 max-w-4xl mx-auto">
    <PatientDataReview formData={formData} />
    
    {/* Imagen de la Lesión */}
    <div>...</div>
    
    {/* Historial - AQUÍ */}
    <HistorySection historyData={mockHistory} />
  </div>
)}
```

### 2. Step 3 - Resultados
Aparece como contenido principal de resultados
```jsx
{currentStep === 2 && (
  <div className="max-w-5xl mx-auto space-y-4">
    {/* Historial - AQUÍ */}
    <HistorySection historyData={mockHistory} />
    
    {/* Botones de acción */}
    <div>...</div>
  </div>
)}
```

## Estructura de Datos

```typescript
interface HistoryItem {
  id: number
  date: string          // Formato: 'YYYY-MM-DD'
  time: string          // Formato: 'HH:MM'
  result: string        // Diagnóstico principal
  probability: number   // Porcentaje (0-100)
  status: 'completed' | 'pending'
  top3: Array<{
    class: 'NV' | 'BKL' | 'MEL' | 'BCC'
    prob: number        // Probabilidad (0-1)
  }>
}
```

## Mapeo de Enfermedades

```javascript
const diseaseInfo = {
  'MEL': {
    name: 'Melanoma',
    status: 'Maligno',
  },
  'NV': {
    name: 'Nevus mel...',
    status: 'Benigno',
  },
  'BCC': {
    name: 'Carcinoma ...',
    status: 'Maligno',
  },
  'BKL': {
    name: 'Lesión tipo ...',
    status: 'Benigno',
  },
}
```

## Estilos y Temas

### Tema Oscuro
- Fondo: `bg-slate-800/50`
- Bordes: `border-gray-700/50`
- Texto: `text-white`, `text-gray-400`
- Acentos: `text-cyan-400`

### Tema Claro
- Fondo: `bg-white`
- Bordes: `border-gray-200`
- Texto: `text-gray-900`, `text-gray-600`
- Acentos: `text-cyan-600`

## Breakpoints Responsive

- **Mobile**: < 640px (sm)
- **Tablet**: 640px - 1024px (md, lg)
- **Desktop**: > 1024px (lg)

## Características Visuales

### Desktop
- Layout horizontal con divisor vertical
- Gráficos alineados horizontalmente
- Espaciado generoso (gap-6, gap-8)

### Mobile
- Layout vertical
- Gráficos en fila horizontal compacta
- Divisor horizontal entre secciones
- Porcentaje principal visible en ambas ubicaciones

## Personalización

Para conectar datos reales:

1. Reemplazar `mockHistory` con datos de API
2. Actualizar la estructura de datos según el backend
3. Ajustar el mapeo de `diseaseInfo` si es necesario
4. Modificar colores en `DonutChart` según requerimientos

## Tecnologías Utilizadas

- ✅ React (Hooks)
- ✅ Tailwind CSS
- ✅ SVG para gráficos donut
- ✅ Context API (ThemeContext)
- ✅ Responsive Design (Mobile-first)

## Sin Dependencias Externas

El componente NO requiere:
- ❌ Recharts
- ❌ Chart.js
- ❌ D3.js
- ❌ Librerías de gráficos

Todo está implementado con SVG nativo y Tailwind CSS.
