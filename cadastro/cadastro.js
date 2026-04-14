
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


        console.log(desenho.getBoundingClientRect().height);
        footer.style.top = `${altura - desenho.getBoundingClientRect().height}px`;
    })

});

window.addEventListener("resize",()=>{
    let largura = img.getBoundingClientRect().width;
    document.querySelector(".textos").style.width = largura + "px";

    
    let altura = img.getBoundingClientRect().height;
    document.querySelector(".textos").style.width = largura + "px";
    document.querySelector(".textos").style.height = altura + "px";
    document.querySelector(".esquerda").style.height = altura + "px";

    let desenho = document.querySelector("#desenho")
    let footer = document.querySelector("footer");

    console.log(desenho.getBoundingClientRect().height);
    footer.style.top = `${altura - desenho.getBoundingClientRect().height}px`;
})
