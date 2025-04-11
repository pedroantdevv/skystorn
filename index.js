const http = require('node:http')
const path = require('node:path')
const fs = require('node:fs')
const mmt = require('mime-types')
const pk = require('./package.json')
const express = require('express')
const { Server } = require('socket.io')
const socketfu = require('socketio-file-upload')
const app = express()
const server = http.createServer(app)
const io = new Server(server)
app.use(socketfu.router)
app.use(express.static(__dirname + '/public'))
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'pages'))
app.get('/', (req, res) => {
    res.render('index', {version: pk.version})
})
const FILES = {}
const dir = path.join(__dirname, 'storage')
if (!fs.existsSync(dir)) fs.mkdirSync(dir)
io.on('connection', (socket) => {
    const ssfu = new socketfu()
    ssfu.dir = dir
    ssfu.listen(socket)
    socket.on('ready', () => {
        rootf((d) => socket.emit('load', d))
    })
    socket.on('reload', () => {
        rootf((d) => socket.emit('update', d))
    })
    socket.on('download', (filename, callback) => {
        const file = path.join(dir, filename)
        if (fs.existsSync(file)) {
            const uniq = Math.random().toString(36).substring(2, 10)
            const url = '/download/' + uniq
            FILES[uniq] = file
            callback({sucess: true, download: url})
        } else callback({sucess: false, err: 'Not found'})
    })
    ssfu.on('start', (e) => {
        socket.emit('upstart', {file: e.file.name})
    })
    ssfu.on('complete', (e) => {
        socket.emit('upfinish', {file: e.file.name, err: e.error})
        rootf((d) => io.emit('update', d))
    })
    ssfu.on('error', (e) => {
        socket.emit('uperror', {file: e.file.name, err: e.error})
    })
})
app.get('/download/:file', (req, res) => {
    const uniq =  req.params.file
    const fp = FILES[uniq]
    if (fp && fs.existsSync(fp)) {
        res.download(fp, (err) => {
            if (!err) delete FILES[uniq]
        })
    } else res.status(404).render('block', {
        url: 'File not found',
        error: 404
    })
})
app.use((req, res) => {
    res.status(404).render('block', {
        url: req.originalUrl,
        error: 404
    })
})
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Algo deu errado!')
})
const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
    console.log(`RUN on port ${PORT}`)
})
const rootf = async (cll) => {
    try {
        const its = await fs.promises.readdir(dir), all = []
        for (const it of its) {
            const fd = path.join(dir, it)
            const st = await fs.promises.stat(fd)
            if (st.isFile()) {
                const t = mmt.lookup(fd) || 'uncled'
                all.push({name: it, type: t, size: st.size, date: st.atimeMs})
            }
        }
        if (cll) cll(all)
    } catch (err) {
        console.error('Error reading directory:', err)
        if (cll) cll([])
    }
}