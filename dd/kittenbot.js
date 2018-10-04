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

if (!process.env.DD_TOKEN_PATH) {
  console.log('Error: Specify DD_TOKEN_PATH environment')
  process.exit(1)
}

fs.readFile(process.env.DD_TOKEN_PATH, function (err, data) {
  if (err) {
    console.log('Error: Specify token in DD_TOKEN_PATH file')
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
  ['hello', 'hi', 'dd', '안녕'], ['direct_message', 'direct_mention', 'mention'],
  function (bot, message) { bot.reply(message, 'Meow. :smile_cat:') })

controller.hears(['photo','사진'],'direct_mention,direct_message', function(bot, message) {
  bot.startConversation(message, function(err, convo) {
    convo.say('https://storage.googleapis.com/cream-heros/dd-fat.png');
    convo.next(); // continue with conversation
    })
  })
