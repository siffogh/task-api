FROM node:6.3.0

# Create app directory
RUN mkdir -p /apps/task-server
WORKDIR /apps/task-server


# Install app dependencies
COPY package.json /apps/task-server
RUN npm install


# copy source files
COPY . /apps/task-server

EXPOSE 3000


CMD npm start