cats=$@
for cat in ${cats};do
  kubectl create -f "./${cat}/deploy.yaml"
done
