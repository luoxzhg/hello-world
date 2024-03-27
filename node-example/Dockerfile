FROM node:18-alpine

COPY package.json ./
RUN npm install

COPY wps-convert-demo.js ./

CMD ["node", "wps-convert-demo.js"]
