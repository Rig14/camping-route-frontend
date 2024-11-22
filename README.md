# Matkarajad

## Purpose

The purpose of the application is to enable users to
create and manage their camping routes. Users can share
routes they have visited and other users can comment on them.
Searching for routes and filtering them is also possible.

## Requirements

- Node.js and npm

## Setup

Install dependencies by running

```bash
npm install
```

## Running the frontend

For local development

```bash
npm run dev
```

For production use:

```bash
npm run build && npx http-server ./dist
```

## Building

Build the project by running

```bash
npm run build
```

Built static files will be available under `dist` folder.

## Docker container

Docker image for frontend is built from the ***Dockerfile*** that is in the project root.

To build the docker image use `docker build -t <insert_your_tag_here> .` command.
In our CI we use: `docker build -t $DOCKER_REGISTRY/$DOCKER_IMAGE:$CI_COMMIT_SHORT_SHA .`

And then the image can be pushed to dockerhub: `docker push <insert_your_tag_here>`.
In our CI we use: `docker push $DOCKER_REGISTRY/$DOCKER_IMAGE:$CI_COMMIT_SHORT_SHA`.

After that the `docker compose pull && docker compose up` can be used to run docker.

> NB! In `compose.yaml` under ***services/frontend/image:*** the image name should be changed to your tag.

## Used Technologies

- NPM 📦
- Node.js 🚀
- Vue.js 🖼️
- Vue Router 🚦
- Axios 📡
- Tailwind CSS 🎨
- Docker 🐳
- Docker compose 🐳
- Typescript 📜
- Vite 🚀