#!/bin/bash
set -x
project=$(gcloud config list project --format 'value(core.project)')
script=`readlink -f $0`
path=`dirname ${script}`

if [[ -z $1 ]]
  then
    cats=`basename $(pwd)` 
  else
    cats=$@
fi

for cat in ${cats};do
  docker build -t gcr.io/${project}/${cat}:v1 ${path}/${cat}
  docker images
  docker push gcr.io/${project}/${cat}:v1
done
