FROM node:argon

# Create app directory
RUN mkdir -p /Users/siffedineghezala/docker/apps/interview_task
WORKDIR /Users/siffedineghezala/docker/apps/interview_task


# Install app dependencies
COPY package.json /Users/siffedineghezala/docker/apps/interview_task
RUN npm install


# copy source files
COPY . /Users/siffedineghezala/docker/apps/interview_task

EXPOSE 3000


CMD ["npm", "start"]