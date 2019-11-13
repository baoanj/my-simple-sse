const express = require('express')
const app = express()

app.use(express.json())

let sseRes = []
let sseResNext = []

app.get('/', (req, res) => res.sendFile(__dirname + '/home.html'))

app.get('/sse', (req, res) => {
  res.writeHead(200, {
    'Connection': 'keep-alive',
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache'
  })
  sseResNext.push(res)
  res.write('data: ' + JSON.stringify({
    user: 'Admin',
    msg: '欢迎',
    time: Date.now()
  }) + '\n\n')
})

app.post('/send', (req, res) => {
  sseWrite({
    user: req.body.user,
    msg: req.body.msg,
    time: Date.now()
  })
  res.send({
    code: '10001',
    msg: '发送成功'
  })
})

app.post('/alive', (req, res) => {
  sseResNext.push(sseRes[req.body.id])
  res.send({
    code: '10002',
    msg: '还活着'
  })
})

app.listen(3000, () => console.log('Example app listening on port 3000!'))

function sseWrite(msg) {
  sseRes = sseResNext
  sseResNext = []
  console.log('This message will be sent to ' + sseRes.length + ' users!')
  sseRes.forEach((item, index) => {
    msg.id = index
    item.write('data: ' + JSON.stringify(msg) + '\n\n')
  })
}
