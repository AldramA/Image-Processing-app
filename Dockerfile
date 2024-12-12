FROM node:18-alpine

WORKDIR /usr/src/app

# Install sharp dependencies
RUN apk add --no-cache python3 make g++ vips-dev

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
