FROM jekyll/jekyll:latest
LABEL maintainer="XTRadio Ops<contact@xtradio.org> \
      version="1" \
      description="XTRadio.org main website

RUN apk update
RUN apk add git

WORKDIR /tmp

RUN git clone https://github.com/xtradio/xtradio.org

WORKDIR /tmp/xtradio.org

CMD jekyll build --destination /srv/jekyll/_site
CMD jekyll serve
