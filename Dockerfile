FROM node:latest

# Set working directory
RUN mkdir /usr/src/app
WORKDIR /usr/src/app

# Add `/usr/src/app/node_modules/.bin` to $PATH
ENV PATH /usr/src/app/node_modules/.bin:$PATH

# Add environment variables
ARG REACT_APP_METAGENSCOPE_SERVICE_URL
ARG NODE_ENV
ENV NODE_ENV $NODE_ENV
ENV REACT_APP_METAGENSCOPE_SERVICE_URL $REACT_APP_METAGENSCOPE_SERVICE_URL

# Install and cache app dependencies
RUN npm install pushstate-server -g --silent
COPY package.json /usr/src/app/package.json
RUN npm install --silent

# Add app
COPY . /usr/src/app

# Build react app (limit Node's resource hogging)
RUN npm run build

# Start app
CMD ["pushstate-server", "build"]
