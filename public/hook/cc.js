import { app } from "./core.js"
export const socket = io()
socket.emit('ready')
socket.on('load', (fs) => {
    app.build()
    app.ms.fls = fs
    app.rebuild()
})
socket.on('update', (fs) => {
    app.ms.fls = fs
    app.rebuild()
})
export const upsee = (cll) => {
    if (cll) {
        socket.on('upstart', (e) => cll({type: 'start', file: e.file}))
        socket.on('upfinish', (e) => cll({type: 'finish', file: e.file}))
        socket.on('uperror', (e) => cll({type: 'error', file: e.file, err: e.file}))
    }
}
export const reload = () => {
    socket.emit('reload')
}
export const download = (filename, cll) => {
    socket.emit('download', filename, (d) => {
        if (cll) cll(d)
    })
}