
img =  document.querySelector(".pousada")
const ajustar_texto = () => {

    let largura = img.getBoundingClientRect().width;
    let altura = img.getBoundingClientRect().height;
    document.querySelector(".textos").style.width = largura + "px";
    document.querySelector(".textos").style.height = altura + "px";
    document.querySelector(".esquerda").style.height = altura + "px";

}

if(img.complete){
    ajustar_texto();
}
else{
    img.addEventListener('load', ajustar_texto);
}


let footer = document.querySelector("footer");
let desenho = document.querySelector("#desenho")
const ajustar_footer = () => {
        let altura = img.getBoundingClientRect().height;
        footer.style.top = `${altura - desenho.getBoundingClientRect().height}px`;
    }


if(desenho.complete == true){
    ajustar_footer()
}
else{
    desenho.addEventListener("load", ajustar_footer)
}

const ajustar_com_resize = ()=>{
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
}
window.addEventListener("resize", ajustar_com_resize)
