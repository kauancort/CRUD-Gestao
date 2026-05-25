# 📋 CRUD-Gestão

Sistema fullstack de **gestão organizacional** com CRUD completo para gerenciar **organizações**, **colaboradores** e **dispositivos**. Inclui autenticação JWT, controle de acesso por roles e uma interface moderna construída com Angular.

---

## 🚀 Como Executar

### Pré-requisitos

- **Java 21+**
- **Node.js 18+** e **npm**
- **MySQL** rodando localmente
- **Angular CLI** (`npm install -g @angular/cli`)

### Banco de Dados

Antes de iniciar o backend, crie o banco de dados no MySQL:

```sql
CREATE DATABASE gestao;
```

### Backend

```bash
# 1. Navegue até a pasta do backend
cd gestao

# 2. Copie e configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com suas credenciais do MySQL e uma chave JWT

# 3. Execute com Maven Wrapper

# Linux / macOS:
./mvnw spring-boot:run

# Windows (CMD / PowerShell):
.\mvnw.cmd spring-boot:run
```

O backend estará disponível em `http://localhost:8080`.

### Frontend

```bash
# 1. Navegue até a pasta do frontend
cd AngularCRUD-Gestao

# 2. Instale as dependências
npm install

# 3. Inicie o servidor de desenvolvimento
ng serve
```

O frontend estará disponível em `http://localhost:4200`.

### Variáveis de Ambiente (Backend)

| Variável         | Descrição                           | Exemplo                                      |
| ---------------- | ----------------------------------- | -------------------------------------------- |
| `DB_URL`         | URL de conexão com o MySQL          | `jdbc:mysql://localhost:3306/gestao`       |
| `DB_USER`        | Usuário do banco                    | `root`                                       |
| `DB_PASSWORD`    | Senha do banco                      | `senha123`                                   |
| `JWT_SECRET`     | Chave secreta para assinar tokens   | `minha-chave-secreta-muito-segura`           |
| `JWT_EXPIRATION` | Tempo de expiração do token (ms)    | `86400000` (24 horas, padrão)                |

---

## 🛠️ Tecnologias

| Camada     | Tecnologia                                                  |
| ---------- | ----------------------------------------------------------- |
| **Frontend** | Angular 21, TypeScript 5.9, Lucide Icons, RxJS              |
| **Backend**  | Kotlin, Spring Boot 4.0, Spring Security, Spring Data JPA  |
| **Banco**    | MySQL (Hibernate / JPA)                                     |
| **Auth**     | JWT (jjwt) com interceptor no frontend                     |
| **Build**    | Maven (backend), Angular CLI (frontend)                    |

---

## 📁 Estrutura do Projeto

```
CRUD-Gestao/
├── AngularCRUD-Gestao/     # Frontend Angular
├── gestao/                 # Backend Spring Boot (Kotlin)
└── .gitignore
```

---

### 🖥️ Frontend — `AngularCRUD-Gestao/`

```
AngularCRUD-Gestao/
├── src/
│   ├── app/
│   │   ├── core/               # Lógica central da aplicação
│   │   │   ├── auth/           # Autenticação (guard, service, store, interceptor JWT)
│   │   │   └── services/       # Serviços HTTP (collab, dashboard, device, org)
│   │   │
│   │   ├── features/           # Módulos de funcionalidade (páginas)
│   │   │   ├── auth/           # Página de login/registro
│   │   │   ├── collaborators/  # Listagem e CRUD de colaboradores
│   │   │   ├── dashboard/      # Painel principal com métricas
│   │   │   ├── device/         # Listagem e CRUD de dispositivos
│   │   │   └── organizations/  # Listagem e CRUD de organizações
│   │   │
│   │   ├── layouts/            # Layouts reutilizáveis
│   │   │   └── main-layout/    # Layout principal com header e sidebar
│   │   │
│   │   ├── shared/             # Código compartilhado
│   │   │   └── models/         # Interfaces/modelos TypeScript
│   │   │
│   │   ├── services/           # (reservado para serviços adicionais)
│   │   ├── app.routes.ts       # Definição de rotas da aplicação
│   │   ├── app.config.ts       # Configuração de providers (router, HTTP, interceptors)
│   │   └── app.ts              # Componente raiz
│   │
│   ├── environments/           # Configurações por ambiente (dev/prod)
│   ├── styles.css              # Estilos globais
│   ├── index.html              # HTML principal
│   └── main.ts                 # Bootstrap da aplicação
│
├── angular.json                # Configuração do Angular CLI
├── package.json                # Dependências e scripts npm
└── tsconfig.json               # Configuração do TypeScript
```

#### O que cada pasta faz:

