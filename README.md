<h1>Dispenser IoT</h1> 

<p align="center">
  <img src="https://img.shields.io/static/v1?label=Next.js&message=Framework&color=blue&style=for-the-badge&logo=Next.js"/>
  <img src="https://img.shields.io/static/v1?label=TypeScript&message=Linguagem&color=yellow&style=for-the-badge&logo=TypeScript"/>
  <img src="https://img.shields.io/static/v1?label=JasonWebToken&message=API&color=red&style=for-the-badge&logo=JWT"/>
  <img src="http://img.shields.io/static/v1?label=License&message=MIT&color=green&style=for-the-badge"/>
   <img src="http://img.shields.io/static/v1?label=STATUS&message=EM%20DESENVOLVIMENTO&color=RED&style=for-the-badge"/>
</p>



### Tópicos

:small_blue_diamond: [Descrição do projeto](#descrição-do-projeto)

:small_blue_diamond: [Funcionalidades](#funcionalidades)

:small_blue_diamond: [Imagens do Layout da Aplicação](#imagens-do-layout-da-aplicação)

:small_blue_diamond: [Pré-requisitos](#pré-requisitos)

:small_blue_diamond: [Como rodar a aplicação](#como-rodar-a-aplicação-arrow_forward)



## Descrição do projeto

<p align="justify">
  Frontend e Backend do projeto para monitoramento de dispositivos inteligentes (Dispensers IoT)
</p>
<p align="justify">
  Aplicação Web do Gestor para auxiliar na gestão dos dispensers 
</p>
<p align="justify">
  Trabalho apresentado como critério para avaliação na INOVATEC 2021 da FAMETRO
</p>


## Funcionalidades

:heavy_check_mark: Manter Usuários (Registrar, Consultar, Modificar e Excluir)

:heavy_check_mark: Manter Dispositivos (Registrar, Consultar, Modificar e Excluir)

:heavy_check_mark: Dashboards (Análise e diagnóstico)

:heavy_check_mark: Autenticação através de JWT

## Link da aplicação em produção
https://iotmonitor.vercel.app


## Imagens do projeto

<img src="https://github.com/EdgardOliveira/DispenserIoT/blob/main/public/imagens/logotipo.svg" alt="logotipo"  height="100" width="100">
<img src="https://github.com/EdgardOliveira/DispenserIoT/blob/main/public/imagens/arquitetura.png" alt="arquitetura"  height="600" width="800">
<img src="https://github.com/EdgardOliveira/DispenserIoT/blob/main/public/imagens/inicial.png" alt="inicial"  height="600" width="800">
<img src="https://github.com/EdgardOliveira/DispenserIoT/blob/main/public/imagens/registro.png" alt="registro"  height="600" width="300">
<img src="https://github.com/EdgardOliveira/DispenserIoT/blob/main/public/imagens/login.png" alt="login"  height="600" width="300">
<img src="https://github.com/EdgardOliveira/DispenserIoT/blob/main/public/imagens/dashboard.png" alt="dashboard"  height="600" width="300">
<img src="https://github.com/EdgardOliveira/DispenserIoT/blob/main/public/imagens/dispositivos.png" alt="dispositivos"  height="600" width="800">
<img src="https://github.com/EdgardOliveira/DispenserIoT/blob/main/public/imagens/editar.png" alt="alterar"  height="600" width="800">

## Pré-requisitos

:warning: [Nodejs](https://nodejs.org/en/)
:warning: [GitHub](http://github.com/)


### Base URL
https://iotmonitor.vercel.app

### Rotas consumidas

| Métodos   | URI                     | Nome             | Ação                                           | Middleware |
|-----------|-------------------------|------------------|------------------------------------------------|------------|
| GET       | /api/dispositivos       | dispositivos     | Listar todos os dispositivos cadastrados       | api        |
| POST      | /api/dispositivos       | dispositivos     | Cadastar um dispositivo                        | api        |
| PUT       | /api/dispositivos       | dispositivos     | Atualizar dados de um dispositivo cadastrado   | api        |
| DELETE    | /api/dispositivos       | dispositivos     | Excluir o registro de um dispositivo cadastrado| api        |


## Tarefas em aberto
:warning: Implementar utilização de cookies na autenticação
:warning: Implementar manutenção de usuários (listar, editar, excluir, etc)



## Product Owner :octocat:
[<img src="https://lh3.googleusercontent.com/a-/AOh14GgqWXCBdcuf8dmMMPkwbnWaCHi0P3aCM1U83rxKYWI=s96-c-rg-br100" width=115><br><sub>Edgard Oliveira</sub>](https://github.com/EdgardOliveira)

## Desenvolvedores/Contribuintes :octocat:
[<img src="https://lh3.googleusercontent.com/a-/AOh14GgqWXCBdcuf8dmMMPkwbnWaCHi0P3aCM1U83rxKYWI=s96-c-rg-br100" width=115><br><sub>Edgard Oliveira</sub>](https://github.com/EdgardOliveira)

## Licença

The [MIT License]() (MIT)

Copyright :copyright: 2021 - Dispenser IoT
