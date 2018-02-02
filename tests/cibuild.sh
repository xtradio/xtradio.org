#!/usr/bin/env bash
set -e # halt script on error

JEKYLL_ENV=production bundle exec jekyll build --source /home/travis/build/xtradio/xtradio.org/jekyll --destination /home/travis/_site
bundle exec htmlproofer /home/travis/_site --disable-external
