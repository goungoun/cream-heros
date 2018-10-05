#!/bin/bash
set -x
if [[ -z $1 ]]
  then
    cats="dummy"
  else
    cats=$@
fi

project=$(gcloud config list project --format 'value(core.project)')
script=`readlink -f $0`
path=`dirname ${script}`

for cat in ${cats}; do
  rm -rf ${cat}	
  cp -r cat ${cat}
  cat_lower=`echo ${cat} | tr A-Z a-z`
  cat_upper=`echo ${cat} | tr a-z A-Z`
  sed -i -e "s/KITTEN/${cat_upper}/g" ${path}/${cat}/*.*
  sed -i -e "s/kitten/${cat_lower}/g" ${path}/${cat}/*.*
  sed -i -e "s/PROJECT/${project}/g" ${path}/${cat}/deploy.yaml
  touch ${path}/secret/${cat_lower}-secret
done
