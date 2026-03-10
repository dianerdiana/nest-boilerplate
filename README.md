# NestJS Boilerplate

## Install All Package

```bash
npm install
```

## Manual Installation

- Install NestJS:

```bash
nest new <project-name>

cd <project-name>
```

- Dependencies Packages:

```bash
npm install --save @nestjs/config @nestjs/jwt @prisma/client @prisma/adapter-mariadb winston zod bcrypt cookie-parser class-transformer @nestjs/passport passport-jwt @casl/ability @nestjs/throttler
```

- Dev Dependencies Packages:

```bash
npm install --save-dev prisma @types/bcrypt @types/cookie-parser @types/passport-jwt tsx
```

# NestJS Auth Boilerplate

A production-ready authentication boilerplate built with **NestJS**, **Prisma**, and **JWT**.
This project is designed to eliminate repetitive setup when starting new backend projects, especially for authentication, authorization, and common backend infrastructure.

## Tech Stack

- **NestJS 11**
- **Prisma ORM**
- **MariaDB / MySQL**
- **JWT Authentication**
- **Passport.js**
- **CASL (Role & Permission Authorization)**
- **Zod Validation**
- **Winston Logger**

## Features

- JWT Authentication
- Role-based access control (RBAC)
- Permission-based authorization with CASL
- User, Role, and Permission schema
- Global error handling
- Standardized API response format
- Request validation using Zod
- Structured logging with Winston
- Prisma ORM with migration & seeding
- Modular architecture

## Project Structure

```
src
├── auth                # Authentication module
├── users               # User management
├── roles               # Role management
├── permissions         # Permission system
│
├── common
│   ├── decorators
│   ├── filters
│   ├── guards
│   ├── interceptors
│   └── constants
│
├── prisma              # Prisma service
└── main.ts
```

## Installation

Clone the repository:

```bash
git clone https://github.com/dianerdiana/nestjs-auth-boilerplate.git
cd nestjs-auth-boilerplate
```

Install dependencies:

```bash
npm install
```

## Environment Setup

Copy the environment file:

```bash
cp .env.example .env
```

Example configuration:

```
DATABASE_URL="mysql://user:password@localhost:3306/nest_boilerplate"
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="1d"
```

## Database Setup

Run Prisma migration:

```bash
npx prisma migrate dev
```

Generate Prisma client:

```bash
npx prisma generate
```

Seed the database:

```bash
npx tsx prisma/seed.ts
```

Seeding will create:

- Default roles
- Default permissions
- Role-permission mapping
- Example users

## Running the Application

Development mode:

```bash
npm run start:dev
```

Production build:

```bash
npm run build
npm run start:prod
```

## API Authentication Flow

Typical authentication flow:

1. User registers or logs in
2. Server validates credentials
3. Server returns **JWT access token**
4. Client includes token in request headers

```
Authorization: Bearer <token>
```

Protected routes use **JWT Guard** and **Permission Guard**.

## Authorization

Authorization uses **CASL** to manage permissions.

Example:

```ts
@CheckPermissions('user.create')
@Post()
createUser() {}
```

Permissions are stored in the database and linked to roles.

## Default Entities

The boilerplate includes basic access control models:

- User
- Role
- Permission
- RolePermission
- UserRole

This structure allows flexible RBAC implementation.

## Testing

Run unit tests:

```bash
npm run test
```

Run e2e tests:

```bash
npm run test:e2e
```

## Scripts

| Script              | Description            |
| ------------------- | ---------------------- |
| `npm run start`     | Start application      |
| `npm run start:dev` | Start development mode |
| `npm run build`     | Build project          |
| `npm run lint`      | Run ESLint             |
| `npm run test`      | Run unit tests         |

## Purpose of This Boilerplate

Authentication is one of the most repetitive parts when starting backend projects.
This boilerplate exists to:

- eliminate repeated setup
- provide a consistent authentication architecture
- accelerate backend development

Instead of rebuilding authentication every time, you can start directly with a stable foundation.

## License

UNLICENSED
