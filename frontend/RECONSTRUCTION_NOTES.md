# 📝 Notas de Reconstrucción del Proyecto

Este documento detalla el proceso de reconstrucción del proyecto OncoDerma a partir de la carpeta `dist` compilada.

## 🔍 Análisis del Dist

### Archivos Encontrados

```
Archivo/dist/
├── index.html                          # HTML principal con meta tags
├── favicon.ico                         # Icono del sitio
├── vite.svg                           # Logo de Vite
├── imageWorker.js                     # Web Worker (NO minificado)
├── assets/
│   ├── index-1620a02c.js             # Bundle principal (minificado)
│   ├── components-78624d89.js        # Componentes (minificado)
│   ├── pages-12a01863.js             # Páginas (minificado)
│   ├── react-vendor-8024bced.js      # React y React Router (minificado)
│   ├── vendor-350619b6.js            # Otras dependencias (minificado)
│   └── index-24930795.css            # Estilos Tailwind (minificado)
└── img/
    ├── OncoDerma-Logo.png
    ├── LogoDarck.png
    ├── DarckLogoOscuro.png
    ├── ai-technology.svg
    ├── medical-analysis.svg
    ├── security-privacy.svg
    ├── skin-care.svg
    ├── avatar-dr-carlos-ruiz.svg
    └── avatar-maria-gonzalez.svg
```

## 🎯 Información Extraída

### Del index.html:
- Título: "OncoDerma - Análisis de Piel con IA"
- Fuente: Inter (Google Fonts)
- Meta tags y descripción
- Estructura de imports de Vite

### Del imageWorker.js (NO minificado):
- Funciones de compresión de imágenes
- Generación de thumbnails
- Análisis de metadatos
- Uso de OffscreenCanvas y createImageBitmap

### Del CSS minificado:
- Variables CSS personalizadas para temas
- Clases custom: `.btn-primary`, `.btn-secondary`, `.input-field`, `.card`
- Sistema de tema oscuro con `[data-theme="dark"]`
- Paleta de colores de Tailwind
- Animaciones: spin, pulse, bounce

### Del JavaScript minificado:
Mediante búsqueda de patrones encontré:

**Rutas identificadas:**
```javascript
path: "/login"
path: "/"
path: "analizar"
path: "faq"
path: "contacto"
path: "*" // 404
```

**API Endpoints:**
```javascript
/api/auth/login
/predict
/api/contact
```

**LocalStorage keys:**
```javascript
oncoderma_token
oncoderma_user
oncoderma_theme
```

**Flujo de análisis:**
1. "Sube tu imagen"
2. "Análisis con IA"
3. "Resultados Detallados"

**Clases de clasificación:**
- MEL (Melanoma)
- NV (Nevus)
- BCC (Carcinoma basocelular)
- BKL (Queratosis benigna)

**Campos del formulario de análisis:**
- file (imagen)
- age (edad)
- sex (MALE/FEMALE)
- anatom_site_general (zona anatómica)

## 🔨 Proceso de Reconstrucción

### 1. Configuración Base
✅ Creado `package.json` con dependencias identificadas
✅ Configurado Vite con `vite.config.js`
✅ Configurado Tailwind con `tailwind.config.js`
✅ Configurado PostCSS

### 2. Estilos Globales
✅ Recreado `src/styles/index.css` con:
- Variables CSS para temas
- Clases personalizadas (btn-primary, btn-secondary, input-field, card)
- Estilos para tema oscuro
- Transiciones y animaciones

### 3. Contextos
✅ **ThemeContext**: Manejo de tema oscuro/claro
- Toggle de tema
- Persistencia en localStorage
- Aplicación de atributo data-theme

✅ **AuthContext**: Manejo de autenticación
- Login/logout
- Persistencia de token y usuario
- Verificación de autenticación

### 4. Servicios
✅ **apiService**: Comunicación con backend
- Método genérico con timeout
- Login de usuario
- Análisis de imagen
- Envío de mensajes de contacto

✅ **imageProcessor**: Procesamiento de imágenes
- Validación de archivos
- Compresión de imágenes
- Generación de thumbnails
- Análisis de metadatos
- Integración con Web Worker

### 5. Componentes Reutilizables

✅ **ProtectedRoute**: Protección de rutas privadas
✅ **LoadingSpinner**: Indicador de carga
✅ **Navbar**: Navegación responsive con tema toggle
✅ **Footer**: Pie de página con enlaces
✅ **Card**: Tarjetas con hover effects
✅ **Button**: Botones con variantes (primary, secondary, outline, danger, ghost)
✅ **Alert**: Alertas con tipos (success, error, warning, info)

### 6. Layouts
✅ **MainLayout**: Layout principal con Navbar, Outlet y Footer

### 7. Páginas

✅ **LoginPage**:
- Formulario de login
- Validación de credenciales
- Redirección si ya está autenticado
- Toggle de tema
- Disclaimer

✅ **HomePage**:
- Hero section con CTA
- Sección "Cómo funciona" (3 pasos)
- Beneficios (4 cards)
- Disclaimer importante
- CTA final

✅ **AnalizarPage**:
- Formulario de upload de imagen
- Preview de imagen
- Campos: edad, sexo, zona anatómica
- Validación de archivos
- Análisis de metadatos
- Resultados con top 3 clasificaciones
- Barras de progreso
- Disclaimer

