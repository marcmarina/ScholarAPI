# API for the Scholar app
[![Build Status](https://travis-ci.org/marcmarina/ScholarAPI.svg?branch=develop)](https://travis-ci.org/marcmarina/ScholarAPI)

[![node](https://img.shields.io/badge/Node.js-v.14.X-brightgreen)](https://nodejs.org)
[![node](https://img.shields.io/badge/Express-v.4.17.X-brightgreen)](https://expressjs.com/)
[![mongoose](https://img.shields.io/badge/Mongoose-v.5.9.X-brightgreen)](https://mongoosejs.com/)

## Introduction
This serves as the REST API that powers my final year project, [Scholar](https://github.com/marcmarina/Scholar). The API for that project was originally developed with Laravel, but I have now remade it with Node.

## Live Deployment
The project is deployed with [Heroku](https://www.heroku.com/home) at [ScholarAPI](https://scholarapi.herokuapp.com/). It uses MongoDB as the database engine.

## Local Deployment
To deploy locally install all dependencies with `yarn`, copy `.env.example` to `.env` and set up all the variables. After that, run `dev` and the development server will be started.