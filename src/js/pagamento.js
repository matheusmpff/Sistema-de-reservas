
let lixos = document.querySelectorAll(".bi-trash-fill")

for(let lixo of lixos){
    lixo.addEventListener("click",(e)=>{
        lixo = e.target;
        lixo.parentElement.parentElement.parentElement.remove();
        if(document.querySelectorAll(".bi-trash-fill").length === 0){
            document.querySelector("#reserva-botao").remove()

            let opcoes = document.querySelector("aside")
            let divElement = document.createElement("div")
            divElement.innerHTML = "Carrinho vazio"
            divElement.classList.add("vazio")
            opcoes.appendChild(divElement)
            opcoes.style.minHeight = "200px";  
        }
    })
}
