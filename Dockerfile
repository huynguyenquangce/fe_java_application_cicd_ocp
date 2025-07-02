

# build stage
FROM node:20.18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# serve stage - OCP compatible
FROM registry.access.redhat.com/ubi8/nginx-122
COPY --from=build /app/dist/ /opt/app-root/src/
# Copy custom nginx config
# COPY ./nginx.conf /opt/app-root/etc/nginx.conf
COPY ./nginx.conf /opt/app-root/etc/nginx.default.d/default.conf
USER 1001
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
