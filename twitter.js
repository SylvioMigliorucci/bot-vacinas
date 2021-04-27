var twit = require(`twit`);

require("dotenv").config();

const Bot = new twit({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
  timeout_ms: 60 * 1000,
});

function BotInit(content) {
  
  Bot.post('statuses/update', { status: content }, function(err, data, response) {
    console.log('Status Posted')
  })
  
}

// setInterval(BotRetweet, 30 * 60 * 1000);
// BotInit()
module.exports = {
  BotInit
}