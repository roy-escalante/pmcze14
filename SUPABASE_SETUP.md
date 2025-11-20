# 🔧 Configuración de Backend con Supabase

Este guide te ayudará a configurar Supabase como backend para el sistema PMCZE14.

## 📋 Prerrequisitos

- Cuenta en [Supabase](https://supabase.com) (gratuita)
- Node.js instalado
- Git instalado

## 🚀 Pasos de Configuración

### 1. Crear Proyecto en Supabase

1. **Ve a [Supabase](https://supabase.com)** y crea una cuenta gratuita
2. **Crea un nuevo proyecto**:
   - Nombre: `pmcze14-production` (o como prefieras)
   - Región: `Central US` (recomendado para México)
   - Database Password: Crea una contraseña segura (guárdala!)

3. **Espera** a que el proyecto se configure (2-3 minutos)

### 2. Configurar Base de Datos

1. **Ve a SQL Editor** en el dashboard de Supabase
2. **Crea un nuevo query**
3. **Copia y pega** todo el contenido del archivo `/database/schema.sql`
4. **Ejecuta** el script (botón "Run")
5. **Verifica** que las tablas se crearon correctamente en Database > Tables

### 3. Configurar Variables de Entorno

1. **En Supabase**, ve a Settings > API
2. **Copia** los siguientes valores:
   - `Project URL`
   - `anon/public key`

3. **En tu proyecto**, crea el archivo `.env.local`:
```bash
# Copia .env.example a .env.local
cp .env.example .env.local
```

4. **Edita** `.env.local` con tus valores reales:
```env
VITE_SUPABASE_URL=https://tu-proyecto-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.tu-anon-key-real
VITE_APP_NAME=PMCZE14
VITE_APP_VERSION=1.0.0
```

### 4. Configurar Autenticación

1. **En Supabase**, ve a Authentication > Settings
2. **Configurar Email Auth**:
   - Site URL: `http://localhost:5173`
   - Redirect URLs: `http://localhost:5173/**`
   - Enable email confirmations: `false` (para desarrollo)

3. **Para producción**, agrega tu dominio real en Site URL

### 5. Crear Usuarios de Prueba

Tienes dos opciones:

#### Opción A: Usar datos del script SQL
Los usuarios de prueba ya están en la base de datos, pero necesitas crear sus cuentas de autenticación:

1. **Ve a Authentication > Users** en Supabase
2. **Haz clic en "Invite User"** para cada uno:
   - `supervisor@ze14.edu.mx`
   - `inspector@ze14.edu.mx`
   - `director1@ze14.edu.mx`
   - `director2@ze14.edu.mx`
3. **Asigna la contraseña** `demo123` a cada uno

#### Opción B: Registro desde la app
1. **Inicia la aplicación**: `npm run dev`
2. **Usa el formulario de registro** en la aplicación
3. **Los datos se sincronizarán** automáticamente

### 6. Migrar Stores a Supabase

Ya hemos preparado los nuevos stores que usan Supabase. Para activarlos:

1. **Actualizar imports** en `src/stores/index.ts`:
```typescript
// Cambiar esto:
export * from './authStore'

// Por esto:
export * from './supabaseAuthStore'
export { useAuth } from './supabaseAuthStore'
```

2. **Instalar dependencias adicionales** (ya instaladas):
```bash
npm install @supabase/supabase-js
```

## 🧪 Verificar Configuración

### 1. Test de Conexión
```bash
npm run dev
```

### 2. Test de Login
1. Abre `http://localhost:5173`
2. Usa las credenciales:
   - Email: `supervisor@ze14.edu.mx`
   - Password: `demo123`

### 3. Test de Base de Datos
1. Ve al dashboard de Supabase
2. Database > Tables
3. Deberías ver datos en las tablas `usuarios`, `escuelas`

## 🔒 Seguridad (RLS)

El esquema incluye Row Level Security (RLS) configurado:

- **Usuarios**: Solo pueden ver/editar su propio perfil
- **Escuelas**: Todos pueden ver, solo supervisores/inspectores pueden editar
- **Diagnósticos**: Usuarios ven los suyos, supervisores/inspectores ven todos

## 📊 Características Implementadas

### ✅ Autenticación Completa
- Login/Logout con JWT
- Registro de usuarios
- Recuperación de contraseña
- Actualización de perfil
- Manejo de sesiones

### ✅ Base de Datos Robusta
- Esquema normalizado
- Índices optimizados
- Triggers automáticos
- RLS configurado
- Datos de prueba

### ✅ Integración en Tiempo Real
- Sincronización automática
- Persistencia automática
- Manejo de errores
- Estados de carga

## 🚀 Para Producción

### 1. Configurar Dominio
```env
VITE_SUPABASE_URL=https://tu-proyecto-id.supabase.co
# Cambiar localhost por tu dominio real
```

### 2. Habilitar Email Confirmations
En Supabase > Authentication > Settings:
- Enable email confirmations: `true`

### 3. Configurar SMTP (Opcional)
Para emails personalizados en Authentication > Settings > SMTP

### 4. Backup Automático
Supabase hace backups automáticos, pero configura backups adicionales en Settings > Database

## 🆘 Troubleshooting

### Error: "Variables de entorno no configuradas"
- Verifica que `.env.local` existe y tiene los valores correctos
- Reinicia el servidor: `npm run dev`

### Error: "Usuario no encontrado en la base de datos"
- Verifica que el script SQL se ejecutó correctamente
- Los UUIDs en usuarios deben coincidir con los de Supabase Auth

### Error de conexión a Supabase
- Verifica la URL del proyecto
- Verifica que la anon key es correcta
- Verifica tu conexión a internet

### Problemas de autenticación
1. Ve a Supabase > Authentication > Users
2. Verifica que los usuarios existen
3. Reenvía invitación si es necesario

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs en la consola del navegador
2. Revisa los logs en Supabase > Logs
3. Verifica que el esquema SQL se ejecutó sin errores

---

## 🎉 ¡Listo!

Una vez configurado, tendrás:
- ✅ Backend en la nube completamente funcional
- ✅ Autenticación robusta con JWT
- ✅ Base de datos PostgreSQL optimizada
- ✅ Sincronización en tiempo real
- ✅ Seguridad a nivel de fila (RLS)
- ✅ Respaldos automáticos

**¡Tu sistema PMCZE14 estará listo para producción!** 🚀