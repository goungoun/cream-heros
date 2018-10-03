#!/bin/bash
set -x
cats=$@
project=$(gcloud config list project --format 'value(core.project)')

for cat in ${cats};do
  cd ./${cat}
  docker build -t gcr.io/${project}/${cat}:v1 .
  docker images
  gcloud docker -- push gcr.io/${project}/${cat}:v1
  cd ..
done
