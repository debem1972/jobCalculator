//Preparando os dados para o cálculo de horas e minutos
// Função para fazer o parsing de uma string de horário no formato hh:mm
function parse(horario) {
    // Divide a string em duas partes, separado por dois-pontos, e transforma em número
    let [hora, minuto] = horario.split(':').map(v => parseInt(v));
    return minuto + (hora * 60); // Retorna o total de minutos
}

// Função para calcular a duração total em minutos de um período trabalhado
function duracao(entrada, saida) {
    // Subtrai os minutos de entrada dos minutos de saída
    return parse(saida) - parse(entrada);
}

// Função para formatar uma quantidade de minutos como uma string no formato hh:mmhs
function formatar(minutos) {
    // Divide os minutos em horas e minutos
    let horas = Math.floor(minutos / 60);
    minutos = minutos % 60;
    // Retorna a string formatada
    return horas.toString().padStart(2, '0') + ':' + minutos.toString().padStart(2, '0') + 'hs';
}

//-------------------------------------------------------------------------
// Adicione um evento de input ao campo #entradaData
document.querySelector("#entradaData").addEventListener('input', function () {
    let entradaData = this.value;

    // Remover qualquer caractere que não seja número da entrada do usuário
    let entradaDataNumeros = entradaData.replace(/\D/g, '');

    // Adicionar separadores à entrada de data
    let dataFormatada = entradaDataNumeros.replace(
        /(\d{2})(\d{2})(\d{4})/,
        function (match, dia, mes, ano) {
            return dia + '/' + mes + '/' + ano;
        }
    );

    // Defina o valor do campo data como a data formatada
    this.value = dataFormatada;



    //Verificação de datas inválidas
    //Extrair dia, mês e ano
    let partesData = dataFormatada.split('/');
    let dia = parseInt(partesData[0]);
    let mes = parseInt(partesData[1]);
    let ano = parseInt(partesData[2]);

    //Verifica se o ano é bissexto
    let bissexto = (ano % 4 === 0 && ano % 100 !== 0) || ano % 400 === 0;

    // Verificar se o mês é fevereiro e o dia é maior que 29 em anos bissextos ou 28 em anos não bissextos
    if (mes === 2 && ((bissexto && dia > 29) || (!bissexto && dia > 28))) {
        window.alert(`Data inválida. Fevereiro não possui mais de 28 dias em ${ano}.`);
        // Limpar o campo data e manter o foco
        this.value = '';
        this.focus();
        return;
    };

});
//--------------------------------------------------------------------

//------------------------------------------------------------------------
//Primeira letra do campo id #paciente deverá ser automaticamente maiúscula
const inputPaciente = document.querySelector('#paciente');
inputPaciente.addEventListener("input", function () {
    const texto = inputPaciente.value;
    inputPaciente.value = texto.charAt(0).toUpperCase() + texto.slice(1);
})

//-----------------------------------------------------------------------

