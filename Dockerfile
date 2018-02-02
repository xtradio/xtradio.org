FROM jekyll/jekyll:latest
LABEL maintainer="XTRadio Ops <contact@xtradio.org>" \
      description="XTRadio.org main website"

ENV JEKYLL_ENV production
ADD ./jekyll /srv/xtradio

WORKDIR /srv/xtradio

RUN chown -R jekyll.jekyll /srv/xtradio

RUN jekyll build --source /srv/xtradio --destination /srv/xtradio/_site
CMD jekyll serve
