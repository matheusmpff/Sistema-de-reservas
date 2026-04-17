// mandar para a etapa anterior ou a proxima
//let next_step = "./pagamento.html";
let prev_step = "./quartos.html";
const prev_button = document.querySelector("article#reserva-etapas #etapas-prev");
// const next_button = document.querySelector("article#reserva-etapas #etapas-next");

// next_button.addEventListener("click", (ev) => {
//     window.location.href = next_step;
// })

prev_button.addEventListener("click", (ev) => {
    window.location.href = prev_step;
})

// const mini_progress_bar = document.querySelector("article#reserva-mini-etapas");
// mini_progress_bar.addEventListener("click", (ev) => {
//     window.location.href = next_step;
// })


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
