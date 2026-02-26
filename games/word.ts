function array_rep<T>(item: T,num: number): T[]{
    const ret: T[] = [];
    while(num--){
        ret.push(item);
    }
    return ret;
}
for(const input of document.getElementsByClassName("input") as HTMLCollectionOf<HTMLInputElement>){
    const ans = input.getAttribute("data-ans")!;
    const hint = document.createElement("span");
    hint.textContent = `(${ans.replaceAll(/\s/g,"").length})`;
    input.after(hint);
    input.autocomplete = "off";
    input.autocapitalize = "off";
    function update(){
        input.value = input.value.toLowerCase();
        input.style.width = `${Math.max(ans.length,input.value.length)}ch`;
        if(input.value.length < ans.length){
            input.removeAttribute("data-correct");
        }else if(input.value === ans){
            input.setAttribute("data-correct","true");
        }else{
            input.setAttribute("data-correct","false");
        }
    }
    input.addEventListener("input",update);
    input.addEventListener("scroll",() => {
        input.scroll({left: 0, behavior: "instant"});
    });
    update();
}
