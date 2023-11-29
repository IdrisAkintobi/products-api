FROM node:20 as build

# install dependencies
WORKDIR /app
ENV NODE_ENV=production
COPY package.json package-lock.json ./
RUN npm ci

# build app
COPY tsconfig.json tsconfig.build.json .prettierrc .eslintrc ./
COPY src/ src/
RUN npm run build
RUN rm -rf src

# copy dist and start app
FROM node:20 as app

# create user
RUN addgroup --system server
RUN adduser --system --ingroup server nodejs

WORKDIR /app
COPY --chown=nodejs:server --from=build app/ .

USER nodejs
EXPOSE 3003

CMD [ "node", "dist/main.js" ]