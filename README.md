# xtradio.org
XTRadio.ORG - Main website

[![Build Status](https://travis-ci.org/xtradio/xtradio.org.svg?branch=master)](https://travis-ci.org/xtradio/xtradio.org)

## Explanation

For local development/testing run `docker-compose up -d`, this will start the container on local port 4000. The automatic build runs minify against the css and js files, the local build leaves the files intact without touching them. This is all done through the [Jekyll environment flag](https://jekyllrb.com/docs/configuration/#specifying-a-jekyll-environment-at-build-time).

## Software used to build the website

* [One Page Wonder](https://github.com/BlackrockDigital/startbootstrap-one-page-wonder)
* [Jekyll](https://jekyllrb.com/)
* [Bootstrap 3 Player](https://github.com/iainhouston/bootstrap3_player)
* [Chroma](https://gka.github.io/chroma.js)
* [RGBaster](https://github.com/briangonzalez/rgbaster.js)
* [music-frequency-d3](https://github.com/bignerdranch/music-frequency-d3)

## Build tools

* [minify](https://github.com/tdewolff/minify)
