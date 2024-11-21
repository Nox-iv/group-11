FROM node:20

RUN npm install pnpm -g

WORKDIR /usr/media-borrowing/src

COPY package.json package-lock.json pnpm-lock.yaml ./

RUN pnpm install

COPY . .

EXPOSE 8080

CMD ["pnpm", "start"]