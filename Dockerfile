FROM node:alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm i
RUN npm i dotenv
RUN apk update && apk add bash
COPY ./ ./
RUN npm i
EXPOSE 8080
CMD ["npm", "run", "start"]