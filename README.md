## Projeto FinApi

- Nessa aplicação foi feita uma API, que simula a operação de um banco real, com todos os critérios e regras de negócio.

### Está em desenvolvimento ............. 🔥🔥🚀🚀
## [Desafio 1 Modulo Chapter 4: Implementar Testes Unitários nas Rotas da Aplicação](https://www.notion.so/Desafio-01-Testes-unit-rios-0321db2af07e4b48a85a1e4e360fcd11)
#### Rota Create User:

- [x] Should be able to create a new User.
- [x] Should be not able to create a new User with the same email.
#### Rota Authenticate User:

- [x] Should able to authenticate an User.
- [x] Should not be able authenticate an unexistent User.
- [x] Should not able authenticate an User with incorrect password.
#### Rota ShowUserProfile:

- [x] Should able to show a User profile.
- [x] Should not able to show an profile User, if user nonexists.
#### Rota CreateStatement

- [x] Should be able to do a Deposit.
- [x] Should be able to do a withdraw.
- [x] Should not be able to do a statement with nonexistent User.
- [x] Should not be able to do a withdraw with insufficient balance
#### Rota GetBalance

- [x] Should be able to get the Blance.
- [x] Should not able to get User balance, if User nonexistent.
#### Rota GetStatementOperation

- [x] Should be able to get a Statement Operation.
- [x] Should not able to get a Statement Operation, if User nonexistent.
- [x] Should not able to get a Statement Operation, if nonexistent Statement.

#### Banco de dados

Se você quiser testar a aplicação usando o Insomnia para ver o funcionamento até mesmo como auxílio para criar os testes unitários, é importante que você confira os dados de autenticação do banco no arquivo `ormconfig.json` e, se necessário, altere.

Além disso você precisa criar uma database com o nome `fin_api` de acordo com o que está no arquivo de configurações do TypeORM.

#### Rotas da aplicação

Para te ajudar a entender melhor o funcionamento da aplicação como um todo, abaixo você verá uma descrição de cada rota e quais parâmetros recebe.

#### POST `/api/v1/users`

A rota recebe `name`, `email` e `password` dentro do corpo da requisição, salva o usuário criado no banco e retorna uma resposta vazia com status `201`.

#### POST `/api/v1/sessions`

A rota recebe `email` e `password` no corpo da requisição e retorna os dados do usuário autenticado junto à um token JWT.

Essa aplicação não possui refresh token, ou seja, o token criado dura apenas 1 dia e deve ser recriado após o período mencionado.

#### GET `/api/v1/profile`

A rota recebe um token JWT pelo header da requisição e retorna as informações do usuário autenticado.

#### GET `/api/v1/statements/balance`

A rota recebe um token JWT pelo header da requisição e retorna uma lista com todas as operações de depósito e saque do usuário autenticado e também o saldo total numa propriedade `balance`.

#### POST `/api/v1/statements/deposit`

A rota recebe um token JWT pelo header e `amount` e `description` no corpo da requisição, registra a operação de depósito do valor e retorna as informações do depósito criado com status `201`.

#### POST `/api/v1/statements/withdraw`

A rota recebe um token JWT pelo header e `amount` e `description` no corpo da requisição, registra a operação de saque do valor (caso o usuário possua saldo válido) e retorna as informações do saque criado com status `201`.

#### GET `/api/v1/statements/:statement_id`

A rota recebe um token JWT pelo header e o id de uma operação registrada (saque ou depósito) na URL da rota e retorna as informações da operação encontrada.
## Para rodar essa aplicação siga os seguintes passos:

- Copie a url do repositório na aba `CODE`.
- Com o git instalado, execute o seguinte comando => `git clone "Aqui vai a url copiada acima`.
- Com o `Nodejs` e o `Yarn` instalados, Na sua IDE preferida, abra o terminal do `git`, e execute o seguinte comando => `yarn`, para baixar as dependências da aplicação.
- Para rodar o projeto execute o seguinte comando => `yarn dev`.
- Para testar o funcional da aplicação será necessário instalar o software `Insomnia` e criar as rotas da aplicação citadas acima.
- Para rodar os testes unitarios das rotas da aplicação execute o seguinte comando => `yarn test`.
