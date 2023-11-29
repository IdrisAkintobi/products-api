FROM node:20 as build

# create user
RUN addgroup --system server
RUN adduser --system --ingroup server nodejs

# install dependencies
WORKDIR /app
ENV NODE_ENV=production
COPY --chown=nodejs:server package.json package-lock.json ./
RUN npm ci

# build app
COPY --chown=nodejs:server tsconfig.json tsconfig.build.json .prettierrc .eslintrc ./
COPY --chown=nodejs:server src/ src/
RUN npm run build
RUN rm -rf src

# copy dist and start app
FROM build
WORKDIR /app
COPY --chown=nodejs:server .env ./
COPY --chown=nodejs:server --from=build app/ .

USER nodejs

CMD [ "node", "dist/main.js" ]