# AI360 Workflow System - Documentación Actualizada

## Overview

El sistema AI360 Workflow proporciona una forma estandarizada y centralizada de manejar acciones de API en el frontend de API360. Este documento describe la implementación correcta y las mejores prácticas.

## Arquitectura Centralizada

### 1. Sistema de Autenticación Centralizado

**✅ APPROACH CORRECTO:** Usar `apiFetch()` de `/config/api-config.ts`
- Maneja automáticamente los headers de autenticación via `authHeader()`
- Centraliza la lógica de tokens (localStorage/sessionStorage)
- Proporciona retry logic y manejo de errores consistente

**❌ APPROACH INCORRECTO:** Manejar tokens manualmente en cada componente
- Duplicación de código
- Inconsistencias en el manejo de tokens
- Mayor riesgo de errores

### 2. ActionSpec Interface

```typescript
export interface ActionSpec {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  path: string // Relative path only (e.g., '/api/auth/login')
  body?: any
  // Note: Headers are automatically handled by apiFetch() including auth token
  doc?: {
    title?: string
    description?: string
    parameters?: Record<string, any>
    examples?: any[]
  }
}
```

**Puntos Clave:**
- **Solo path relativo** - No URLs absolutas
- **Sin headers** - Manejados automáticamente por `apiFetch()`
- **Documentación integrada** - Para autogeneración de docs

## Componentes del Sistema

### 1. apiFetch() - Función Centralizada
```typescript
import { apiFetch } from '@/config/api-config'

// Uso básico
const response = await apiFetch('/api/users/profile', {
  method: 'GET'
})

// Con datos
const response = await apiFetch('/api/auth/login', {
  method: 'POST',
  body: JSON.stringify({ email, password })
})
```

**Características:**
- Autenticación automática via `authHeader()`
- Base URL configuración automática
- Retry logic incorporado
- Error handling estandarizado

### 2. useAIAutowire() Hook
```typescript
import { useAIAutowire } from '@/hooks/use-ai-autowire'

const { execute, loading, error, response } = useAIAutowire({
  onSuccess: (data) => console.log('Success:', data),
  onError: (error) => console.error('Error:', error)
})

// Ejecutar acción
await execute({
  method: 'POST',
  path: '/api/auth/login',
  doc: {
    title: 'User Login',
    description: 'Authenticate user credentials'
  }
}, { email, password })
```

**Características:**
- Integración con `apiFetch()` para auth centralizada
- Logging automático via `useDocLogger()`
- Estados de loading/error/response
- Callbacks para success/error

### 3. AIButton Component
```typescript
import { AIButton } from '@/components/ai/AIButton'

<AIButton
  spec={{
    method: 'POST',
    path: '/api/auth/login',
    doc: {
      title: 'User Login',
      description: 'Authenticate with email and password'
    }
  }}
  data={{ email, password }}
  onActionSuccess={(data) => {
    // Manejar respuesta exitosa
  }}
  loadingText="Signing in..."
  errorText="Login failed"
>
  Login
</AIButton>
```

**Características:**
- Integración completa con el sistema AI360
- Estados visuales de loading/error
- Logging automático
- Props para personalización

## Estructura de Archivos

```
src/
├── lib/ai/
│   ├── actions.ts          # ActionSpec interface y acciones predefinidas
│   └── doc-logger.tsx      # Sistema de logging
├── hooks/
│   └── use-ai-autowire.ts  # Hook principal de autowire
├── components/ai/
│   ├── AIButton.tsx        # Componente de botón con AI360
│   └── AIWorkflowProvider.tsx # Provider para workflows complejos
├── config/
│   └── api-config.ts       # Configuración centralizada de API
└── types/
    └── actions.ts          # Tipos adicionales si se necesitan
```

## Ejemplos de Uso

### 1. Login Simple
```typescript
const loginSpec: ActionSpec = {
  method: 'POST',
  path: '/api/auth/login',
  doc: {
    title: 'User Login',
    description: 'Authenticate user with credentials',
    parameters: {
      email: 'string',
      password: 'string'
    }
  }
}

// En un componente
<AIButton
  spec={loginSpec}
  data={{ email, password }}
  onActionSuccess={(userData) => {
    // Redirigir al dashboard
    router.push('/dashboard')
  }}
>
  Login
</AIButton>
```

### 2. Obtener Perfil de Usuario
```typescript
const getProfileSpec: ActionSpec = {
  method: 'GET',
  path: '/api/users/profile',
  doc: {
    title: 'Get User Profile',
    description: 'Retrieve current user profile information'
  }
}

// En un componente
function UserProfile() {
  const { execute, loading, error, response } = useAIAutowire()

  useEffect(() => {
    execute(getProfileSpec)
  }, [])

  if (loading) return <div>Loading profile...</div>
  if (error) return <div>Error: {error.message}</div>
  if (response) return <div>Welcome, {response.name}!</div>
}
```

