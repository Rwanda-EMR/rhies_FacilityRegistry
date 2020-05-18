FROM node:latest
WORKDIR /usr/src/app/savics/facilityRegistryMediator

COPY ./server/ .

RUN npm install

EXPOSE 4004

CMD ["node", "./app/index.js" ]