//-----------------------------------------------------------------------
function lancar() {

    //------------------------------------------------------------------
    function horaEmMinutos(hora) {
        let partes = hora.split(":"); // Separa a hora dos minutos
        let horas = parseInt(partes[0]); // Converte a hora em número
        let minutos = parseInt(partes[1]); // Converte os minutos em número
        return horas * 60 + minutos; // Retorna o total de minutos
    }


    //----------------------------------------------------------------
    // Obter os valores dos inputs

    let dataInput = document.getElementById('entradaData').value;
    let paciente = document.getElementById('paciente').value;
    let local = document.querySelector('input[name="local"]:checked').value;
    let horaInicio = document.getElementById("horaInicio").value;
    let horaFim = document.getElementById("horaFim").value;
    //Capturando o id da div total de horas
    let total = document.querySelector('#calcTotalHoras');
    //--------------------------------------------------------------------
    //Validações

    //Campo input #data
    //Validar o campo data que esteja vazio...
    if (!dataInput) {
        window.alert('Preencha a data!');
        document.querySelector("#entradaData").focus();
        return;
    };


    // Validar o formato da data
    let dataRegex = /^\d{1,2}\/\d{1,2}\/\d{2,4}$/;
    if (!dataRegex.test(dataInput)) {
        window.alert('Formato de data inválido. Utilize ddmmaaaa!');
        //Limpa o campo data e mantem o focus()...
        document.querySelector("#entradaData").value = "";
        document.querySelector("#entradaData").focus();
        return;
    };

    //---------------------------------------------------------------------
    //Validação dos campos de horário
    //Validar o horaInicio e horaFim não estejam vazios
    if (!horaInicio || !horaFim) {
        window.alert('Preencha os campos Hora de Inicio e Hora de Fim!');
        return;
    };

    //--------------------------------------------------------------------------------
    //Validando o horário de entrada de um job
    if (horaEmMinutos(horaInicio) > horaEmMinutos(horaFim)) {
        window.alert('A hora de início de um trabalho não poderá ser maior que a hora final! Para horários até as 23:59hs do dia corrente, lançar dentro do mesmo dia! ')
        return
    }

    //------------------------------------------------------------------------

    // Calcular a duração do período trabalhado em minutos
    let duracaoPeriodo = duracao(horaInicio, horaFim);

    // Formatar a duração como uma string
    let resultado = formatar(duracaoPeriodo);



    // Obter a referência da tabela
    let tabela = document.getElementById("tabela");

    // Inserir uma nova linha na tabela
    let linha = tabela.insertRow();

    // Criar células na linha   
    let celula1 = linha.insertCell();
    let celula2 = linha.insertCell();
    let celula3 = linha.insertCell();
    let celula4 = linha.insertCell();
    let celula5 = linha.insertCell();
    let celula6 = linha.insertCell();


    // Preencher as células com os valores dos inputs e do resultado
    celula1.innerHTML = dataInput;
    celula2.innerHTML = paciente;
    celula3.innerHTML = local;
    celula4.innerHTML = horaInicio;
    celula5.innerHTML = horaFim;
    celula6.innerHTML = resultado;
    //----------------------------------------------------------------------

    // Calcular o total de horas trabalhadas na tabela
    let totalHoras = 0;
    // Percorrer as linhas da tabela, a partir da segunda
    for (let i = 1; i < tabela.rows.length; i++) {
        // Obter os valores das células de hora de início e fim
        let inicio = tabela.rows[i].cells[3].innerHTML;
        let fim = tabela.rows[i].cells[4].innerHTML;
        // Somar a duração do período ao total
        totalHoras += duracao(inicio, fim);
    }
    // Formatar o total de horas como uma string
    let totalFormatado = formatar(totalHoras);
    // Colocar o resultado na tag p
    total.innerHTML = totalFormatado;

    //---------------------------------------------------------
    // Limpar os campos inputs
    let formulario = document.querySelector('#formulario');
    formulario.reset();


    // Focar no campo data
    document.getElementById('entradaData').focus();

    //---------------------------------------------------------  
    //Seleciona o elemento de audio
    let audio4 = document.getElementById('som4');

    //Reproduzir o som ao clicar no botão Lançar
    audio4.play();
    //----------------------------------------------------------------
    // Atualizar o total (independentemente de os valores terem sido alterados ou não)
    atualizarTotal();

    salvarDadosTabela();
};

//-----------------------------------------------------------------------
/*Som de teclado de pc no botão Lançar*/
/*let lancarButton = document.getElementById('lancaInfos');
lancarButton.addEventListener('click', function () {
    //Seleciona o elemento de audio
    let audio2 = document.getElementById('som2');

    //Reproduzir o som ao clicar no botão Lançar
    audio2.play();
});*/

//------------------------------------------------------------------------
// Function para salvar os dados da tabela no localStorage
function salvarDadosTabela() {
    let tabela = document.getElementById("tabela");
    localStorage.setItem('horasTabela', JSON.stringify(tabela.innerHTML));
};

//-----------------------------------------------------------------------
//Function atualizarTotal() para atualizar o valor total de horas no id #calcTotalHoras após o usuário editar algum dado do id #tabela. Esta function será invocada dentro da function editar para atualizar o id #calcTotalHoras
//3ª abordagem
function atualizarTotal() {
    let tabela = document.getElementById("tabela");
    let totalHoras = 0;
    let linhas = tabela.getElementsByTagName('tr');

    // Percorre as linhas, ignorando o cabeçalho (começando do índice 1)
    for (let i = 1; i < linhas.length; i++) {
        // Verifica se a linha está visível
        if (linhas[i].style.display !== 'none') {
            // Obtém os valores de início e fim da linha visível
            let inicio = linhas[i].cells[3].innerHTML;
            let fim = linhas[i].cells[4].innerHTML;
            // Calcula a duração e adiciona ao total
            totalHoras += duracao(inicio, fim);
        }
    }

    // Formata o total de horas e atualiza o elemento no HTML
    let totalFormatado = formatar(totalHoras);
    let total = document.getElementById("calcTotalHoras");
    total.innerHTML = totalFormatado;


    //salvarDadosTabela();

    //carregarDadosTabela()
};


//-------------------------------------------------------------------

// Função para carregar os dados da tabela do localStorage, se disponíveis
function carregarDadosTabela() {
    let tabela = document.getElementById("tabela");
    let dadosSalvos = localStorage.getItem('horasTabela');
    if (dadosSalvos) {
        tabela.innerHTML = JSON.parse(dadosSalvos);
    };
};

// Chama a função para carregar os dados da tabela do localStorage ao carregar a página
document.addEventListener('DOMContentLoaded', function () {
    carregarDadosTabela();
});


