import "css/feedback.scss"

import Logo from "images/logo.png"
import FooterWave from "images/FooterWave.png"

document.querySelector("#logo").src = Logo;
document.querySelector("#footer-image").src = FooterWave;


let inputImg = document.querySelector("#foto");
let previa = document.querySelector("#previa");

inputImg.addEventListener("change", () => {

  while(previa.firstChild != null){
    previa.removeChild(previa.firstChild)
  } 

  let arquivos = inputImg.files;

  let count = 20
  for (let img of arquivos) {
    if(count == 0){
      break;
    }
    count = count -1;
    let imgElement = document.createElement("img");
    imgElement.src = URL.createObjectURL(img);

    if(window.innerWidth<=700){
        imgElement.style.width = "12px";
        imgElement.style.height = "12px";
    }
    if(window.innerWidth> 700 && window.innerWidth<=1000){
      imgElement.style.width = "16px";
      imgElement.style.height = "16px";
    }
    else{
        imgElement.style.width = "20px";
        imgElement.style.height = "20px";
    }
    

    

    previa.appendChild(imgElement);

  }
    let p = document.createElement("p")
    p.innerText = "Para mudar as imagens a serem enviadas basta selecioná-las novamente pelo botão"
    previa.appendChild(p);
});
