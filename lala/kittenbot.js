/* *****************************************************************************
Copyright 2016 Google Inc. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License")
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
********************************************************************************
This is a sample Slack bot built with Botkit.
*/

var Botkit = require('botkit')
var fs = require('fs')

var controller = Botkit.slackbot({debug: false})

if (!process.env.LALA_TOKEN_PATH) {
  console.log('Error: Specify LALA_TOKEN_PATH environment')
  process.exit(1)
}

fs.readFile(process.env.LALA_TOKEN_PATH, function (err, data) {
  if (err) {
    console.log('Error: Specify token in LALA_TOKEN_PATH file')
    process.exit(1)
  }
  data = String(data)
  data = data.replace(/\s/g, '')
  controller
    .spawn({token: data})
    .startRTM(function (err) {
      if (err) {
        throw new Error(err)
      }
    })
})

controller.hears(
  ['hello', 'hi', 'lala', '라라', '안녕','안냥'], ['direct_message', 'direct_mention', 'mention'],
  function (bot, message) {
    bot.reply(message, 'meow. 왔냥 :smile_cat:')
  })
  
controller.hears('사진','direct_mention,direct_message', function(bot, message) {

  bot.startConversation(message, function(err, convo) {
    convo.say('https://storage.googleapis.com/cream-heros/lala.png');
    convo.next(); // continue with conversation
    })
  })

controller.hears('docker','direct_mention,direct_message', function(bot, message) {

  bot.startConversation(message, function(err, convo) {
    convo.ask('또 뭘 까먹은건데? :scream_cat:', function(answer, convo) {
      var your_answer = answer.text;
      // do something with this answer!
      // storeTacoType(convo.context.user, taco_type);
      convo.say('$ gcloud docker -- push gcr.io/cream-heros/lala:v1');
      convo.say('$ docker run -d \
         -v $(pwd)/secret/:/secret \
         -e MOMO_TOKEN_PATH=/secret/lala-token \
         gcr.io/cream-heros/lala:v1');
      convo.say('$ docker ps');
      convo.say('$ docker stop ${CONTAINER ID}');
      convo.say(your_answer +' 답변이 됐냥? :smirk_cat:');
      convo.next(); // continue with conversation
    })
  })
})

controller.hears('kubernetes','direct_mention,direct_message', function(bot, message) {

  bot.startConversation(message, function(err, convo) {
    convo.say('Kubenetes는 해적단 LuLu에게~ Sorry~:cat2:');
    convo.next();
  })
})

controller.hears('run','direct_mention,direct_message', function(bot, message) {

  bot.startConversation(message, function(err, convo) {
    convo.say('LALA_TOKEN_PATH=../secret/lala-token node ./kittenbot.js');
    convo.next(); // continue with conversation
    })
  })




