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
  console.log('Error: Specify DD_TOKEN_PATH nenvironment')
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

controller.on('conversationStarted', function(bot, convo) {
  console.log('Meow~~ I am DD ~~', convo.context.user);
})

controller.hears(
  ['hello', 'hi', 'dd', '안녕', '안냥', '디디', ':cookie:'], ['direct_message', 'direct_mention', 'mention'],
  function (bot, message) {
    bot.reply(message, 'Meow. :smile_cat:')
  })
  
controller.hears(
  ['누구','사진','who','photo'], ['direct_message', 'direct_mention', 'mention'],
  function (bot, message) {
    bot.reply(message, 'https://storage.googleapis.com/cream-heros/dd.png')
  })

controller.hears(
  ['eat', 'lunch', 'dinner', '먹을래', '먹자','냠냠이'], ['direct_message', 'direct_mention', 'mention'],
  function (bot, message) {
    bot.reply(message, 'Meow. 안먹어.:pouting_cat:')
  })
  
controller.hears(
  ['eat', 'lunch', 'dinner', '먹을래', '먹자','냠냠이'], ['direct_message', 'direct_mention', 'mention'],
  function (bot, message) {
    bot.reply(message, 'Meow. 안먹어.:pouting_cat:')
  })
  
controller.hears(
  ['tuna', 'egg', 'salmon', 'dinner', 'lunch', 'steak'], ['direct_message', 'direct_mention', 'mention'],
  function (bot, message) {
    bot.reply(message, 'No.:pouting_cat:')
  })
