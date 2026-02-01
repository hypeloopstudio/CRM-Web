# Salón Elite - Landing Page

Landing page para la peluquería Salón Elite con sistema de reservas online.

## Características

- Diseño moderno y responsive
- Sistema de reservas online
- Información de servicios
- Integración con el CRM (misma base de datos)

## Stack Tecnológico

- **Framework:** Next.js 14
- **Estilado:** TailwindCSS
- **UI:** ShadCN UI
- **Base de Datos:** PostgreSQL (Supabase)
- **ORM:** Prisma

## Instalación

```bash
# Instalar dependencias
npm install

# Generar cliente de Prisma
npx prisma generate

# Iniciar en desarrollo (puerto 3001)
npm run dev
```

## Variables de Entorno

Crear un archivo `.env` con:

```env
DATABASE_URL="postgresql://..."
```

## Sincronización con el CRM

La landing page comparte la misma base de datos de Supabase con el CRM. Cuando un cliente hace una reserva:

1. Se crea automáticamente como cliente en el CRM (si no existe)
2. Se crea la reserva con estado "NUEVO"
3. La reserva aparece inmediatamente en el Kanban del CRM

## Puertos

- **CRM:** http://localhost:3000
- **Landing Page:** http://localhost:3001

## Despliegue

Compatible con Vercel. Configurar las variables de entorno en el dashboard de Vercel.
