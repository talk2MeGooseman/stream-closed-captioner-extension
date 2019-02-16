FROM node:11-alpine
WORKDIR /app
COPY ["package.json", "package-lock.json*", "yarn.lock", "npm-shrinkwrap.json*", "./"]
RUN npm install
COPY . .
