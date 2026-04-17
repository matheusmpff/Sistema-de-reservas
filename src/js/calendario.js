import * as bootstrap from "bootstrap";


// mandar para a etapa anterior ou a proxima
let next_step = "./quartos.html";
//let prev_step = "./calendario.html";
//const prev_button = document.querySelector("article#reserva-etapas #etapas-prev");
const next_button = document.querySelector("article#reserva-etapas #etapas-next");

next_button.addEventListener("click", (ev) => {
    window.location.href = next_step;
})

// prev_button.addEventListener("click", (ev) => {
//     window.location.href = prev_step;
// })

const mini_progress_bar = document.querySelector("article#reserva-mini-etapas");
mini_progress_bar.addEventListener("click", (ev) => {
    window.location.href = next_step;
})


$(function () {
    // Referência da div principal onde o calendário será injetado
    const calendarioContainer = $('.calendario');

    // Inicializa o daterangepicker
    calendarioContainer.daterangepicker({
        parentEl: '.calendario',    // Define onde o HTML do calendário será renderizado
        alwaysShowCalendars: true,  // Força a exibição dos dois meses lado a lado
        autoApply: true,            // Aplica a seleção sem precisar do botão "Confirmar"
        inline: true,               // Tenta manter o fluxo inline (ajudado pelo CSS)
        opens: 'center',
        locale: {
            format: 'DD/MM/YYYY',
            separator: ' - ',
            applyLabel: 'Confirmar',
            cancelLabel: 'Cancelar',
            daysOfWeek: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
            monthNames: [
                'Janeiro','Fevereiro','Março','Abril','Maio','Junho',
                'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'
            ],
            firstDay: 1
        },
        minDate: moment(),          // Impede reserva em datas passadas
        showDropdowns: true,
        linkedCalendars: false      // Permite que os calendários mostrem meses diferentes de forma independente
    });

    // --- O PULO DO GATO ---
    // 1. Força o calendário a abrir imediatamente ao carregar a página
    calendarioContainer.data('daterangepicker').show();

    // 2. Remove o evento que fecha o calendário ao clicar fora dele
    $(document).off('click.daterangepicker');

    // Captura a seleção de datas para o seu sistema de reserva
    calendarioContainer.on('apply.daterangepicker', function(ev, picker) {
        const start = picker.startDate.format('DD/MM/YYYY');
        const end   = picker.endDate.format('DD/MM/YYYY');
        const noites = picker.endDate.diff(picker.startDate, 'days');
        
        console.log('Check-in:', start);
        console.log('Check-out:', end);
        console.log('Total de Noites:', noites);
    });
});
