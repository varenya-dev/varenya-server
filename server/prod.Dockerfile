FROM node:latest

WORKDIR /server

COPY package.json .

RUN npm install

COPY . ./

ENV DATABASE_HOST=localhost
ENV DATABASE_PORT=8080
ENV DATABASE_USER=user
ENV DATABASE_PASSWORD=password
ENV DATABASE_NAME=db
ENV PORT=5000

EXPOSE ${PORT}

RUN npm run build

CMD ["npm", "run", "start:prod"]