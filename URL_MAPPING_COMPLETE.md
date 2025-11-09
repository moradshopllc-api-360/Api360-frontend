# 📡 MAPEO COMPLETO DE URLs - PROYECTO API360

**Fecha:** 2025-11-06
**Rama:** `auth-frontend-finish`
**Dominio:** `http://localhost:3000`

---

## 🏠 PÁGINAS PRINCIPALES (Públicas)

### Home Page
- **URL:** `http://localhost:3000/`
- **Archivo:** `/src/app/page.tsx`
- **Estado:** ✅ Modificada (MM)
- **Descripción:** Página principal de bienvenida con autenticación integrada, redirige al dashboard si el usuario está autenticado

---

## 🔐 AUTENTICACIÓN

### Login
- **URL:** `http://localhost:3000/auth/login`
- **Archivo:** `/src/app/(main)/auth/login/page.tsx`
- **Estado:** ✅ Nueva (A)
- **Descripción:** Página de login con formulario local y botones de autenticación social

### Register
- **URL:** `http://localhost:3000/auth/register`
- **Archivo:** `/src/app/(main)/auth/register/page.tsx`
- **Estado:** ✅ Nueva (A)
- **Descripción:** Página de registro con formulario de creación de cuenta

### Auth Callback (Google OAuth)
- **URL:** `http://localhost:3000/auth/callback`
- **Archivo:** `/src/app/auth/callback/page.tsx`
- **Estado:** ✅ Nueva (A)
- **Descripción:** Callback para autenticación con Google OAuth

### Password Recovery
- **URL:** `http://localhost:3000/password-recovery`
- **Archivo:** `/src/app/password-recovery/page.tsx`
- **Estado:** ✅ Nueva (A)
- **Descripción:** Página de recuperación de contraseña

### Layout de Autenticación
- **URL:** (Aplica a todas las páginas de auth)
- **Archivo:** `/src/app/(main)/auth/layout.tsx`
- **Estado:** ✅ Nuevo (A)
- **Descripción:** Layout específico para páginas de autenticación

### ❌ PÁGINAS DE AUTENTICACIÓN OBSOLETAS
- `src/app/(main)/auth/v1/login/page.tsx` - 🗑️ Eliminada (D)
- `src/app/(main)/auth/v1/register/page.tsx` - 🗑️ Eliminada (D)
- `src/app/(main)/auth/v2/layout.tsx` - 🗑️ Eliminada (D)
- `src/app/(main)/auth/v2/login/page.tsx` - 🗑️ Eliminada (D)
- `src/app/(main)/auth/v2/register/page.tsx` - 🗑️ Eliminada (D)
- `src/app/test-auth/page.tsx` - 🗑️ Eliminada (D)

---

## 🎯 DASHBOARD PRINCIPAL

### Dashboard Index
- **URL:** `http://localhost:3000/dashboard`
- **Archivo:** `/src/app/(main)/dashboard/page.tsx`
- **Estado:** ✅ Nueva (A)
- **Descripción:** Página principal del dashboard (redirige a /dashboard/default)

### Dashboard Default
- **URL:** `http://localhost:3000/dashboard/default`
- **Archivo:** `/src/app/(main)/dashboard/default/page.tsx`
- **Estado:** ✅ Modificada (MM)
- **Descripción:** Página principal del dashboard con información general

### Dashboard Settings
- **URL:** `http://localhost:3000/dashboard/settings`
- **Archivo:** `/src/app/(main)/dashboard/settings/page.tsx`
- **Estado:** ✅ Nueva (A)
- **Descripción:** Página de configuración del dashboard

### Unauthorized
- **URL:** `http://localhost:3000/unauthorized`
- **Archivo:** `/src/app/(main)/unauthorized/page.tsx`
- **Estado:** ✅ Nueva (A)
- **Descripción:** Página de acceso no autorizado

---

## 📊 SUBPÁGINAS DE DASHBOARD

### Finance
- **URL:** `http://localhost:3000/dashboard/finance`
- **Archivo:** `/src/app/(main)/dashboard/finance/page.tsx`
- **Estado:** ✅ Nueva (A)
- **Descripción:** Módulo financiero del dashboard

