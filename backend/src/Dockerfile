FROM node:20.14.0-alpine As development

WORKDIR /api

COPY . .

RUN yarn --prod

CMD ["node", "main.js"]