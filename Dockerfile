FROM node:latest
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . /app
CMD ["npm", "run", "build"]
EXPOSE 3000