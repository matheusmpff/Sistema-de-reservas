import BarraProgresso from "../components/BarraProgresso";
import Footer from "../components/Footer";

import "../styles/Pagamento.scss"

export default function Pagamento() {
  return (
  <>  
    <BarraProgresso step={2} />

    <main>
      <section>
        <h2>Como concluir a reserva</h2>
        <p>
          Ao lado, é possível ver a quantidade e as opções de quarto adicionados ao carrinho.Foram realizadas
          2 reservas, totalizando 6 quartos.
        </p>
        <p>
          Caso deseje editar suas escolhas, clique no ícone do
          lápis para voltar à primeira etapa. Caso deseje excluir
          alguma reserve, clique no ícone da lixeira.
        </p>
        <p>
          Para concluir a sua reserva, clique no botão "Concluir
          reserva", que irá direcioná-lo para um de nossos
          atendentes no WhatsApp.
        </p>
        <p>Caso queira adicionar mais quartos clique no botão abaixo</p>

        <a href="calendario.html" id="maisquartos">Adicionar mais quartos</a>
      </section>

      <aside>
        <div id="reserva-imagem">
          <img src="src/assets/pagamento/carrinho.png" alt="Desenho de um carrinho de supermercado" />
        </div>
        <div>
          <h2>MEU CARRINHO</h2>
        </div>
        <div id="reserva-opcoes">
          <div id="reserva-1" className="opcao-reserva">
            <div className="reserva-titulo">
              <h3>Grupo 1</h3>
              <div className="icones">
                <i className="bi bi-pencil-fill"></i>
                <i className="bi bi-trash-fill"></i>
              </div>
            </div>

            <div className="alinhar">
              <p className="reserva-data">06/04/2027 &#x2192; 08/04/2026</p>
              <ul className="reserva-quarto">
                <li>1 Quarto Casal</li>
                <li>2 Quarto Triplo</li>
              </ul>
            </div>
          </div>

          <div id="reserva-2" className="opcao-reserva">
            <div className="reserva-titulo">
              <h3>Grupo 2</h3>
              <div className="icones">
                <i className="bi bi-pencil-fill"></i>
                <i className="bi bi-trash-fill"></i>
              </div>
            </div>
            <div className="alinhar">
              <p className="reserva-data">06/04/2027 &#x2192; 08/04/2026</p>
              <ul className="reserva-quarto">
                <li>1 Quarto Casal</li>
                <li>2 Quarto Triplo</li>
              </ul>
            </div>
          </div>
        </div>
        <a id="reserva-botao" href="/feedback">CONCLUIR RESERVA</a>
      </aside>
    </main>


    <Footer />
  </ >
  );
}
    // <footer className="wave"/>
