#!/bin/bash
#set -x
project=$(gcloud config list project --format 'value(core.project)')
script=`readlink -f $0`
path=`dirname ${script}`
for cat in `ls ${path}/secret`;do
  if [[ $1 == "--delete" ]];then
    kubectl delete secret ${cat}
  else
    kubectl create secret generic ${cat} --from-file=${path}/secret/${cat}
  fi
done

kubectl get secret