### 3. Workflow Complejo
```typescript
import { useSimpleWorkflow } from '@/components/ai/AIWorkflowProvider'

function OnboardingWorkflow() {
  const { runWorkflow, isRunning, isCompleted, hasError } = useSimpleWorkflow()

  const startOnboarding = async () => {
    const result = await runWorkflow('User Onboarding', [
      {
        name: 'Create User Profile',
        spec: {
          method: 'POST',
          path: '/api/users/profile',
          doc: { title: 'Create Profile', description: 'Create user profile' }
        },
        data: { name, email, preferences }
      },
      {
        name: 'Send Welcome Email',
        spec: {
          method: 'POST',
          path: '/api/notifications/welcome',
          doc: { title: 'Welcome Email', description: 'Send welcome email' }
        }
      },
      {
        name: 'Initialize Dashboard',
        spec: {
          method: 'POST',
          path: '/api/dashboard/init',
          doc: { title: 'Init Dashboard', description: 'Initialize user dashboard' }
        }
      }
    ])

    if (result.success) {
      console.log('Onboarding completed successfully')
    }
  }

  return (
    <button onClick={startOnboarding} disabled={isRunning}>
      {isRunning ? 'Setting up your account...' : 'Start Onboarding'}
    </button>
  )
}
```

## Configuración del Environment

### Variables de Entorno Requeridas
```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000  # o tu API URL
NEXT_PUBLIC_WS_URL=ws://localhost:8000/ws   # para WebSockets si se usan
```

### Configuración de API
```typescript
// src/config/api-config.ts
export const API_CONFIG = {
  BASE_URLS: {
    development: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
    production: process.env.NEXT_PUBLIC_API_URL || 'https://api.api360.com',
    staging: process.env.NEXT_PUBLIC_API_URL || 'https://staging-api.api360.com'
  }
}
```

## Mejores Prácticas

### 1. ✅ Siempre usar paths relativos
```typescript
// Correcto
path: '/api/users/profile'

// Incorrecto
path: 'http://localhost:8000/api/users/profile'
```

### 2. ✅ No especificar headers manualmente
```typescript
// Correcto - headers manejados automáticamente
const spec: ActionSpec = {
  method: 'GET',
  path: '/api/users/profile'
}

// Incorrecto - duplicación de headers
const spec: ActionSpec = {
  method: 'GET',
  path: '/api/users/profile',
  headers: { 'Authorization': 'Bearer token' } // NO hacer esto
}
```

### 3. ✅ Documentar todas las acciones
```typescript
const spec: ActionSpec = {
  method: 'POST',
  path: '/api/support/tickets',
  doc: {
    title: 'Create Support Ticket',
    description: 'Create a new support ticket',
    parameters: {
      subject: 'string',
      message: 'string',
      priority: 'string'
    },
    examples: [{
      description: 'Create high priority ticket',
      parameters: {
        subject: 'Login Issue',
        message: 'Cannot login to account',
        priority: 'high'
      }
    }]
  }
}
```

### 4. ✅ Manejar estados de loading y error
```typescript
function MyComponent() {
  const { execute, loading, error } = useAIAutowire()

  const handleClick = async () => {
    try {
      await execute(spec, data)
    } catch (err) {
      // El error ya está manejado por el hook
    }
  }

  return (
    <div>
      <button onClick={handleClick} disabled={loading}>
        {loading ? 'Processing...' : 'Submit'}
      </button>
      {error && <div className="error">Error: {error.message}</div>}
    </div>
  )
}
```

## Debugging y Logging

El sistema incluye logging automático via `DocLoggerProvider`:

```typescript
// Los logs se generan automáticamente para cada acción
{
  type: 'info' | 'success' | 'error' | 'warning',
  message: 'Descriptive message',
  action: 'METHOD path',
  data: { /* request/response data */ },
  duration: 123 // milisegundos
}

// Exportar logs como markdown
import { ExportMarkdownButton } from '@/components/ai/doc-logger'

<ExportMarkdownButton /> // Muestra botón para exportar logs
```

## Integración con Backend

### Formato de Respuesta Esperado
```typescript
// Success response
{
  data: { /* response data */ },
  status: 200,
  success: true
}

// Error response
{
  error: 'Error message',
  status: 400,
  success: false
}
```

### Headers de Autenticación
El frontend envía automáticamente:
```
Authorization: Bearer <JWT_TOKEN>
```

El backend debe validar este token y responder apropiadamente.

## Troubleshooting

### Problemas Comunes

1. **"useDocLogger must be used within a DocLoggerProvider"**
   - ✅ Solución: Asegurar que el componente está envuelto en `AIWorkflowProvider`
   - ✅ El layout ya incluye el provider correctamente

2. **Token de autenticación no funciona**
   - ✅ Verificar que `authHeader()` en `api-config.ts` obtiene el token correctamente
   - ✅ Verificar que el backend valida el header `Authorization: Bearer <token>`

3. **CORS errors**
   - ✅ Configurar CORS en el backend para permitir el origen del frontend
   - ✅ Incluir headers necesarios en la configuración CORS

4. **"Path must start with /"**
   - ✅ Usar siempre paths relativos que empiezan con `/`
   - ✅ Ejemplo: `/api/auth/login` (no `api/auth/login`)

## Resumen de Cambios Realizados

1. **Centralización de autenticación**: `useAIAutowire` ahora usa `apiFetch()`
2. **Remoción de duplicación**: Eliminado manejo manual de headers
3. **Interface consistente**: `ActionSpec` ahora solo usa `path` relativo
4. **Providers correctos**: `DocLoggerProvider` manejado por `AIWorkflowProvider`
5. **Documentación actualizada**: Comentarios y ejemplos consistentes

## Conclusión

El sistema AI360 Workflow ahora proporciona una forma unificada y consistente de manejar acciones de API, con:

- ✅ Autenticación centralizada
- ✅ Logging automático
- ✅ Manejo de errores consistente
- ✅ Interfaces limpias y tipadas
- ✅ Documentación autogenerada

Este approach reduce la duplicación de código, mejora la mantenibilidad y proporciona una experiencia de desarrollo más fluida.