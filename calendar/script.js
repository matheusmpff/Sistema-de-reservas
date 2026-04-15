$(function () {
    // Cria um input escondido e anexa dentro da div
    $('#calendar-inline').append('<input type="text" id="drp-hidden" style="display:none">');

    $('#drp-hidden').daterangepicker({
        parentEl: '#calendar-inline',  // ← renderiza dentro da sua div
        inline: true,
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
        minDate: moment(),
        showDropdowns: true,
        linkedCalendars: false
    });

    // Captura a seleção
    $('#drp-hidden').on('apply.daterangepicker', function(ev, picker) {
        const start = picker.startDate.format('DD/MM/YYYY');
        const end   = picker.endDate.format('DD/MM/YYYY');
        const noites = picker.endDate.diff(picker.startDate, 'days');
        console.log('Check-in:', start);
        console.log('Check-out:', end, '— Noites:', noites);
    });
});