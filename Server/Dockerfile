FROM node:22

WORKDIR /app

COPY package.json ./

RUN npm install

COPY . . 

EXPOSE 17465

CMD [ "node", "server.js" ]