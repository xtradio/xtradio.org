FROM jekyll/jekyll:3.8.1 as build

ENV JEKYLL_ENV production
ADD ./jekyll /srv/xtradio

WORKDIR /

RUN wget https://github.com/tdewolff/minify/releases/download/v2.7.3/minify_2.7.3_linux_amd64.tar.gz && tar xvzf minify_2.7.3_linux_amd64.tar.gz minify
RUN ./minify -o /srv/xtradio/js/site.min.js /srv/xtradio/js
RUN ./minify -o /srv/xtradio/css/main.css /srv/xtradio/css
RUN rm -rf /srv/xtradio/js/app.js \
    /srv/xtradio/js/bootrap3_player.js \
    /srv/xtradio/js/rgbaster.min.js \
    /srv/xtradio/js/xt.js \
    /srv/xtradio/js/bootstrap3_player.js \
    /srv/xtradio/css/bootstrap3_player.css \
    /srv/xtradio/css/one-page-wonder.css \
    /srv/xtradio/css/xtradio.css

# RUN chmod +x ./tests/cibuild.sh && ./test/cibuild.sh

RUN chown -R jekyll.jekyll /srv/xtradio

RUN jekyll build --source /srv/xtradio --destination /srv/xtradio/_site
RUN ./minify -o /srv/xtradio/_site/index.html /srv/xtradio/_site/index.html

FROM jekyll/minimal:3.8.1
LABEL maintainer="XTRadio Ops <contact@xtradio.org>" \
      description="XTRadio.org main website"

ENV JEKYLL_ENV production
COPY --from=build /srv/xtradio/ /srv/jekyll/

WORKDIR /srv/jekyll
RUN chown -R jekyll.jekyll /srv/jekyll

CMD jekyll serve
