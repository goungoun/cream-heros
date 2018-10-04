#!/bin/bash
set -x
cats=$@
project=$(gcloud config list project --format 'value(core.project)')
script=`readlink -f $0`
path=`dirname ${script}`

for cat in ${cats};do
  docker build -t gcr.io/${project}/${cat}:v1 ${path}/${cat}
  docker images
  gcloud docker -- push gcr.io/${project}/${cat}:v1
done
