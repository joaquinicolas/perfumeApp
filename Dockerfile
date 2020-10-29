FROM ubuntu

ARG DEBIAN_FRONTEND=noninteractive

WORKDIR /app
RUN apt update
RUN apt install -y apt-utils
RUN apt install -y nodejs npm
RUN npm install -g --unsafe-perm electron-packager
RUN apt install -y zip
RUN apt install -y wine-stable
RUN dpkg --add-architecture i386 && apt update && apt install -y wine32
COPY . /app/app
VOLUME /app/out
COPY make-dist.sh /app/make-dist.sh
ENTRYPOINT /app/make-dist.sh
