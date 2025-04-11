import { socket, upsee, reload, download } from "./cc.js"
import * as lib from "./lib.js"
class Skystorn {
    constructor () {
        this.rq = new lib.SSReq
        this.mp = new lib.SSTmp
        this.ms = {}
    }
    build () {
        lib.$('body').innerHTML = this.mp.home().string
        lib.$('#sch').addEventListener('input', (e) => {
            const t = e.target.value
            lib._$('#fls .fl').forEach((fl) => {
                if (t == '') fl.hidden = false
                else if (fl.textContent.includes(t)) {
                    fl.hidden = false
                } else fl.hidden = true
            })
        })
        lib.$('#rld').addEventListener('click', () => {
            reload()
        })
        lib.$('#upl').addEventListener('click', () => {
            lib.$('#wrap').append(this.mp.upload().element)
            this.upload()
        })
        let type = null, order = (wh) => {
            const target = lib.$(`#sr${wh}`)
            if (target.classList.contains('on')) {
                type = type == 'true' ? 'false' : 'true'
                if (target.querySelector('b')) {
                    if (type == 'true') {
                        target.querySelector('b').innerHTML = '&#129035;'
                    }
                    else target.querySelector('b').innerHTML = '&#129033;'
                }
            } else {
                if (lib.$('.bar .btns .on b')) lib.$('.bar .btns .on').querySelector('b').remove()
                if (lib.$('.bar .btns .on')) lib.$('.bar .btns .on').classList.remove('on')
                target.append(this.mp.get(`<b>&#129035;</b>`).element)
                target.classList.add('on')
                type = 'true'
            }
            this.ms.fls.sort((a, b) => {
                const i = a[target.slot], f = b[target.slot]
                if (typeof i == 'number' && typeof f == 'number') {
                    return type == 'true' ? i - f : f - i
                } else return type == 'true' ? i.localeCompare(f) : f.localeCompare(i)
            })
            this.rebuild()
        }
        lib.$('#srNm').addEventListener('click', () => order('Nm'))
        lib.$('#srTp').addEventListener('click', () => order('Tp'))
        lib.$('#srSz').addEventListener('click', () => order('Sz'))
        lib.$('#srDt').addEventListener('click', () => order('Dt'))
    }
    rebuild () {
        if (!lib.$('#fls')) return
        lib.$('#fls').innerHTML = ''
        this.ms.fls.forEach((fl, il) => {
            const f = this.mp.file().element
            f.querySelector('.nm').innerHTML = fl.name
            f.querySelector('.tp').innerHTML = fl.type
            f.querySelector('.sz').innerHTML = lib.bbyte(fl.size)
            f.querySelector('.dt').innerHTML = lib.bdate(fl.date).daily
            f.addEventListener('click', () => {
                this.preview(il)
            })
            lib.$('#fls').append(f)
        })
        if (this.ms.fls.length <= 0) {
            lib.$('#fls').innerHTML = this.mp.nofile().string
        }
    }
    preview (i) {
        lib.$('#wrap').append(this.mp.view().element)
        const file = this.ms.fls[i]
        lib.$('#vfl .nm').innerHTML = file.name
        lib.$('#vfl .sz').innerHTML = `<b>${lib.bbyte(file.size)}</b> ${file.type}`
        lib.$('#vfl .dt').innerHTML = lib.bdate(file.date).daily
        lib.$('#vfc').addEventListener('click', (e) => {
            e.preventDefault()
            lib.$('#vfl').remove()
        })
        lib.$('#vfd').addEventListener('click', (e) => {
            e.preventDefault()
            lib.$('#vfd').disabled = true
            lib.$('#vfl').classList.add('dw')
            download(file.name, (res) => {
                if (res.sucess) {
                    const i = this.mp.get(`<a href="${res.download}" download="${file.name}" hidden>Download</a>`).element
                    lib.$('#wrap').append(i)
                    i.click()
                    i.remove()
                    lib.$('#vfd').disabled = false
                    lib.$('#vfl').classList.remove('dw')
                }
            })
        })
    }
    upload () {
        const updr = new SocketIOFileUpload(socket)
        lib.$('body').addEventListener('dragover', (e) => {
            e.preventDefault()
            lib.$('#upf').classList.add('drag')
        })
        lib.$('body').addEventListener('dragleave', (e) => {
            e.preventDefault()
            lib.$('#upf').classList.remove('drag')
        })
        lib.$('body').addEventListener('drop', (e) => {
            e.preventDefault()
            lib.$('#upf').classList.remove('drag')
            if (e.dataTransfer.files) {
                lib.$('#ifl').files[0] = e.dataTransfer.files[0]
                lib.$('#ifl').dispatchEvent(new Event('input'))
            }
        })
        lib.$('#sfl').addEventListener('click', (e) => {
            lib.$('#sfl').disabled = true
            lib.$('#ifl').click()
        })
        lib.$('#ifl').addEventListener('input', (e) => {
            lib.$('#sfl').disabled = false
            if (e.target.files[0]) {
                lib.$('.thefl .nm').innerHTML = lib.bcut(e.target.files[0].name, 40)
                lib.$('.thefl .sz').innerHTML = lib.bbyte(e.target.files[0].size)
                lib.$('#upg').disabled = false
            }
        })
        lib.$('#upc').addEventListener('click', () => {
            lib.$('#ifl').value = ''
            lib.$('#upf').remove()
            this.rebuild()
        })
        lib.$('#upg').addEventListener('click', () => {
            const tf = lib.$('#ifl').files[0]
            lib.$('form.frm').classList.add('run')
            lib.$('#upg').innerHTML = 'Uploading...'
            lib.$('#upg').disabled = true
            updr.submitFiles([tf])
            updr.addEventListener('progress', (e) => {
                if (e.bytesLoaded) {
                    let p = Math.round((e.bytesLoaded / tf.size) * 100)
                    lib.$('.thefl .pro').style = `--var: ${p};`
                    lib.$('.thefl .cse').innerHTML = `${p}%`
                }
            })
            upsee((ds) => {
                if (ds.type == 'running') lib.$('.thefl .pro').style = `--var: ${ds.pro};`
                else if (ds.type == 'error') {
                    lib.$('.thefl .pro').classList.add('wait')
                    lib.$('.thefl .cse').classList.add('wait')
                    lib.$('.thefl .cse').innerHTML = ds.err
                } else if (ds.type == 'finish') {
                    lib.$('#upc').click()
                }
            })
        })
    }
}
export const app = new Skystorn