#!/bin/bash
set -x

project=$(gcloud config list project --format 'value(core.project)')
cluster_name=${project}
gcloud container clusters get-credentials ${cluster_name} --zone us-central1-a --project ${project}

script=`readlink -f $0`
path=`dirname ${script}`

if [[ -z $1 ]]
  then
    cats=`basename $(pwd)`
  else
    cats=$@
fi

for cat in ${cats};do
  running=`kubectl get pods --selector=app=${cat}|grep -v "NAME                    READY     STATUS    RESTARTS   AGE"|wc -l`
  if [[ ${running} -gt 0 ]];then
    kubectl delete -f "${path}/${cat}/deploy.yaml"
  fi
  sleep 5
  kubectl create -f "${path}/${cat}/deploy.yaml"
  kubectl get deploy
  kubectl get pods
done
