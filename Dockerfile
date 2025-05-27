FROM keymetrics/pm2:18-alpine

WORKDIR /app

COPY . .

RUN npm install
RUN npm run build

EXPOSE 3000

CMD ["pm2", "serve", "dist", "3000", "--spa", "--name", "travel-planner-admin", "--no-daemon"]