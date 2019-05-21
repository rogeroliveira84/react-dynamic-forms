# Stage 1
FROM node:11

WORKDIR /src

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 8080
CMD ["npm", "start"]
