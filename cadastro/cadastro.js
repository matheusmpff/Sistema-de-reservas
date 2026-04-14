
img =  document.querySelector(".pousada")   
img.addEventListener('load', () => {

    let largura = img.getBoundingClientRect().width;
    let altura = img.getBoundingClientRect().height;
    document.querySelector(".textos").style.width = largura + "px";
    document.querySelector(".textos").style.height = altura + "px";
    document.querySelector(".esquerda").style.height = altura + "px";

    let desenho = document.querySelector("#desenho")
    
    desenho.addEventListener("load",() => {
        let footer = document.querySelector("footer");
        footer.style.top = `${altura - desenho.getBoundingClientRect().height}px`;
    })

});

window.addEventListener("resize",()=>{
    let largura = img.getBoundingClientRect().width;
    let altura = img.getBoundingClientRect().height;
    document.querySelector(".textos").style.width = largura + "px";
    document.querySelector(".textos").style.height = altura + "px";
    document.querySelector(".esquerda").style.height = altura + "px";
    
    let desenho = document.querySelector("#desenho")
    let footer = document.querySelector("footer");
    if(window.innerWidth > 1200){
        footer.style.top = `${altura - desenho.getBoundingClientRect().height}px`;
    }
    else{
        footer.style.top = `${desenho.getBoundingClientRect().height}px`
    }
})
