
FROM node:14-alpine

ARG NODE_ENV=production

ENV NODE_ENV = ${NODE_ENV}

WORKDIR /opt/backend

COPY ./package*.json .

RUN npm install

EXPOSE 5000

COPY ./ .

CMD ["npm","run","start" ]
