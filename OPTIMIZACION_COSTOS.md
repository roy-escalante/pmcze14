# 💰 Guía de Optimización de Costos - PMCZE14

Este documento describe las estrategias implementadas para mantener el sistema operativo con costos mínimos.

## 📊 Resumen de Costos Optimizados

### Plan Gratuito Supabase (Recomendado para inicio)
- **Costo:** $0/mes
- **Límites optimizados:**
  - 500MB almacenamiento (suficiente para ~200 evidencias)
  - 2GB transferencia/mes
  - 50,000 usuarios activos mensuales

### Evidencias con Límites Estrictos
- **Máximo 2 evidencias por criterio** (vs 5 original)
- **2MB máximo por archivo** (vs 10MB original)
- **Solo JPG, PNG, PDF** (eliminamos video/audio)
- **Compresión automática** aplicada

## 🔧 Funciones de Optimización

### 1. SubirEvidenciasEconomico.tsx
```typescript
const CONFIG = {
  maxArchivos: 2,           // Solo 2 evidencias por criterio
  maxTamañoMB: 2,          // 2MB máximo (muy estricto)
  tiposPermitidos: [
    'image/jpeg',
    'image/png', 
    'application/pdf'       // Solo imágenes y PDFs
  ]
}
```

### 2. Compresión Automática
- **Imágenes:** Redimensionadas a máx 1200x800px
- **Calidad JPEG:** 70% (reduce 50-70% del tamaño)
- **Conversión automática:** PNG → JPEG para mayor compresión

### 3. Validaciones Estrictas
- Verificación de tamaño antes y después de compresión
- Límite estricto de archivos por criterio
- Alertas visuales de límites de costo

## 📈 Estimaciones de Uso Real

### Escenario Conservador (20 escuelas/año)
```
• 20 escuelas × 4 diagnósticos/año = 80 diagnósticos
• 80 diagnósticos × 8 criterios × 2 evidencias = 1,280 evidencias
• 1,280 evidencias × 0.8MB promedio = 1.02GB/año
• Costo anual: $0 (dentro del plan gratuito)
```

### Escenario Escalado (100 escuelas/año)
```
• 100 escuelas × 4 diagnósticos/año = 400 diagnósticos  
• 400 diagnósticos × 8 criterios × 2 evidencias = 6,400 evidencias
• 6,400 evidencias × 0.8MB promedio = 5.12GB/año
• Costo anual: $300 ($25/mes plan Pro requerido)
```

## 🎯 Estrategias de Implementación por Fases

### Fase 1: Minimalist Strict (Actual)
- ✅ Límites súper estrictos (2MB, 2 archivos)
- ✅ Solo imágenes y PDFs básicos
- ✅ Compresión automática agresiva
- ✅ Plan gratuito Supabase
- **Objetivo:** Validar sistema con costo $0

### Fase 2: Controlled Growth
- 📅 Aumentar a 3 evidencias por criterio
- 📅 Subir límite a 3MB por archivo
- 📅 Mantener plan gratuito mientras sea posible
- **Objetivo:** Crecer sin impacto de costos

### Fase 3: Professional Scale
- 📅 Migrar a plan Pro ($25/mes) cuando sea necesario
- 📅 Implementar limpieza automática de archivos antiguos
- 📅 Agregar métricas de uso y alertas de costos
- **Objetivo:** Escalabilidad sostenible

## 🛡️ Funciones de Seguridad de Costos

### 1. Alertas Visuales
```tsx
<div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
  <div className="flex items-start space-x-2">
    <AlertTriangle size={16} className="text-amber-600" />
    <div className="text-sm">
      <p className="font-medium text-amber-800">Política de Costos Activa</p>
      <ul className="text-amber-700 mt-1">
        <li>• Máximo 2 evidencias por criterio</li>
        <li>• Solo imágenes JPG/PNG y PDFs</li>
        <li>• 2MB máximo por archivo</li>
      </ul>
    </div>
  </div>
</div>
```

### 2. Monitoreo en Tiempo Real
- Contador de archivos subidos
- Medición de tamaño total
- Alertas cuando se acerque a límites
- Bloqueo automático al alcanzar límites

### 3. Tips Educativos
```tsx
<div className="text-xs text-gray-500 bg-blue-50 p-3 rounded-lg">
  <p className="font-medium text-blue-800">💡 Tips para optimizar evidencias:</p>
  <ul className="space-y-1 text-blue-700">
    <li>• <strong>Imágenes:</strong> Usa capturas de pantalla</li>
    <li>• <strong>Videos:</strong> Sube screenshot + enlace a YouTube</li>
    <li>• <strong>Documentos:</strong> Comprime PDFs antes de subir</li>
  </ul>
</div>
```

## 🔍 Monitoreo y Métricas

### Dashboard de Costos (Futuro)
- Uso actual de almacenamiento
- Proyección mensual de costos
- Top archivos más grandes
- Alertas de límites próximos

### Comandos de Limpieza
```sql
-- Eliminar evidencias de diagnósticos antiguos (>2 años)
DELETE FROM evidencias 
WHERE created_at < NOW() - INTERVAL '2 years';

-- Ver uso de almacenamiento por escuela
SELECT escuela_id, COUNT(*) as evidencias, 
       SUM(tamaño) as total_mb
FROM evidencias 
GROUP BY escuela_id;
```

## 🚀 Mejores Prácticas

### Para Usuarios
1. **Usar capturas de pantalla** en lugar de fotos de celular
2. **Comprimir PDFs** antes de subir
3. **Subir solo evidencias esenciales**
4. **Preferir texto descriptivo** sobre archivos multimedia

### Para Desarrolladores
1. **Implementar compresión en el frontend** antes de subir
2. **Validar tamaños estrictamente**
3. **Usar formatos optimizados** (WebP para imágenes futuras)
4. **Implementar políticas de retención** automáticas

## 📋 Checklist de Implementación

- [x] Componente SubirEvidenciasEconomico creado
- [x] Límites estrictos configurados (2MB, 2 archivos)
- [x] Compresión automática implementada
- [x] Validaciones de tipo de archivo
- [x] Alertas visuales de límites
- [x] Tips educativos para usuarios
- [ ] Métricas de uso en dashboard
- [ ] Políticas de limpieza automática
- [ ] Alertas de costo por email
- [ ] Migración gradual de límites

## 🎯 Objetivos de Costo

- **Año 1:** Mantener plan gratuito ($0/mes)
- **Año 2:** Máximo $25/mes (plan Pro)
- **Año 3+:** Evaluar soluciones híbridas si es necesario

---

*Esta guía será actualizada conforme el sistema evolucione y se obtengan métricas reales de uso.*