### CRM
- **URL:** `http://localhost:3000/dashboard/crm`
- **Archivo:** `/src/app/(main)/dashboard/crm/page.tsx`
- **Estado:** ✅ Nueva (A)
- **Descripción:** Módulo de CRM del dashboard

### Coming Soon
- **URL:** `http://localhost:3000/dashboard/coming-soon`
- **Archivo:** `/src/app/(main)/dashboard/coming-soon/page.tsx`
- **Estado:** ✅ Nueva (A)
- **Descripción:** Página para funcionalidades próximamente disponibles

### Not Found (Dinámico)
- **URL:** `http://localhost:3000/dashboard/[...not-found]`
- **Archivo:** `/src/app/(main)/dashboard/[...not-found]/page.tsx`
- **Estado:** ✅ Nueva (A)
- **Descripción:** Manejo de rutas no encontradas en dashboard

---

## 📄 PÁGINAS LEGALES Y DE SOPORTE

### Terms and Conditions
- **URL:** `http://localhost:3000/terms`
- **Archivo:** `/src/app/terms/page.tsx`
- **Estado:** ✅ Nueva (A)
- **Descripción:** Términos y condiciones del servicio

### Privacy Policy
- **URL:** `http://localhost:3000/privacy`
- **Archivo:** `/src/app/privacy/page.tsx`
- **Estado:** ✅ Nueva (A)
- **Descripción:** Política de privacidad

### Policy
- **URL:** `http://localhost:3000/policy`
- **Archivo:** `/src/app/policy/page.tsx`
- **Estado:** ✅ Nueva (A)
- **Descripción:** Políticas generales de la aplicación

### Support
- **URL:** `http://localhost:3000/support`
- **Archivo:** `/src/app/support/page.tsx`
- **Estado:** ✅ Nueva (A)
- **Descripción:** Página de soporte técnico

---

## 🧪 PÁGINAS ESPECIALES Y DE DESARROLLO

### Ethereum Test
- **URL:** `http://localhost:3000/ethereum-test`
- **Archivo:** `/src/app/ethereum-test/page.tsx`
- **Estado:** ✅ Nueva (A)
- **Descripción:** Página de pruebas para funcionalidades de Ethereum

### External Page
- **URL:** `http://localhost:3000/external`
- **Archivo:** `/src/app/(external)/page.tsx`
- **Estado:** ✅ Nueva (A)
- **Descripción:** Página externa (propósito específico por definir)

### Recover Username (Obsoleta)
- **URL:** `http://localhost:3000/recover-username`
- **Archivo:** `/src/app/recover-username/page.tsx`
- **Estado:** ❌ Agregada luego eliminada (AD)
- **Descripción:** Recuperación de username (obsoleta)

---

## 🔌 API ROUTES

### Auth Routes
#### Login API
- **URL:** `http://localhost:3000/api/auth/login`
- **Archivo:** `/src/app/api/auth/login/route.ts`
- **Estado:** ✅ Nueva (A)
- **Descripción:** API endpoint para login local

#### Google OAuth API
- **URL:** `http://localhost:3000/api/auth/google`
- **Archivo:** `/src/app/api/auth/google/route.ts`
- **Estado:** ✅ Nueva (A)
- **Descripción:** API endpoint para autenticación con Google

#### Password Recovery API
- **URL:** `http://localhost:3000/api/auth/password-recovery`
- **Archivo:** `/src/app/api/auth/password-recovery/route.ts`
- **Estado:** ✅ Nueva (A)
- **Descripción:** API endpoint para recuperación de contraseña

#### Username Recovery API (Obsoleta)
- **URL:** `http://localhost:3000/api/auth/username-recovery`
- **Archivo:** `/src/app/api/auth/username-recovery/route.ts`
- **Estado:** ❌ Agregada luego eliminada (AD)
- **Descripción:** API de recuperación de username (obsoleta)

