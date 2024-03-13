let edicaoIniciada = false;


// Function para salvar os dados da tabela no localStorage
function salvarDadosTabela() {
    let tabela = document.getElementById('tabela');
    localStorage.setItem('horasTabela', tabela.innerHTML);
};

// Carregar dados da tabela do localStorage, se disponíveis
function carregarDadosTabela() {
    let tabela = document.getElementById('tabela');
    let dadosSalvos = localStorage.getItem('horasTabela');
    if (dadosSalvos) {
        tabela.innerHTML = dadosSalvos;
    };
};

//-----------------------------------------------------------------------


function editar() {
    //Muda a condição da variável
    edicaoIniciada = true;



    let tabela = document.getElementById("tabela");
    for (let i = 1; i < tabela.rows.length; i++) {       //Começa de 1 para evitar a thead
        for (let j = 0; j < tabela.rows[i].cells.length; j++) {
            if (j !== 5) {                                 //Não editar a coluna 5 (resultado)
                tabela.rows[i].cells[j].contentEditable = "true";
            };

        };
    };


    window.alert('IMPORTANTE!!! Edite os dados respeitando os formatos!Após a edição clique no botao Finalizar edição!');
};
//----------------------------------------------------------------------
/*document.getElementById('finalizaEdit').addEventListener('click', function () {
    // Verifica se a edição foi iniciada
    if (!edicaoIniciada) {
        // Se não houver edição iniciada, emita o alerta com som
        mostrarAlert();
    } else {
        // Se houver edição iniciada, finalize a edição
        finalizarEdicao();
    }
});*/




//-----------------------------------------------------------------------



// Function para finalizar a edição e desabilitar a edição dos dados na tabela
function finalizarEdicao() {
    //Se a edicaoIniciada for false, mostra o alerta e não prossegue com a edicao
    //Se a edicaoIniciada for true, prossegue com a edicao

    if (!edicaoIniciada) {
        mostrarAlert();
    };

    edicaoIniciada = false;


    let tabela = document.getElementById("tabela");
    for (let i = 1; i < tabela.rows.length; i++) {        // Começa de 1 para evitar a thead
        for (let j = 0; j < tabela.rows[i].cells.length; j++) {
            tabela.rows[i].cells[j].contentEditable = "false";
        };
    };

    atualizarEdicao();

    salvarDadosTabela();



};
//-----------------------------------------------------------------------

function mostrarAlert() {
    //Reproduzir o som
    let audio2 = document.getElementById("somAlert");
    audio2.play();

    //Exibir a mensagem modal no SweetAlert2
    Swal.fire({
        title: 'Alerta!',
        text: 'Você está tentando finalizar uma edição que não foi iniciada! Clique primeiro no botão com o ícone do lápis!',
        icon: 'warning',
        showCancelButton: false,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ok'

    });
};

//-----------------------------------------------------------------------




//-----------------------------------------------------------------------
//Function atualizarTotal() para atualizar o valor total de horas no id #calcTotalHoras após o usuário editar algum dado do id #tabela. Esta function será invocada dentro da function editar para atualizar o id #calcTotalHoras
//3ª abordagem
function atualizarEdicao() {
    let tabela = document.getElementById('tabela');
    let totalHoras = 0;

    for (let i = 1; i < tabela.rows.length; i++) { // Começa de 1 para evitar a thead
        let inicio = tabela.rows[i].cells[3].innerText; // Coluna do horário de início
        let fim = tabela.rows[i].cells[4].innerText; // Coluna do horário de término

        if (inicio && fim) { // Verifica se ambos os horários estão preenchidos
            let horaInicio = parseInt(inicio.split(":")[0]);
            let minutoInicio = parseInt(inicio.split(":")[1]);

            let horaFim = parseInt(fim.split(":")[0]);
            let minutoFim = parseInt(fim.split(":")[1]);

            let horas = horaFim - horaInicio;
            let minutos = minutoFim - minutoInicio;

            if (minutos < 0) {
                horas--;
                minutos += 60;
            }

            let resultadoHoras = Math.floor(horas + minutos / 60);
            let resultadoMinutos = Math.round((horas + minutos / 60 - resultadoHoras) * 60);

            if (resultadoMinutos === 60) {
                resultadoHoras++;
                resultadoMinutos = 0;
            }

            let resultadoFormatado = resultadoHoras.toString().padStart(2, '0') + ':' + resultadoMinutos.toString().padStart(2, '0') + 'hs';

            tabela.rows[i].cells[5].innerHTML = resultadoFormatado; // Atualiza a coluna "Sub Total"

            totalHoras += horas + minutos / 60;
        }
    };

    let horasFormatadas = Math.floor(totalHoras);
    let minutosFormatados = Math.round((totalHoras - horasFormatadas) * 60);

    if (minutosFormatados === 60) {
        horasFormatadas++;
        minutosFormatados = 0;
    }

    let totalHorasFormatado = horasFormatadas.toString().padStart(2, '0') + ':' + minutosFormatados.toString().padStart(2, '0') + 'hs';

    document.getElementById("calcTotalHoras").innerHTML = totalHorasFormatado; // Atualiza o total de horas
};

// Carregar dados da tabela do localStorage ao carregar a página
carregarDadosTabela();









