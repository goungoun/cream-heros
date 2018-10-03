#!/bin/bash
#set -x
for cat in `ls ./secret`;do
  #kubectl delete secret ${cat}
  kubectl create secret generic ${cat} --from-file=./secret/${cat}
done

kubectl get secret
