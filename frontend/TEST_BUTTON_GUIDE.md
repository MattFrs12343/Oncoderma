# Guía del Botón Test 🧪

## Ubicación
Página: `/analizar` - Step 2 (Revisión y Análisis)

## Funcionalidad

### Botón Test
- **Ubicación**: Al lado derecho del botón "Analizar Imagen"
- **Color**: Morado (`bg-purple-600`)
- **Icono**: 🧪 (emoji de tubo de ensayo)
- **Tooltip**: "Ver resultados con datos de prueba"

### Comportamiento

1. **Al hacer clic**:
   - Muestra animación de "Analizando..." por 1.5 segundos
   - Simula un análisis real
   - Navega automáticamente al Step 3 (Resultados)
   - Hace scroll suave hacia arriba

2. **Estados**:
   - **Normal**: Botón morado con hover más oscuro
   - **Analizando**: Botón deshabilitado con spinner
   - **Deshabilitado**: Opacidad reducida cuando ya está analizando

## Flujo de Uso

```
Step 1: Datos del Paciente
  ↓ (Llenar formulario y click "Siguiente")
  
Step 2: Revisión y Análisis
  ↓ (Click en botón "🧪 Test")
  ↓ (Animación 1.5s)
  
Step 3: Resultados ✅
  - Muestra Historial de Análisis con datos mock
  - 3 tarjetas de ejemplo con gráficos donut
  - Botones: "🔄 Realizar Nuevo Análisis" y "🖨️ Imprimir"
```

## Código del Botón

```jsx
<button
  onClick={() => {
    setAnalyzing(true)
    setTimeout(() => {
      setAnalyzing(false)
      setCurrentStep(2)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 1500)
  }}
  disabled={analyzing}
  className={`
    px-6 py-2.5 rounded-lg font-semibold transition-all flex items-center gap-2
    ${theme === 'dark'
      ? 'bg-purple-600 hover:bg-purple-700 text-white'
      : 'bg-purple-600 hover:bg-purple-700 text-white'}
    disabled:opacity-50 disabled:cursor-not-allowed
  `}
  title="Ver resultados con datos de prueba"
>
  🧪 Test
</button>
```

## Ventajas

✅ **No requiere imagen**: Puedes probar sin subir una imagen
✅ **Rápido**: Solo 1.5 segundos de simulación
✅ **Visual**: Muestra exactamente cómo se verán los resultados reales
✅ **Datos mock**: Usa los 3 ejemplos de historial predefinidos
✅ **Responsive**: Funciona en móvil y desktop

## Datos Mock Mostrados

### Análisis 1
- **Fecha**: 2024-01-15 • 14:30
- **Diagnóstico**: Nevus (lunar benigno)
- **Probabilidad**: 89.5%
- **Top 3**: NV (89.5%), BKL (7.8%), MEL (2.7%)

### Análisis 2
- **Fecha**: 2024-01-10 • 10:15
- **Diagnóstico**: Queratosis benigna
- **Probabilidad**: 76.3%
- **Top 3**: BKL (76.3%), NV (18.2%), BCC (5.5%)

### Análisis 3
- **Fecha**: 2024-01-05 • 16:45
- **Diagnóstico**: Nevus (lunar benigno)
- **Probabilidad**: 92.1%
- **Top 3**: NV (92.1%), BKL (6.5%), MEL (1.4%)

## Diferencias con Botón Real

| Característica | Botón Test 🧪 | Botón Analizar |
|---------------|---------------|----------------|
| Requiere imagen | ❌ No | ✅ Sí |
| Tiempo de espera | 1.5s | Variable (API) |
| Datos | Mock fijos | Reales del backend |
| Propósito | Demostración | Análisis real |
| Color | Morado | Cyan/Azul |

## Cuándo Usar

### Usar Botón Test 🧪
- ✅ Probar la interfaz sin backend
- ✅ Demostrar el flujo completo
- ✅ Verificar diseño responsive
- ✅ Mostrar a stakeholders
- ✅ Testing de UI/UX

### Usar Botón Analizar
- ✅ Análisis real con backend
- ✅ Producción
- ✅ Datos reales de pacientes
- ✅ Diagnósticos médicos reales

## Integración Futura

Cuando el backend esté listo:

1. **Mantener botón Test**: Útil para demos y testing
2. **Agregar variable de entorno**: `VITE_ENABLE_TEST_MODE`
3. **Ocultar en producción**: Solo visible en desarrollo

```jsx
{import.meta.env.DEV && (
  <button>🧪 Test</button>
)}
```

## Personalización

Para cambiar el tiempo de simulación:

```jsx
setTimeout(() => {
  // ...
}, 1500) // Cambiar este valor (en milisegundos)
```

Para cambiar los datos mostrados:

Editar el array `mockHistory` en `NewFrontend/src/pages/Analizar.jsx`

## Acceso Rápido

1. Ir a: http://localhost:3000/analizar
2. Llenar formulario básico (nombre, edad, sexo, zona, CI)
3. Click "Siguiente"
4. Click "🧪 Test"
5. ¡Ver resultados!

## Notas

- El botón está siempre visible en Step 2
- No interfiere con el flujo normal de análisis
- Se deshabilita durante la animación
- Funciona con o sin imagen cargada
- Compatible con tema claro y oscuro
