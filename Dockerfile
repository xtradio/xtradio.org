FROM node:lts-alpine as build

RUN cd / && \
    mkdir build && \
    cd build

WORKDIR /build
ADD . /build

RUN npm i \
    && npm run build

FROM nginx:alpine

COPY --from=build /build/dist /usr/share/nginx/html