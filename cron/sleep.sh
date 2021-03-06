set -x
gcloud container clusters get-credentials cream-cluster --zone us-central1-a --project cream-heros

for cat in dd tt;do
  echo "${cat} zzz..."
  kubectl delete -f ${CREAM_HEROS_HOME}/${cat}/deploy.yaml
done
