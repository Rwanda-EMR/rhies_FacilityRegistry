FROM node:latest
WORKDIR /usr/src/app/savics/facilityRegistryMediator

COPY ./server/ .

EXPOSE 4004

CMD ["node", "./app/index.js" ]
