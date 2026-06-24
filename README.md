# Sistema de Reservas - Ybitu

## Descrição do Projeto

Este projeto consiste em um sistema de reservas desenvolvido pelos alunos da disciplina de Desenvolvimento web 2026 (SCC219), o qual foi dividido em duas entregas.

### Primeira Entrega

A primeira etapa foi focada no desenvolvimento do **front-end**, o que inclui a criação das páginas, componentes e interfaces de usuário. O objetivo foi desenvolver um sistema moderno e coerente com a proposta da pousada, levando em conta a paleta de cores
da logo para compor uma identidade visual única e marcante para o site.

### Segunda Entrega

A segunda etapa teve como objetivo realizar os **ajustes finais do front-end** e o desenvolvimento completo do **back-end**, o que inclui a implementação das rotas da API, autenticação e integração com o banco de dados. Dessa forma
permite-se o cadastro, login, criação de reservas, remoção de contas, envio de dúvidas e controle de reservas.


## Tecnologias Utilizadas

### Front-end

* React
* TypeScript
* Tailwind

### Back-end

* Node.js
* Express
* Prisma ORM
* TypeScript

### Banco de Dados

* PostgreSQL


## Pastas

O projeto foi dividido em 3 principais aplicações:

### Ybitu Reservas

Responsável pela interface utilizada pelo usuário, contém as páginas de divulgação da pousada, login, cadastro e realização de reservas.

### Ybitu Backend

Responsável pela, autenticação dos usuários, gerenciamento dos usuários, das reservas e acesso e manipulação do banco de dados através do Prisma ORM.

### Ybitu Admin

Responsável pela interface utilizada pela administração da pousada, contém as páginas para controle das reservas e busca de informações necessárias para o bom funcionamento da pousada no dia-a-dia.

---

## Funcionalidades Implementadas

* Criação alteração e remoção de usuários
* Autenticação de usuários
* Gerenciamento de reservas
* Gerenciamento de quartos
* Consulta de informações dos usuários
* Integração entre front-end e back-end

---

## Como Executar o Projeto

### Ybitu Reservas

```bash
npm install
npm run dev
```

### Ybitu Back-end

```bash
npm install
npm run dev
```
### Variáveis de ambiente:

Para executar o back-end corretamente, é necessário um arquivo .env na raiz do projeto contendo as variáveis abaixo:

DATABASE_URL=

JWT_SECRET_KEY=

GMAIL_ACCOUNT=

GMAIL_PASSWORD=

#### JWT_SECRET_KEY

Chave  para gerar tokens JWT que são usados na autenticação dos usuários.
#### GMAIL_ACCOUNT

E-mail utilizado para envio de mensagens automáticas e formulários de contato.

#### GMAIL_PASSWORD

Senha de aplicativo da conta Gmail para autenticação nos serviços do google.

*OBSERVAÇÃO:* recomenda-se utilizar uma Senha de App gerada pelo Google em vez da senha principal da conta.

### Banco de Dados

Configurar as variáveis de ambiente necessárias e executar os comandos do Prisma:

```bash
npx prisma db push
```
e
```bash
npx prisma generate
```

---

## Autores

João Pedro Castelli 		      - NUSP: 15463450

João Pedro Neves		          - NUSP: 14713404

Matheus Muzza Pires Ferreira 	- NUSP: 15479468
