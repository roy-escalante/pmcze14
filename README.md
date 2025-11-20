# PMCZE14 - Programa de Mejora Continua Zona Escolar 14

Aplicación web para la gestión integral del diagnóstico, planeación, seguimiento y evaluación del Programa de Mejora Continua de la Zona Escolar 14 - Escuelas Secundarias Técnicas, Huasteca Potosina, SLP.

## 📋 Descripción

Sistema de gestión educativa que facilita el Programa de Mejora Continua para 6 Escuelas Secundarias Técnicas:

**Región Norte:**
- EST 41
- EST 77
- EST 81

**Región Sur:**
- EST 4
- EST 7
- EST 82

## 🎯 Objetivos

- Digitalizar y centralizar el proceso de diagnóstico educativo
- Facilitar el análisis comparativo entre escuelas y regiones
- Optimizar la planeación y seguimiento del PMC
- Generar reportes automáticos basados en datos reales
- Mejorar la toma de decisiones basada en evidencia

## 🏗️ Arquitectura

### Stack Tecnológico

- **Frontend:** React 18+ con TypeScript
- **Estilos:** Tailwind CSS + shadcn/ui
- **Estado:** Zustand
- **Formularios:** React Hook Form + Zod
- **Gráficas:** Recharts
- **Rutas:** React Router v6
- **Build:** Vite

### Estructura del Proyecto

```
src/
├── components/          # Componentes React
│   ├── ui/             # Componentes base de shadcn/ui
│   ├── diagnostico/    # Módulo de diagnóstico
│   └── shared/         # Componentes compartidos
├── hooks/              # Custom hooks
├── services/           # Servicios API y comunicación
├── stores/             # Stores de Zustand
├── types/              # Definiciones TypeScript
├── utils/              # Funciones utilitarias
└── lib/                # Librerías y configuraciones
```

## 🚀 Comenzando

### Prerequisitos

- Node.js 18+
- npm o yarn

### Instalación

1. Clonar el repositorio
```bash
git clone [URL_DEL_REPO]
cd PMCZE14
```

2. Instalar dependencias
```bash
npm install
```

3. Iniciar el servidor de desarrollo
```bash
npm run dev
```

4. Abrir en el navegador
```
http://localhost:5173
```

## 📦 Scripts Disponibles

- `npm run dev` - Inicia servidor de desarrollo
- `npm run build` - Compila para producción
- `npm run preview` - Preview del build de producción
- `npm run lint` - Ejecuta ESLint
- `npm run format` - Formatea código con Prettier

## 📚 Módulos del Sistema

### 1. Módulo Diagnóstico
- Gestión de instrumentos de diagnóstico
- Recolección y validación de datos
- Dashboard de progreso por escuela

### 2. Módulo Análisis
- Estadística descriptiva
- Análisis comparativo (escuelas/regiones)
- Visualizaciones interactivas
- Matriz de priorización

### 3. Módulo Planeación
- Gestión de objetivos SMART
- Definición de metas e indicadores
- Programación de acciones
- Asignación de responsables

### 4. Módulo Seguimiento
- Tablero de control
- Captura de evidencias
- Reportes de avance
- Alertas y notificaciones

### 5. Módulo Evaluación
- Indicadores de proceso y resultado
- Generación de informes
- Repositorio de documentos

## 👥 Roles de Usuario

- **Supervisor:** Acceso completo a todas las escuelas y funciones
- **Inspector:** Gestión de su región asignada (Norte/Sur)
- **Director:** Gestión de su escuela
- **Docente:** Captura de datos y consulta
- **Padre de Familia:** Consulta de información relevante
- **Estudiante:** Acceso a información personalizada

## 🔒 Seguridad y Privacidad

El sistema maneja datos sensibles de menores de edad y debe cumplir con:
- LFPDPPP (Ley Federal de Protección de Datos Personales)
- Normativa SEP
- Medidas de seguridad implementadas:
  - Autenticación robusta
  - Control de acceso basado en roles (RBAC)
  - Encriptación de datos sensibles

## 📖 Documentación

Para información detallada sobre la arquitectura, decisiones técnicas y guías de desarrollo, consulta [BLUEPRINT.MD](./BLUEPRINT.MD)

## 🤝 Contribución

Este es un proyecto educativo. Para contribuir:
1. Revisa el BLUEPRINT.MD
2. Sigue las convenciones de código establecidas
3. Documenta tus cambios
4. Realiza commits descriptivos

## 📝 Fases del Proyecto

- ✅ **Fase 0:** Configuración inicial del proyecto
- 🚧 **Fase 1:** Web App Responsiva (MVP) - En desarrollo
- 📋 **Fase 2:** Migración a App Móvil
- 📋 **Fase 3:** Módulos Avanzados (IA, Analítica Predictiva)

## 📄 Licencia

Este proyecto es desarrollado para fines educativos en el contexto del Programa de Mejora Continua de la Zona Escolar 14, SLP, México.

## 👨‍💻 Contacto

Para más información sobre el proyecto, consulta con el Supervisor de la Zona Escolar 14.

---

**Desarrollado con ❤️ para la educación en la Huasteca Potosina**
