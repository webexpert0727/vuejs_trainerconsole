var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
   API: '"http://localhost:8080/api"'
  //API: '"https://app.liverunapp.com/api"'
})
