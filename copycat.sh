#!/bin/bash
cats=$@
project=$(gcloud config list project --format 'value(core.project)')
for cat in ${cats}; do
  rm -rf ${cat}	
  cp -r cat ${cat}
  cat_lower=`echo ${cat} | tr A-Z a-z`
  cat_upper=`echo ${cat} | tr a-z A-Z`
  sed -i -e "s/KITTEN/${cat_upper}/g" ./${cat}/*.*
  sed -i -e "s/kitten/${cat_lower}/g" ./${cat}/*.*
  sed -i -e "s/PROJECT/${project}/g" ./${cat}/deploy.yaml
  docker build -t gcr.io/${project}/${cat}:v1 ./${cat}
  docker images
  docker push gcr.io/${project}/${cat}:v1
done