#### NextAuth Route (Obsoleta)
- **URL:** `http://localhost:3000/api/auth/[...nextauth]`
- **Archivo:** `/src/app/api/auth/[...nextauth]/route.ts`
- **Estado:** 🗑️ Eliminada (D)
- **Descripción:** Rutas de NextAuth (obsoleta)

### Support API
- **URL:** `http://localhost:3000/api/support`
- **Archivo:** `/src/app/api/support/route.ts`
- **Estado:** ✅ Nueva (A)
- **Descripción:** API endpoint para soporte técnico

### Register API (Obsoleta)
- **URL:** `http://localhost:3000/api/register`
- **Archivo:** `/src/app/api/register/route.ts`
- **Estado:** 🗑️ Eliminada (D)
- **Descripción:** API de registro (obsoleta)

---

## 🗂️ LAYOUTS Y PÁGINAS ESPECIALES DEL SISTEMA

### Layout Principal
- **URL:** (Aplica a toda la app)
- **Archivo:** `/src/app/layout.tsx`
- **Estado:** ✅ Modificado (MM)
- **Descripción:** Layout principal de toda la aplicación

### Layout de Dashboard
- **URL:** (Aplica a /dashboard/*)
- **Archivo:** `/src/app/(main)/dashboard/layout.tsx`
- **Estado:** ✅ Existente
- **Descripción:** Layout específico para dashboard

### Client Layout de Dashboard
- **URL:** (Aplica a /dashboard/*)
- **Archivo:** `/src/app/(main)/dashboard/client-layout.tsx`
- **Estado:** ✅ Existente
- **Descripción:** Layout client-side para dashboard

### Not Found Global
- **URL:** (Para rutas no encontradas)
- **Archivo:** `/src/app/not-found.tsx`
- **Estado:** ✅ Existente
- **Descripción:** Página 404 global

---

## 📈 RESUMEN POR CATEGORÍAS

### ✅ PÁGINAS ACTIVAS (23)
- **Páginas principales:** 1
- **Autenticación:** 4
- **Dashboard principal:** 4
- **Subpáginas dashboard:** 4
- **Legales/soporte:** 4
- **Especiales/desarrollo:** 2
- **API routes:** 4

### ❌ PÁGINAS OBSOLETAS (11)
- **Autenticación v1/v2:** 5 páginas eliminadas
- **API routes obsoletas:** 3 eliminadas
- **Páginas de prueba:** 2 eliminadas
- **Componentes obsoletos:** 1 eliminado

### 🔄 PÁGINAS MODIFICADAS (MM)
- `src/app/page.tsx` - Home page
- `src/app/layout.tsx` - Layout principal
- `src/app/(main)/dashboard/default/page.tsx` - Dashboard default
- Componentes de autenticación y sidebar

---

## 🎯 FLUJOS DE USUARIO COMPLETOS

### 1. Flujo de Autenticación
```
/ → /auth/login → /dashboard → /dashboard/default
```

### 2. Flujo de Registro
```
/ → /auth/register → /dashboard → /dashboard/default
```

### 3. Flujo de Recuperación
```
/auth/login → /password-recovery → /auth/login
```

### 4. Flujo OAuth
```
/auth/login → /auth/callback → /dashboard
```

---

## 🚀 ACCESO RÁPIDO A URLS IMPORTANTES

### Desarrollo
- Home: `http://localhost:3000/`
- Dashboard: `http://localhost:3000/dashboard`
- Login: `http://localhost:3000/auth/login`
- Register: `http://localhost:3000/auth/register`

### Testing
- Ethereum Test: `http://localhost:3000/ethereum-test`
- Unauthorized: `http://localhost:3000/unauthorized`
- Coming Soon: `http://localhost:3000/dashboard/coming-soon`

### APIs
- Auth Login: `http://localhost:3000/api/auth/login`
- Support: `http://localhost:3000/api/support`
- Google OAuth: `http://localhost:3000/api/auth/google`

---

**Total de URLs mapeadas:** 34 (23 activas + 11 obsoletas)
**Estado del proyecto:** ✅ Funcional con migración completa a Supabase
**Última actualización:** 2025-11-06