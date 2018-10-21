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

if (!process.env.TT_TOKEN_PATH) {
  console.log('Error: Specify TT_TOKEN_PATH environment')
  process.exit(1)
}

fs.readFile(process.env.TT_TOKEN_PATH, function (err, data) {
  if (err) {
    console.log('Error: Specify token in TT_TOKEN_PATH file')
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

controller.on('conversationStarted', function(bot, convo) {
  console.log('Meow~~ I am TT ~~', convo.context.user);
})

controller.hears(
  ['누구','사진','who','photo'], ['direct_message', 'direct_mention', 'mention'],
  function (bot, message) {
    bot.reply(message, 'https://storage.googleapis.com/cream-heros/tt.png')
  })

controller.hears(
  ['hello', 'hi', 'tt', '티티', '안녕', '안냥'], ['direct_message', 'direct_mention', 'mention'],
  function (bot, message) { bot.reply(message, 'T.T Meow. :crying_cat_face:') })


controller.hears(
  ['candy', '사탕','캔디','행복'], ['direct_message', 'direct_mention', 'mention'],
  function (bot, message) { bot.reply(message, 'Meow. :smile_cat:') })
