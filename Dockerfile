FROM node AS build
WORKDIR /usr/app
COPY package.json ./
COPY tsconfig.json ./
COPY src ./src
RUN npm install
RUN npm run build

FROM node
WORKDIR /usr/app
COPY package.json ./
RUN npm install --production
COPY --from=build /usr/app/dist ./dist
COPY .env.example ./
COPY .env ./
RUN npm install pm2 -g
EXPOSE 5000
CMD ["pm2-runtime", "dist/server.js"]

