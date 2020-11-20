# pull official base image
FROM node:15.2.1-alpine3.10

# setup auth-server
WORKDIR /auth-server

# install app dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install --silent

# add app
COPY . ./

# expose 8888
EXPOSE 8888/tcp

# start auth-server
CMD ["node", "app.js"]
