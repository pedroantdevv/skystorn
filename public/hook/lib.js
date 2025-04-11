export class SSReq {
    async req (r, cll) {
        try {
            let t = new URL(r)
            fetch (r).then (r => r.json())
            .then (d => {if (cll) cll(d)})
        } catch (e) {
            if (cll) cll({s: false, err: e})
        }
    }
}
export class SSTmp {
    get (s) {
        const e = document.createElement('div')
        e.innerHTML = s
        return {element: e.firstElementChild, string: e.outerHTML}
    }
    home () {
        return this.get(`
        <div id="wrap" class="wrapper">
            <nav class="navbar fx">
                <a href="#" class="logo fx">Skystorn</a>
                <button type="button" id="new" hidden><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z"/></svg></button>
                <div id="srh" class="formsch">
                    <input type="text" id="sch" placeholder="Search">
                </div>
                <div class="btns">
                    <button type="button" id="rld">Reload</button>
                    <button type="button" id="upl">Upload</button>
                </div>
            </nav>
            <section class="all">
                <div class="bar fls">
                    <div class="btns fl">
                        <button type="button" id="srNm" slot="name">Name</button>
                        <button type="button" id="srTp" slot="type">Type</button>
                        <button type="button" id="srSz" slot="size">Size</button>
                        <button type="button" id="srDt" slot="date" hidden>Date</button>
                    </div>
                </div>
                <div id="fls" class="fls"></div>
            </section>
        </div>
        `)
    }
    nofile () {
        return this.get(`
            <div class="no">No file</div>
        `)
    }
    file () {
        return this.get(`
            <button type="button" class="fl">
                <p class="nm"></p>
                <p class="tp"></p>
                <p class="sz"></p>
                <p class="dt" hidden></p>
            </button>
        `)
    }
    upload () {
        return this.get(`
            <div id="upf" class="fx show">
                <form class="frm" enctype="multipart/form-data">
                    <p class="title">Upload File</p>
                    <div class="thefl">
                        <p class="nm"></p>
                        <p class="sz">No File</p>
                        <div id="flprc" class="pro" style="--var: 0;"></div>
                        <div class="cse">Error</div>
                    </div>
                    <input type="file" id="ifl">
                    <button type="button" id="sfl">Select File</button>
                    <div class="fx">
                        <button type="button" id="upc">Cancel</button>
                        <button type="button" id="upg" disabled>Upload</button>
                    </div>
                </form>
            </div>
        `)
    }
    view () {
        return this.get(`
            <div id="vfl">
                <div class="content fx">
                    <div class="info">
                        <div class="lb nm"></div>
                        <div class="lb sz"></div>
                        <div class="lb dt"></div>
                    </div>
                    <div class="btns">
                        <button type="button" id="vfc">Close</button>
                        <button type="button" id="vfd">Download</button>
                    </div>
                </div>
            </div>
        `)
    }
    download () {
        return this.get(`
            <div class="dw"><b></b> Downloading ...</div>
        `)
    }
}
export const $ = (s) => document.querySelector(s)
export const _$ = (s) => document.querySelectorAll(s)
export const bbyte = (n) => {
    let size = '0B', b = n.toString()
    if (b.length > 9) size = Math.floor(n / (1024 * 1024 * 1024)) + 'GB'
    else if (b.length > 6) size = Math.floor(n / (1024 * 1024)) + 'MB'
    else if (b.length > 3) size = Math.floor(n / 1024) + 'KB'
    else size = Math.floor(n) + 'B'
    return size
    Math.floor
}
export const bdate = (n) => {
    const dm = new Date(n)
    const a = {
        h : dm.getHours().toString().padStart(2, '0'),
        m : dm.getMinutes().toString().padStart(2, '0'),
        s : dm.getSeconds().toString().padStart(2, '0'),
        dD : dm.getDate().toString().padStart(2, '0'),
        dM : (dm.getMonth() + 1).toString().padStart(2, '0'),
        dY : dm.getFullYear(),
    }
    let p = a.h >= 12 ? "PM" : "AM";
    let t = `${a.h}:${a.m}:${a.s} ${p}`
    let d = `${a.dM}/${a.dD}/${a.dY}`
    let c = dm.toLocaleString('en-US')
    return { date: d, time: t, datetime: t+', '+d, ds: { ...a}, daily: c}
}
export const bcut = (s, x) => {
    const n = s.split('.').at(-1)
    const c = s.length > x ? s.substring(0, x)+'...'+n : s
    return c
}