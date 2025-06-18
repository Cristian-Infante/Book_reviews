# Book_Reviews

Este repositorio contiene dos proyectos:

1. **API (Book Reviews)** – ASP .NET Core 8 con Clean Architecture.  
2. **Frontend (Next.js + TypeScript)** – consume la API.

---

## Diagramas

### Diagrama de datos

```mermaid
erDiagram
    User {
        int Id PK
        string FirstName
        string LastName
        string Email
        string PasswordHash
        byte[] ProfileImage
    }
    Category {
        int Id PK
        string Name
    }
    Book {
        int Id PK
        string Title
        string Author
        string Summary
        int CategoryId FK
    }
    Review {
        int Id PK
        int BookId FK
        int UserId FK
        int Rating
        string Comment
        datetime CreatedAt
        datetime UpdatedAt
    }
    PasswordResetToken {
        int Id PK
        int UserId FK
        string Token
        datetime ExpiresAt
        bool Used
    }

    User ||--o{ Review                : writes
    Book ||--o{ Review                : has
    Category ||--o{ Book              : contains
    User ||--o{ PasswordResetToken    : owns
```

### Diagrama de componentes

```mermaid
graph TB
  subgraph Presentación [Presentation]
    API["Controllers (Auth, Users, Books, Reviews, Categories)"]
    Middleware["ExceptionHandlingMiddleware"]
  end
  subgraph Aplicación [Application]
    Pipeline["TransactionBehavior (MediatR Pipeline)"]
    Handlers["Command & Query Handlers"]
    Servicios["JwtTokenService<br/>SmtpEmailService"]
    Mapeo["AutoMapper Profiles"]
  end
  subgraph Dominio [Domain]
    Entidades["Entidades (User, Book, Review, Category, ... )"]
    Interfaces["IRepository, ICommand, IJwtTokenService, IEmailService"]
  end
  subgraph Infraestructura [Infrastructure]
    Contexto["AppDbContext"]
    Repositorios["EF Core Repositories"]
    UoW["UnitOfWork"]
  end

  API --> Pipeline
  API --> Handlers
  Pipeline --> UoW
  Handlers --> Servicios
  Handlers --> Contexto
  Contexto --> Entidades
  Repositorios --> Interfaces
  UoW --> Contexto
  Mapeo --> Entidades
```

### Diagrama de paquetes

```mermaid
graph LR
  subgraph Presentation
    Controllers
    Middleware
  end
  subgraph Application
    Commands
    Queries
    Handlers
    DTOs
    Mapping
    Services
    Behaviors
    Interfaces
    Utilities
  end
  subgraph Domain
    Entities
    Interfaces
  end
  subgraph Infrastructure
    Data
    Repositories
    UnitOfWork
  end

  Presentation --> Application
  Application --> Domain
  Application --> Infrastructure
  Infrastructure --> Domain
```

---

## Backend – Book Reviews API

### Prerrequisitos

- [.NET 8 SDK](https://dotnet.microsoft.com/download)  
- MySQL 8+ en `localhost:3306` (o ajustar en appsettings)

### Configuración

1. Copiar `Presentation/appsettings.json` → `Presentation/appsettings.Development.json` y ajustar:
   ```jsonc
   {
     "ConnectionStrings": {
       "MySql": "Server=localhost;Port=3306;Database=book_reviews;Uid=root;Pwd=root;"
     },
     "JwtSettings": {
       "SecretKey": "<tu_clave>",
       "Issuer": "<tu_issuer>",
       "Audience": "<tu_audience>",
       "AccessTokenExpirationMinutes": 60,
       "RefreshTokenExpirationDays": 7
     },
     "Smtp": {
       "Host": "smtp.sendgrid.net",
       "Port": 465,
       "UseSsl": true,
       "User": "apikey",
       "Password": "<tu_api_key>",
       "From": "tu@correo.com"
     }
   }
   ```

### Ejecutar localmente

```bash
git clone https://github.com/Cristian-Infante/Book_reviews
cd "Book Reviews"

# reconstruir y ejecutar API
dotnet restore
dotnet build
dotnet run --project Presentation/Presentation.csproj
```

Accede a **https://localhost:7074/swagger** para probar endpoints.

### Despliegue con Docker Compose

1. Crear `compose.yaml` en raíz:
   ```yaml
   version: '3.8'
   services:
     db:
       image: mysql:8
       environment:
         MYSQL_ROOT_PASSWORD: root
         MYSQL_DATABASE: book_reviews
       ports: ['3306:3306']
     api:
       build:
         context: .
         dockerfile: Presentation/Dockerfile
       depends_on: ['db']
       environment:
         ConnectionStrings__MySql: "Server=db;Port=3306;Database=book_reviews;Uid=root;Pwd=root;"
         JwtSettings__SecretKey:    "<tu_clave>"
         JwtSettings__Issuer:       "<tu_issuer>"
         JwtSettings__Audience:     "<tu_audience>"
         Smtp__Host:                "smtp.sendgrid.net"
         Smtp__Port:                "465"
         Smtp__UseSsl:              "true"
         Smtp__User:                "apikey"
         Smtp__Password:            "<tu_api_key>"
         Smtp__From:                "tu@correo.com"
       ports: ['5219:5219']
   ```
2. Levantar:
   ```bash
   docker-compose up -d
   ```

## 🖥️ Frontend – Next.js + TypeScript

### Prerrequisitos

- [Node.js 18+](https://nodejs.org/)  
- npm o Yarn

### Configuración

1. Crear `.env.local` en carpeta del frontend:
   ```ini
   NEXT_PUBLIC_API_URL=http://localhost:5219/api
   ```
2. Ajustar si cambia el puerto o dominio de la API.

### Ejecutar localmente

```bash
cd book_reviews_front
npm install
npm run dev
```

Abre **http://localhost:3000** en tu navegador.

### Despliegue en Vercel

1. Conecta tu repo en Vercel.  
2. Define en **Settings → Environment Variables**:
   ```
   NEXT_PUBLIC_API_URL = https://<tu-dominio>/api
   ```
3. Build & Deploy (Vercel detecta Next.js automáticamente).