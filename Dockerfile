FROM node:22 As development
WORKDIR /usr/src/app
COPY --chown=node:node package*.json ./
RUN npm install
COPY --chown=node:node ./entrypoint.sh /usr/src/app/
RUN chmod a+x /usr/src/app/entrypoint.sh
COPY --chown=node:node . ./
EXPOSE 3000
USER node
ENTRYPOINT ["/usr/src/app/entrypoint.sh"]
CMD ["npm", "run", "start:dev"]

FROM node:22 As build
WORKDIR /usr/src/app
COPY --chown=node:node package*.json ./
COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules
COPY --chown=node:node . ./
RUN npm run build
ENV NODE_ENV production
RUN npm ci --only=production && npm cache clean --force

FROM node:22 As production
COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist
COPY --chown=node:node ./entrypoint.sh /usr/src/app/
RUN chmod a+x /usr/src/app/entrypoint.sh
USER node
ENTRYPOINT ["/usr/src/app/entrypoint.sh"]
CMD [ "npm", "run", "start:prod" ]
