FROM node:lts-alpine

ENV NODE_ENV=production

WORKDIR /usr/src/app

COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]

RUN npm ci --only=production --silent && mv node_modules ../

COPY . .

RUN chown -R node /usr/src/app

ENV DISCORDTOKEN=OTg4ODk2NjA5MDQxNTIyNzc4.G4y8GX.tEPrOc6dpWfWjwh9Kc_7dFY2-QQdZT1G5hTw60
ENV TELEGRAMTOKEN=5591261648:AAF9D3BvC1NUHFFDroAR8Oyi-bsKhuYDE20
ENV TWITTERTOKEN=AAAAAAAAAAAAAAAAAAAAAD9qigEAAAAAlYvUhvdytRf%2Fp7k0gtAbyTQD4Sg%3DE2TIKO5grfUL2HihFczWnX0AFuez0BCRlfkzsgBMF7djSuKCst

ENV GUILDID=938519768493871104
ENV CLIENTID=988896609041522778

ENV DEFAULTCHANNELID=1061680004192280577
ENV NEWSCHANNELID=1061679965680181369
ENV STREAMCHANNELID=1061680174736875572
ENV YOUTUBECHANNELID=1061680068461613056

USER node

CMD ["dumb-init", "node", "./prod/index.js"]