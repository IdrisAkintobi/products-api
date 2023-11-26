FROM node:20-alpine as build

# create user
RUN addgroup --system server
RUN adduser --system --ingroup server nodejs
USER nodejs

# install dependencies
WORKDIR /app
COPY --chown=nodejs:server package.json package-lock.json .eslintrc ./
RUN npm ci

# build app
COPY --chown=nodejs:server tsconfig.json tsconfig.build.json .prettierrc .eslintrc .env ./
COPY --chown=nodejs:server src/ src/
RUN npm run build

# copy dist and start app
FROM build
WORKDIR /app
COPY --chown=nodejs:server --from=build app/ ./

USER nodejs
EXPOSE 3000

CMD [ "npm", "start" ]