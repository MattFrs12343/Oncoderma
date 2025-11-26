# 🏥 Cómo Usar el Sistema OncoDerma

## 🌐 Acceso al Sistema

### URL Principal
```
http://localhost/
```

Todos los servicios están disponibles a través de Traefik en el puerto 80.

## 📋 Realizar un Análisis

### Paso 1: Datos del Paciente
1. Navega a la sección **"Analizar"** en el menú
2. Completa el formulario con los datos del paciente:
   - **Nombre completo** (requerido)
   - **Edad** (requerido)
   - **Sexo** (requerido): Masculino o Femenino
   - **Zona anatómica** (requerido): Selecciona dónde está ubicada la lesión
   - **CI** (requerido): Cédula de identidad
   - **Complemento** (opcional)
   - **Teléfono** (opcional)
3. Click en **"Siguiente"**

### Paso 2: Subir Imagen
1. Arrastra una imagen de la lesión o haz click para seleccionar
2. Formatos aceptados: JPEG, PNG (máx. 10MB)
3. Verifica que los datos del paciente sean correctos
4. Click en **"Analizar Imagen"**
5. Espera mientras el sistema procesa (aprox. 2 segundos)

### Paso 3: Ver Resultados
1. El sistema mostrará:
   - **Diagnóstico principal** con nivel de confianza
   - **Top 3 predicciones** con probabilidades
   - **Gráficos visuales** de las predicciones
2. El análisis se agregará automáticamente al **Historial**
3. El nuevo análisis estará **resaltado** con:
   - Fondo con gradiente cyan/blue
   - Badge "NUEVO" parpadeante
   - Fecha y hora exacta del análisis

## 📊 Historial de Análisis

### Características
- ✅ Muestra todos los análisis realizados
- ✅ Ordenados del más reciente al más antiguo
- ✅ El análisis más reciente está resaltado visualmente
- ✅ Cada análisis muestra:
  - Fecha y hora
  - Nombre del paciente
  - Diagnóstico principal
  - Porcentaje de confianza
  - Top 3 predicciones con gráficos de dona

### Interpretación de Colores
- 🟢 **Verde**: Lesiones benignas (NV, BKL)
- 🟠 **Naranja**: Lesiones malignas (MEL, BCC)

## 🔬 Tipos de Lesiones

### Benignas
1. **NV - Nevus (Lunar Benigno)**
   - Lunar común, generalmente inofensivo
   - Más común en personas jóvenes

2. **BKL - Queratosis Seborreica**
   - Crecimiento benigno de la piel
   - Común en adultos mayores

### Malignas
1. **MEL - Melanoma**
   - Tipo de cáncer de piel más grave
   - Se desarrolla en los melanocitos
   - Requiere atención médica inmediata

2. **BCC - Carcinoma Basocelular**
   - Tipo más común de cáncer de piel
   - Crecimiento lento
   - Buen pronóstico con tratamiento temprano

## ⚠️ Importante

### Limitaciones Actuales
- El sistema está en **modo simulación**
- Las predicciones se basan en:
  - Edad del paciente
  - Sexo
  - Ubicación anatómica de la lesión
- La imagen aún **no se procesa** con el modelo de deep learning
- Los resultados son **orientativos** y no reemplazan el diagnóstico médico

### Recomendaciones
1. ✅ Usa el sistema como herramienta de apoyo
2. ✅ Siempre consulta con un dermatólogo profesional
3. ✅ No tomes decisiones médicas basándote únicamente en estos resultados
4. ✅ Si el sistema detecta una lesión maligna, busca atención médica inmediata

## 🎨 Temas Visuales

El sistema soporta dos temas:
- 🌙 **Tema Oscuro**: Ideal para ambientes con poca luz
- ☀️ **Tema Claro**: Ideal para ambientes bien iluminados

Cambia entre temas usando el botón en la esquina superior derecha.

## 🔄 Realizar Nuevo Análisis

Después de ver los resultados:
1. Click en **"Realizar Nuevo Análisis"**
2. El sistema volverá al Paso 1
3. Los datos del formulario se limpiarán
4. El historial se mantendrá visible

## 📱 Responsividad

El sistema está optimizado para:
- 💻 Computadoras de escritorio
- 💻 Laptops
- 📱 Tablets
- 📱 Teléfonos móviles

## 🆘 Solución de Problemas

### El sistema no carga
```bash
# Verificar que los servicios estén corriendo
docker-compose ps

# Reiniciar servicios si es necesario
docker-compose restart
```

### Error al analizar
1. Verifica que todos los campos requeridos estén completos
2. Asegúrate de haber subido una imagen
3. Verifica tu conexión a internet
4. Revisa los logs del backend:
   ```bash
   docker-compose logs backend --tail 50
   ```

### La imagen no se sube
1. Verifica el formato (JPEG o PNG)
2. Verifica el tamaño (máx. 10MB)
3. Intenta con otra imagen

## 📞 Soporte

Para reportar problemas o sugerencias:
1. Revisa los logs: `docker-compose logs`
2. Verifica el estado: `docker-compose ps`
3. Consulta la documentación técnica en `INTEGRACION_COMPLETA.md`

## 🚀 Acceso Rápido a Servicios

- **Frontend**: http://localhost/
- **Backend API**: http://localhost/api/
- **Traefik Dashboard**: http://localhost:8080/
- **pgAdmin**: http://localhost:5050/
- **PostgreSQL**: localhost:5432

---

**Versión**: 1.0.0  
**Última actualización**: 25 de Noviembre, 2025
