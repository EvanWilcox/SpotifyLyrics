# pull official base image
FROM node:15.2.1-alpine3.10

# setup client server
WORKDIR /client

# install app dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install --silent
RUN npm install react-scripts -g --silent

# add app
COPY . ./

# expose port
EXPOSE 3000/tcp

# start client server
CMD ["npm", "start"]
