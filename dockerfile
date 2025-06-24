FROM node:23
WORKDIR /app

COPY package*.json /app/
COPY tsconfig*.json /app/
COPY nest-cli.json /app/
COPY eslint.config.mjs /app/
COPY .prettierrc /app/

RUN npm clean-install
COPY ./src /app/src/
COPY ./test /app/test/