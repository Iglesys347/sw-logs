# ===== build environment =======================
FROM node:alpine as builder
WORKDIR /app

COPY app/package*.json /app/
RUN npm install

COPY app/ /app
RUN npm run build-docker

# ===== production environment ==================
FROM nginx:1.23.3-alpine
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx-conf/swlogs-nginx.conf /etc/nginx/conf.d/
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]