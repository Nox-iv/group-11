FROM node:20

RUN npm install pnpm -g

WORKDIR /usr/media-borrowing/src

COPY . .

RUN pnpm install

EXPOSE 8080

CMD ["pnpm", "start"]