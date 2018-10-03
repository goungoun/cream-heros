#!/bin/bash
#set -x
cats=$@
for cat in ${cats};do
  running=`kubectl get pods --selector=app=${cat}|grep -v "NAME                    READY     STATUS    RESTARTS   AGE"|wc -l`
  if [[ ${running} -gt 0 ]];then
    kubectl delete -f "./${cat}/deploy.yaml"
  fi
  kubectl create -f "./${cat}/deploy.yaml"
done
