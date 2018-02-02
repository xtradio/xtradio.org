FROM jekyll/jekyll:latest
LABEL maintainer="XTRadio Ops <contact@xtradio.org>" \
      description="XTRadio.org main website"

ADD ./jekyll /srv/xtradio

WORKDIR /srv/xtradio

RUN chown -R jekyll.jekyll /srv/xtradio

CMD JEKYLL_ENV=production jekyll build
CMD jekyll serve
