#!/bin/bash
#set -x
project=$(gcloud config list project --format 'value(core.project)')
script=`readlink -f $0`
path=`dirname ${script}`
for cat in `ls ${path}/secret`;do
  #kubectl delete secret ${cat}
  kubectl create secret generic ${cat} --from-file=${path}/secret/${cat}
done

kubectl get secret
