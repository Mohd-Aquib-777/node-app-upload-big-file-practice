FROM node:24-alpine
RUN npm install -g nodemon


RUN apk update && apk upgrade

WORKDIR /myApp
COPY package.json .
COPY . .
RUN npm install
EXPOSE 3000
CMD ["npx", "nodemon", "./nodeApp/app.js"]
