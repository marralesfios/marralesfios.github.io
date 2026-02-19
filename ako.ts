const LETTERS = "aeiouwtpsjklnm"
const CHARSET = " "+LETTERS
const CODE = "!\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~¡¢£¤¥¦§¨©ª«¬®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿĀāĂăĄąĆćĈĉĊċČčĎďĐđĒēĔĕĖėĘęĚěĜĝĞğĠġĢģĤ"
function randrange(range: number){
    return Math.floor(Math.random()*range);
}
function srandrange(start: number,range: number){
    return start+randrange(range-start);
}
function arr_eq<T>(lhs: T[], rhs: T[]){
    if(lhs.length !== rhs.length) return false;
    for(let i=0;i<lhs.length;++i){
        if(lhs[i] !== rhs[i]) return false;
    }
    return true;
}
function compact(na: number[]): string{
    let ret = "";
    for(let i=0;i<na.length;i+=2){
        ret += CODE[na[i] + 15*(na[i+1]??0)];
    }
    return ret;
}
function discompact(s: string): number[]{
    const ret: number[] = [];
    for(const c of s){
        const n = CODE.indexOf(c);
        ret.push(n%15);
        ret.push(Math.floor(n/15));
    }
    return ret;
}
const errc = document.getElementById("err") as HTMLParagraphElement;
function err(msg?: string){
    errc.textContent = msg ?? "";
}
let scode: string;
const scode_entry = document.getElementById("scode") as HTMLInputElement;
(document.getElementById("copy-scode") as HTMLButtonElement).addEventListener("click",async () => {
    await navigator.clipboard.writeText(scode);
});
const opener_span = document.getElementById("opener") as HTMLSpanElement;

let initials: number[] = [];
function show_initials(){
    opener_span.textContent = initials.map(i => CHARSET[i]).join(" ");
}
show_initials();

const cand_div = document.getElementById("candidates") as HTMLDivElement;
let candidates: number[][] = [];
function render_candidate(cand: number[]): HTMLParagraphElement{
    const el = document.createElement("p");
    el.textContent = cand.map(i => CHARSET[i]).join("").trim();
    return el;
}
function clear_candidates(){
    candidates = [];
    cand_div.replaceChildren();
}
function add_candidate(cand: number[]){
    candidates.push(cand);
    cand_div.append(render_candidate(cand));
}
const akobox = document.getElementById("akobox") as HTMLInputElement;
function akosubmit(){
    err();
    const submission: number[] = [];
    let erase: number = 0;
    let ptr: number = 0;
    for(const word of akobox.value.trim().split(" ")){
        if(!word) continue;
        const light = ["e","li","pi","a","o","la"].includes(word);
        if(word[0] === CHARSET[initials[ptr]]){
            ++ptr;
            if(light) ++erase;
            else erase = 0;
        }else if(!light){
            if(ptr === initials.length){
                return err(`nimi ${word} li ken ala lon, tan ni: sitelen open li pini.`);
            }
            let allowed = false;
            while(erase){
                --erase;
                if(word[0] === CHARSET[initials[ptr-1]]){
                    allowed = true;
                    break;
                }
                --ptr;
            }
            if(!allowed){
                return err(`sitelen open pi nimi ${word} li ike.`);
            }
        }
        for(const ch of word){
            const id = CHARSET.indexOf(ch);
            if(id === -1){
                return err(`sitelen ike "${ch}" li lon ala kulupu pi sitelen ken (${LETTERS})`);
            }
            submission.push(id);
        }
        submission.push(0);
    }
    if(!submission.length) return err("o sitelen.");
    if(ptr < initials.length) return err(`ike la, sitelen li kepeken ala sitelen open ${CHARSET[initials[ptr]]}`);
    if(submission.length&1) submission.pop();
    for(const cand of candidates){
        if(arr_eq(cand,submission)){
            return err("ike la, jan ante li toki sama.");
        }
    }
    add_candidate(submission);
    update_code();
}
akobox.addEventListener("keyup",(e) => {if(e.key === "Enter") akosubmit();});
(document.getElementById("ako") as HTMLButtonElement).addEventListener("click",akosubmit);

function update_code(){
    let code = candidates.concat([initials]).map(compact).join("\x1e");
    scode = code;
    scode_entry.value = scode;
}
update_code();
async function load_code(){
    err();
    try{
        const val = scode_entry.value.split("\x1e").map(discompact);
        initials = val.pop()!;
        if(!initials[initials.length-1]) initials.pop();
        show_initials();
        clear_candidates();
        for(const cand of val){
            add_candidate(cand);
        }
    }catch(e){
        err(`sina pana e sitelen ike! pakala li lon: ${e}.`);
    }
}
scode_entry.addEventListener("keyup",async (e) => {if(e.key === "Enter") await load_code();});
(document.getElementById("paste-scode") as HTMLButtonElement).addEventListener("click",load_code);

(document.getElementById("open") as HTMLButtonElement).addEventListener("click",() => {
    err();
    const num = randrange(4)+2;
    initials = [];
    for(let i=0;i<num;++i){
        initials.push(srandrange(1,CHARSET.length));
    }
    show_initials();
    clear_candidates();
    update_code();
});
