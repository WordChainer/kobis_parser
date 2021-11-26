FROM node:alpine
COPY . /app
WORKDIR /app
RUN npm install
ENTRYPOINT [ "node", "index.js" ]
CMD [ "1", "50" ]