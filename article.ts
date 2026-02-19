let lit: boolean;
let accent: string;
function set_lightness(to: boolean){
    if(to){
        localStorage.setItem("lit","1");
    }else{
        localStorage.removeItem("lit");
    }
    lit = to;
}
function style_lightness(){
    if(lit){
        document.documentElement.classList.add("invert");
    }else{
        document.documentElement.classList.remove("invert");
    }
}
lit = (localStorage.getItem("lit") === "1");
style_lightness();

function set_accent(to: string){
    accent = to;
    localStorage.setItem("accent-color",to);
}
function style_accent(){
    document.documentElement.style.setProperty("--accent-color",accent);
}
accent = (localStorage.getItem("accent-color") ?? "");
style_accent();

document.getElementById("light")!.addEventListener("click",() => {
    set_lightness(!lit);
    style_lightness();
});
for(const el of document.getElementsByTagName("img")){
    el.addEventListener("click",() => {
        window.open(el.src);
    });
}
const accbox = document.getElementById("accent") as HTMLInputElement | null;
if(accbox !== null){
    accbox.value = accent;
    accbox.addEventListener("input",() => {
        if(accbox.value === "" || CSS.supports("color",accbox.value)){
            set_accent(accbox.value);
            style_accent();
        }
    });
}
