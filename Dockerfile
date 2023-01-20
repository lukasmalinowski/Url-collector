FROM node:18-alpine

# Install OS dependencies and node-prune script
RUN apk update &&\
    apk add tini curl &&\
    rm -rf /var/lib/apt/lists/* &&\
    curl -sf https://gobinaries.com/tj/node-prune | sh

RUN npm install -g typescript

# Create app directory and set user and group to node
RUN mkdir -p /app &&\
    chown -R node:node /app

WORKDIR /app
USER node

COPY --chown=node:node . .

# Install app dependencies, clean up and build
RUN npm i --save-dev @types/node\
    npm run build &&\
    npm cache clean --force &&\
    node-prune &&\
    rm -rf node_modules/typescript

ENV NODE_ENV=production
EXPOSE 8000
ENTRYPOINT ["tini", "--"]
CMD ["npm", "run", "start:prod"]
