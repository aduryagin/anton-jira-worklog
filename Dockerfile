FROM node:latest
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . /app
RUN npm run build
CMD ["npm", "start"]