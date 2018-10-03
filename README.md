
ogle Codelab](https://github.com/googlecodelabs/cloud-slack-bot.git)을 응용한 것으로 [QwikLab - Build a Slack Bot with Node.js on Kubernetes](https://qwiklabs.com/focuses/635?parent=catalog)의 설명을 주로 참고하였습니다.

원본 예제 코드에서는 고양이 1마리만 살고 있지만 고양이가 외로울 수 있기 때문에 유명한 유튜브 채널인 [크림 히어로즈](https://www.youtube.com/channel/UCmLiSrat4HW2k07ahKEJo4w)에서 처럼 행복한 일곱 냥이를 키워보도록 하였습니다.

## 기본 기능
- hi 라고 채팅창에 쓰면 모든 고양이가 meow라고 인사해줍니다.
- dd 라고 채팅창에 쓰면 고양이 디디가 자기 이름인 것을 알아듣고 meow라고 인사해줍니다.
- tt 라고 채팅창에 쓰면 티티가 달려와서 meow라고 인사해줍니다.
- 고양이들은 아침 8시에 일어나서 12시에 잡니다.
- 디디는 항상 모닝콜을 해 줍니다.
![./https://storage.googleapis.com/cream-heros/dd-morningcall.png](https://storage.googleapis.com/cream-heros/dd-morningcall.png)

## 고민 꺼리
- 티티,디디,코코,모모,츄츄,라라를 어떻게 컨테이너에 태울 것인가?
- pod는 어떻게 구성해야하나?
- 냥이 시간 맞춰 재우기/깨우기/밥주기 (startup script)

## 일곱 냥이들
크림 히어로즈 집사가 모시고 있는 고양이는 총 7마리 입니다. 이름은 [나무 위키-크림 히어로즈](https://namu.wiki/w/크림히어로즈)를 그대로 사용하겠습니다.

디디 (DD/ディディ) @dd
티티 (TT/ティティ) @tt
코코 (CoCo/ココ) @coco
모모 (MoMo/モモ) @momo
츄츄 (ChuChu/チュチュ) @chuchu
루루 (LuLu/ルル) @lulu
라라 (LaLa/ララ) @lala

귀여운 냥이들과 대화하기 위해서는 내 슬랙 채널을 하나 만들어서 모셔와야 합니다. 아래 이름을 사용하여 봇 일곱개를 만들어 설치하고 토큰 일곱개를 미리 잘 챙겨두고 필요할 때 환경변수 파일에 넘겨서 사용할 것입니다. 토큰을 별도의 파일에 넣어서 사용하되 .gitignore에 .token을 등록해서 토큰이 유출되지 않도록 해 주세요.

## 구글 클라우드 프로젝트
여기서 사용한 예제는 cream-heros 프로젝트를 새로 만들어서 실행하였습니다.
~~~bash
$ export PROJECT_ID=$(gcloud config list --format 'value(core.project)')
$ echo $PROJECT_ID
cream-heros
~~~

## 버켓에 고양이 사진 올리기
Storage > bucket을 생성하여 고양이 사진을 올려줍니다. 올린 사진을 외부에 오픈하기 위해서는 권한 수정에서 allUsers 그룹을 만들어서 읽기 권한을 줍니다.
~~~
Entity: Group
Name: allUsers
Access: Reader
~~~
이 작업을 해 주어야 이렇게 외부에서 접근 가능한 짧은 URL이 제공됩니다.
https://storage.googleapis.com/cream-heros/container_capsule.png

구글 클라우드에 처음 사진을 올리시는 분은 [Extract, Analyze, and Translate Text from Images with the Cloud ML APIs
](https://qwiklabs.com/focuses/1836?parent=catalog)에 Upload an image to a cloud storage bucket을 참고하시면 됩니다.

## 설치
이 작업을 가장 간단하게 할 수 있는 공간은 구글 클라우드 셸입니다.  [./dd/dd.js](./dd/dd.js) 를 코딩해주고 dd-token 파일에 슬랙에 봇 설치하면서 받은 토큰을 기록합니다. 원본 sample이 node.js를 사용하고 있으므로 패키지 매니저인 npm을 사용하여 setup해줍니다.
~~~
$ npm init
$ npm install --save botkit
$ echo "[슬랙토큰]" > dd-token
$ DD_TOKEN=./dd-token node dd.js # 테스트용
~~~

## 도커 빌드
도커 이미지를 만들어서 gcr.io 구글 클라우드의 레지스트리로 push 해 줍니다. docker build 커맨드를 사용하여 디디의 도커 이미지를 만들어줍니다.
~~~bash
$ docker build -t gcr.io/cream-heros/dd:v1 .
$ docker images
$ gcloud docker -- push gcr.io/cream-heros/dd:v1
$ docker rmi ${IMAGE_ID} # 잘못 만들어서 이미지 삭제가 필요할 때
~~~
도커 이미지를 push 해 준 다음에는 Container Registry 메뉴에서 확인할 수 있습니다.

## 도커 실행
도커 이미지에는 토큰 파일이 들어있지 않기 때문에 현재 디렉토리에 있는 토큰 파일을 도커와 volume과 연결시켜주어야 합니다.
현재 디렉토리의 dd.token를 도커가 읽어갈 수 있도록 volume을 매핑해주고 도커 내 환경변수 DD_TOKEN에 토큰 파일을 설정하여줍니다.
~~~bash
$ docker run -d \
   -v $(pwd)/:/config \
   -e DD_TOKEN=/config/dd-token \
   gcr.io/cream-heros/dd:v1
$ docker ps
$ docker stop
~~~

## TOKEN
Kubernetes > 구성 메뉴로 들어가면 비밀번호, 키, 토큰과 같은 민감한 정보를 저장할 수 있는 공간이 있습니다. 슬랙 토큰은 소스코드에 기록하게되면 유출의 염려가 있기 때문에 별도의 파일에 기록한 다음 쿠버네티스 클러스터에 적용해줍니다. 토큰의 이름은 _를 사용할 수 없는 것에 유의해주세요.
~~~bash
$ kubectl create secret generic dd-token --from-file=./dd-token
$ kubectl get secret
NAME                  TYPE                                  DATA      AGE
dd-token              Opaque                                1         2m
default-token-qtqm8   kubernetes.io/service-account-token   3         27m
~~~

나머지 여섯 냥이의 토큰도 빈 파일을 미리 만들어놓고 코드편집기(베타)를 활용해서 넣어줍니다.
~~~bash
$ touch tt-token momo-token lulu-token lala-token chuchu-token coco-token
~~~

파일을 secert에 담아주세요.
~~~ bash
$ kubectl create secret generic tt-token --from-file=./tt-token
$ kubectl create secret generic momo-token --from-file=./momo-token
$ kubectl create secret generic lulu-token --from-file=./lulu-token
$ kubectl create secret generic lala-token --from-file=./lala-token
$ kubectl create secret generic chuchu-token --from-file=./chuchu-token
$ kubectl create secret generic coco-token --from-file=./coco-token
~~~

~~~bash
$ kubectl get secret
NAME                  TYPE                                  DATA      AGE
chuchu-token          Opaque                                1         15s
coco-token            Opaque                                1         9s
dd-token              Opaque                                1         30m
default-token-bz9c5   kubernetes.io/service-account-token   3         38m
lala-token            Opaque                                1         20s
lulu-token            Opaque                                1         25s
momo-token            Opaque                                1         32s
tt-token              Opaque                                1         45s
~~~

## 쿠버네티스
Kubernetes Engine > Kubernetes clusters > Create cluster로 만들거나 gcloud container clusters 커맨드로 디디를 위한 클러스터를 만들어줍니다. 노드는 나중에 늘려줄 수 있기 때문에 일곱냥이를 다 태워줄수 있을지 없을지는 고민하지 마세요.
~~~bash
$ gcloud container clusters create dd-cluster \
      --num-nodes=2 \
      --zone=us-central1-f \
      --machine-type n1-standard-1
$ gcloud compute instances list
~~~

이렇게 생성한 클러스터는 [Kubernetes doc](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/)을 참고하여 kebectl 명령어로 확인해봅니다.
~~~bash
$ kubectl get services
$ kubectl get deployments
$ kubectl get rs
$ kubectl get pods
$ kubectl describe deployments
$ kubectl logs ${POD_NAME} ${CONTAINER_NAME}
~~~

~~~bash
$ kubectl create -f ./dd-deployment.yaml
$ kubectl delete -f ./dd-deployment.yaml //잘못 만들었을때는 삭제
~~~

## POD
쿠버네티스의 POD는 어드민과 네트워킹을 하기 위해 묶어놓은 그룹입니다. 하나 또는 여러개의 컨테이너를 포함할 수 있고 kubectl run 커맨드로 pod를 만들 수 있습니다.
- 하나의 컨테이너로 POD 만들기 - 털 뚠뚠이 디디가 컨테이너에? 심쿵!!
![https://storage.googleapis.com/cream-heros/dd_one_container.png](https://storage.googleapis.com/cream-heros/dd_one_container.png)
~~~bash
$ kubectl create -f dd-deployment.yaml --record
~~~
- 여러개 컨테이너로 POD 만들기 - 일곱냥이 모두 컨테이너에 들어가는 것을 좋아합니다. ♡♡
![https://storage.googleapis.com/cream-heros/container_capsule.png](https://storage.googleapis.com/cream-heros/container_capsule.png)
~~~bash
$ gcloud docker -- push gcr.io/cream-heros/tt:v1
$ kubectl create -f tt-deployment.yaml --record
~~~

지금까지는 dd 클러스터에 배포하였으나 새로운 cream-cluster에 배포해봅니다.
새로운 클러스터를 만들게 되면 secret을 다시 셋업해주어야 합니다.
~~~bash
$ gcloud container clusters get-credentials cream-cluster --zone us-central1-a --project cream-heros
$ kubectl get secret

$ kubectl create secret generic dd-token --from-file=./sescret/dd-token
kubectl create secret generic tt-token --from-file=./sescret/tt-token
kubectl create secret generic momo-token --from-file=./sescret/momo-token
kubectl create secret generic lulu-token --from-file=./sescret/lulu-token
kubectl create secret generic lala-token --from-file=./sescret/lala-token
kubectl create secret generic chuchu-token --from-file=./sescret/chuchu-token
kubectl create secret generic coco-token --from-file=./sescret/coco-token

$ kubectl create -f ./tt/deployment.yaml --record
kubectl create -f ./dd/deployment.yaml --record
~~~

## 일곱냥이 재우고 깨우기

sleep.sh
~~~bash
for cat in dd tt;do
  echo "${cat} zzz.."
  kubectl delete -f ${CREAM_HEROS_HOME}/${cat}/deployment.yaml
done
~~~

~~~bash
0 0 * * * /home/gounna/git/cream-heros/cron/sleep.sh
0 7 * * * /home/gounna/git/cream-heros/crnn/wakeup.sh
~~~

