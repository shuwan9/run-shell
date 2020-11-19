const Express = require('express')
const BodyParser = require('body-parser')
const Cors = require('cors')
const Multer = require('multer')
const Path = require('path')
const ChildProcess = require('child_process')
const {PORT} = require('../config')

const app = Express()
const upload = Multer({
  storage: Multer.diskStorage({
    destination(req, file, cb) {
      cb(null, Path.resolve(__dirname, '../upload'))
    },
    filename(req, file, cb) {
      console.log(file)
      cb(null, file.originalname)
    }
  }),
  preservePath: true
})
app.use(Express.static(Path.resolve(__dirname, '../public')))
app.use(Cors())
app.use(BodyParser.json())
const router = Express.Router()

router.post('/shell', function (req, res, next) {
  const {shell} = req.body
  ChildProcess.exec(shell, function (err, stdout, stderr) {
    if (err) {
      res.json({data: JSON.stringify(err)})
    } else {
      res.json({data: stdout.trim()})
    }
  })
})
router.post('/upload', upload.single('avatar'), function (req, res, next) {
  res.json({
    success: 1
  })
})

app.use('/api', router)

app.listen(PORT)