| Pasta | Descrição |
| ----- | --------- |
| `core/auth/` | Contém o **guard de rotas** (`auth.guard.ts`) que protege páginas autenticadas, o **serviço de autenticação** (`auth.service.ts`) para login/registro, a **store de estado** (`auth.store.ts`) para gerenciar o usuário logado, e o **interceptor JWT** (`jwt.interceptor.ts`) que anexa o token em todas as requisições HTTP. |
| `core/services/` | Serviços HTTP que se comunicam com a API REST do backend. Cada serviço (`collab.service.ts`, `dashboard.service.ts`, `device.service.ts`, `org.service.ts`) encapsula as chamadas para um recurso específico. |
| `features/` | Cada subpasta é um **módulo de funcionalidade** com seus próprios componentes (`.ts`, `.html`, `.css`). Utiliza **lazy loading** via `loadComponent()` nas rotas para melhor performance. |
| `layouts/main-layout/` | Layout principal da aplicação com **header** (barra superior) e **sidebar** (menu lateral). Todas as páginas autenticadas são renderizadas dentro deste layout. |
| `shared/models/` | Interfaces TypeScript que definem a forma dos dados (`Collaborator`, `Device`, `Organization`, `User`, `Dashboard`, `Auth`), garantindo tipagem forte em todo o frontend. |
| `environments/` | Arquivos de configuração por ambiente, como a URL base da API. |

---

### ⚙️ Backend — `gestao/`

```
gestao/
├── src/
│   ├── main/
│   │   ├── kotlin/com/desafio/gestao/
│   │   │   ├── GestaoApplication.kt       # Classe principal Spring Boot
│   │   │   │
│   │   │   ├── configuration/              # Configurações do Spring
│   │   │   │   └── SecurityConfig.kt       # Configuração do Spring Security e CORS
│   │   │   │
│   │   │   ├── controller/                 # Controladores REST (endpoints da API)
│   │   │   │   ├── AuthController.kt       # POST /auth/login, /auth/register
│   │   │   │   ├── CollaboratorController.kt
│   │   │   │   ├── DeviceController.kt
│   │   │   │   └── OrganizationController.kt
│   │   │   │
│   │   │   ├── dto/                        # Data Transfer Objects
│   │   │   │   ├── request/                # DTOs de entrada (criação/atualização)
│   │   │   │   ├── response/               # DTOs de saída (respostas da API)
│   │   │   │   ├── loginRegister/          # DTOs de autenticação
│   │   │   │   └── error/                  # DTOs de erro padronizado
│   │   │   │
│   │   │   ├── exception/                  # Exceções customizadas
│   │   │   │   ├── BadRequestException.kt
│   │   │   │   ├── ConflictException.kt
│   │   │   │   ├── NotFoundException.kt
│   │   │   │   ├── UnauthorizedException.kt
│   │   │   │   └── ValidationException.kt
│   │   │   │
│   │   │   ├── handler/                    # Handler global de exceções
│   │   │   │   └── GlobalExceptionHandler.kt
│   │   │   │
│   │   │   ├── model/                      # Entidades JPA (tabelas do banco)
│   │   │   │   ├── Collaborator.kt         # Usuário/colaborador (implementa UserDetails)
│   │   │   │   ├── Device.kt               # Dispositivo da organização
│   │   │   │   ├── Organization.kt         # Organização/empresa
│   │   │   │   └── enums/                  # Enumerações (CollaboratorType, DeviceCondition)
│   │   │   │
│   │   │   ├── repository/                 # Interfaces de acesso ao banco (Spring Data)
│   │   │   │   ├── CollaboratorRepository.kt
│   │   │   │   ├── DeviceRepository.kt
│   │   │   │   └── OrganizationRepository.kt
│   │   │   │
│   │   │   ├── security/                   # Segurança e JWT
│   │   │   │   ├── CustomUserDetailsService.kt  # Carrega usuário do banco para autenticação
│   │   │   │   ├── JwtAuthFilter.kt              # Filtro que valida o token JWT
│   │   │   │   └── JwtService.kt                 # Geração e validação de tokens
│   │   │   │
│   │   │   └── service/                    # Camada de regras de negócio
│   │   │       ├── AuthService.kt
│   │   │       ├── CollaboratorService.kt
│   │   │       ├── DeviceService.kt
│   │   │       └── OrganizationService.kt
│   │   │
│   │   └── resources/
│   │       └── application.properties      # Configurações (banco, JWT, etc.)
│   │
│   └── test/                               # Testes automatizados
│
├── .env.example                            # Template de variáveis de ambiente
├── pom.xml                                 # Dependências Maven
├── mvnw / mvnw.cmd                         # Maven Wrapper (Linux/Windows)
└── HELP.md                                 # Referências do Spring Boot
```

