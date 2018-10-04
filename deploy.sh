#!/bin/bash
#set -x
cats=$@
project=$(gcloud config list project --format 'value(core.project)')
script=`readlink -f $0`
path=`dirname ${script}`
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
