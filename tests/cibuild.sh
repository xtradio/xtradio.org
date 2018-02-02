#!/usr/bin/env bash
set -e # halt script on error

bundle exec jekyll build --source /home/travis/build/xtradio/xtradio.org/jekyll --destination /home/travis/_site
bundle exec htmlproofer /home/travis/_site --disable-external