#### O que cada pasta faz:

| Pasta | Descrição |
| ----- | --------- |
| `configuration/` | Configuração do Spring Security — define quais endpoints são públicos (`/auth/**`), configura CORS para permitir requisições do frontend, e registra o filtro JWT na cadeia de segurança. |
| `controller/` | **Endpoints REST** da API. Cada controller expõe operações CRUD (`GET`, `POST`, `PUT`, `DELETE`) para seu recurso. O `AuthController` lida com login e registro de novos colaboradores. |
| `dto/` | **Data Transfer Objects** — separa os dados que entram e saem da API das entidades do banco. Subpastas: `request/` (dados de entrada), `response/` (dados de saída), `loginRegister/` (login/registro), `error/` (respostas de erro). |
| `exception/` | Exceções customizadas da aplicação (`BadRequest`, `Conflict`, `NotFound`, `Unauthorized`, `Validation`) para tratamento semântico de erros HTTP. |
| `handler/` | `GlobalExceptionHandler` — captura exceções lançadas nos controllers/services e retorna respostas HTTP padronizadas com códigos de status apropriados. |
| `model/` | **Entidades JPA** mapeadas para tabelas MySQL. `Collaborator` implementa `UserDetails` do Spring Security para autenticação. Contém enums (`CollaboratorType`, `DeviceCondition`) para campos tipados. |
| `repository/` | Interfaces que estendem `JpaRepository` do Spring Data, fornecendo operações de banco (CRUD + queries customizadas) sem necessidade de implementação manual. |
| `security/` | Infraestrutura de autenticação JWT — `JwtService` gera/valida tokens, `JwtAuthFilter` intercepta requisições para verificar autenticação, `CustomUserDetailsService` carrega o usuário do banco. |
| `service/` | **Camada de negócio** — contém validações, regras de negócio e lógica de transformação entre DTOs e entidades. Cada service faz a ponte entre o controller e o repository. |

---

## 🗄️ Modelo de Dados

```
┌──────────────────┐       ┌──────────────────┐       ┌──────────────────┐
│   Organization   │       │   Collaborator   │       │     Device       │
├──────────────────┤       ├──────────────────┤       ├──────────────────┤
│ id               │◄──┐   │ id               │       │ id               │
│ corporateName    │   ├───│ organization_id  │       │ model            │
│ registrationCode │   │   │ fullName         │       │ assetTag         │
│ createdAt        │   │   │ email            │       │ condition        │
└──────────────────┘   │   │ password         │       │ organization_id  │──┐
                       │   │ accessLevel      │       │ createdAt        │  │
                       │   │ createdAt        │       └──────────────────┘  │
                       │   └──────────────────┘                            │
                       └───────────────────────────────────────────────────┘
```

- **Organization** → entidade central, possui colaboradores e dispositivos.
- **Collaborator** → usuário do sistema, pertence a uma organização. Implementa `UserDetails` para autenticação Spring Security. Possui `accessLevel` (enum `CollaboratorType`).
- **Device** → dispositivo vinculado a uma organização. Possui `condition` (enum `DeviceCondition`).

---

## 🔐 Autenticação

O sistema utiliza **JWT (JSON Web Token)** para autenticação:

1. O usuário faz login via `POST /auth/login` com email e senha.
2. O backend valida as credenciais e retorna um token JWT.
3. O frontend armazena o token e o anexa em todas as requisições via **interceptor HTTP**.
4. Rotas protegidas no frontend utilizam um **auth guard** que verifica a existência de um token válido.
5. O backend valida o token em cada requisição através do **JwtAuthFilter**.

---

## 📝 Endpoints da API

| Método   | Rota                         | Descrição                        |
| -------- | ---------------------------- | -------------------------------- |
| `POST`   | `/auth/login`                | Autenticar colaborador           |
| `POST`   | `/auth/register`             | Registrar novo colaborador       |
| `GET`    | `/collaborators`             | Listar colaboradores             |
| `POST`   | `/collaborators`             | Criar colaborador                |
| `PUT`    | `/collaborators/{id}`        | Atualizar colaborador            |
| `DELETE` | `/collaborators/{id}`        | Remover colaborador              |
| `GET`    | `/devices`                   | Listar dispositivos              |
| `POST`   | `/devices`                   | Criar dispositivo                |
| `PUT`    | `/devices/{id}`              | Atualizar dispositivo            |
| `DELETE` | `/devices/{id}`              | Remover dispositivo              |
| `GET`    | `/organizations`             | Listar organizações              |
| `POST`   | `/organizations`             | Criar organização                |
| `PUT`    | `/organizations/{id}`        | Atualizar organização            |
| `DELETE` | `/organizations/{id}`        | Remover organização              |

---