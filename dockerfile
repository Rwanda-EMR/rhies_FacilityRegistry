FROM node:latest
WORKDIR /usr/src/app/savics/omrsToDHIS2Mediator

COPY ./server/ .

RUN npm install

EXPOSE :4004

CMD ["node", "./app/index.js" ]