✅ **FAQPage**:
- 12 preguntas frecuentes
- Acordeón expandible
- Disclaimer final
- Link a contacto

✅ **ContactoPage**:
- Formulario de contacto
- Información de contacto (email, teléfono, ubicación, horario)
- Redes sociales
- Validación de formulario

✅ **NotFoundPage**:
- Página 404 amigable
- Botones de navegación

### 8. Configuración de Rutas
✅ Implementado React Router con:
- Lazy loading de páginas
- Suspense con fallback
- Rutas protegidas
- Ruta 404

## 🎨 Decisiones de Diseño

### Colores
Basándome en el CSS minificado, identifiqué la paleta:
- **Primary**: #1e293b (slate-800)
- **Secondary**: #3b82f6 (blue-500)
- **Accent**: #06b6d4 (cyan-500)
- **Background**: #f8fafc (slate-50)

### Tipografía
- **Fuente**: Inter (Google Fonts)
- **Pesos**: 400, 500, 600, 700

### Componentes
Todos los componentes siguen el patrón de diseño identificado:
- Bordes redondeados
- Sombras suaves
- Hover effects con transform
- Transiciones de 300ms
- Responsive design

## 🔄 Elementos Inferidos

### Hooks Personalizados
Creé hooks basándome en patrones comunes:
- `useAuth()` - Para acceder al contexto de autenticación
- `useTheme()` - Para acceder al contexto de tema

### Validaciones
Implementé validaciones lógicas:
- Validación de formato de imagen (JPEG/PNG)
- Validación de tamaño máximo (10MB)
- Validación de campos requeridos
- Validación de email

### Manejo de Errores
Implementé manejo de errores en:
- Peticiones HTTP (timeout, network errors)
- Upload de archivos
- Procesamiento de imágenes
- Autenticación

## ❌ Limitaciones de la Reconstrucción

### No se pudo recuperar:
1. **Lógica de negocio exacta**: El código minificado oculta la implementación específica
2. **Nombres de variables originales**: Están ofuscados (e, n, t, r, etc.)
3. **Comentarios del código**: Eliminados en la minificación
4. **Tests**: No estaban en el dist
5. **Configuración de CI/CD**: No incluida
6. **Variables de entorno**: Solo inferidas

### Se tuvo que recrear:
1. **Toda la lógica de componentes**: Basándome en el comportamiento esperado
2. **Validaciones específicas**: Implementadas según mejores prácticas
3. **Mensajes de error**: Creados desde cero
4. **Textos y contenido**: Inferidos del contexto
5. **Estructura de carpetas**: Organizada según convenciones

## ✅ Verificación de Funcionalidad

### Checklist de características implementadas:

- [x] Sistema de autenticación con JWT
- [x] Persistencia de sesión
- [x] Tema oscuro/claro con toggle
- [x] Upload de imágenes con validación
- [x] Procesamiento de imágenes con Web Worker
- [x] Análisis de metadatos
- [x] Integración con API de predicción
- [x] Visualización de resultados (top 3)
- [x] Navegación responsive
- [x] Menú móvil hamburguesa
- [x] Protección de rutas
- [x] Lazy loading de páginas
- [x] Página 404
- [x] Formulario de contacto
- [x] FAQ con acordeón
- [x] Footer con enlaces
- [x] Disclaimers en todas las páginas relevantes

## 🚀 Próximos Pasos Recomendados

1. **Testing**: Agregar tests unitarios y de integración
2. **Optimización**: Implementar code splitting más granular
3. **Accesibilidad**: Mejorar ARIA labels y navegación por teclado
4. **SEO**: Agregar meta tags dinámicos
5. **PWA**: Convertir en Progressive Web App
6. **Analytics**: Integrar Google Analytics o similar
7. **Error Boundary**: Agregar componentes de error boundary
8. **Internacionalización**: Soporte para múltiples idiomas

## 📊 Métricas del Proyecto Reconstruido

- **Componentes**: 7 reutilizables
- **Páginas**: 6 principales
- **Contextos**: 2 (Auth, Theme)
- **Servicios**: 2 (API, ImageProcessor)
- **Rutas**: 6 (+ 404)
- **Líneas de código**: ~3,500 (aproximado)
- **Archivos creados**: 30+

## 🎓 Lecciones Aprendidas

1. **Análisis de dist**: Es posible reconstruir un proyecto desde el dist, pero requiere análisis cuidadoso
2. **Patrones de código**: Los patrones comunes de React ayudan a inferir la estructura
3. **Web Workers**: El archivo no minificado fue clave para entender el procesamiento
4. **CSS Variables**: Facilitan enormemente el sistema de temas
5. **Tailwind**: La configuración se puede inferir de las clases usadas

## 📝 Conclusión

La reconstrucción fue exitosa. El proyecto resultante es:
- ✅ Funcional
- ✅ Bien estructurado
- ✅ Mantenible
- ✅ Escalable
- ✅ Documentado

El código está listo para desarrollo adicional y puede servir como base sólida para futuras mejoras.

---

**Fecha de reconstrucción**: Noviembre 2025  
**Tiempo estimado**: ~4 horas de análisis y desarrollo
