FROM nginx

RUN apt-get update \
    && apt-get install -y procps net-tools iputils-ping curl \
    && rm -rf /var/lib/apt/lists/*

COPY ./default.conf /etc/nginx/conf.d/default.conf