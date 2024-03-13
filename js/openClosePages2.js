// Function para salvar os dados da tabela no localStorage
function salvarDadosTabela() {
    let tabela = document.getElementById("tabela");
    localStorage.setItem('horasTabela', JSON.stringify(tabela.innerHTML));
};


// Função para carregar os dados da tabela do localStorage, se disponíveis
function carregarDadosTabela() {
    let tabela = document.getElementById("tabela");
    let dadosSalvos = localStorage.getItem('horasTabela');
    if (dadosSalvos) {
        tabela.innerHTML = JSON.parse(dadosSalvos);
    };
};

//------------------------------------------------------------
/*Config do botão Ligar*/
const ligarButton = document.querySelector('.buttonOnOff');
//Initial state: off;
let isOn = false;

//Evento de click no botão Ligar
ligarButton.addEventListener('click', function () {
    //Toggle the state
    isOn = !isOn;

    // Altera a cor da tag <a> com base no estado
    const link = ligarButton.querySelector('a');
    if (isOn) {
        link.style.color = 'lime';
    } else {
        link.style.color = 'red';
    }

    //Muda o estado da class de .neonOff para .neon e viceVersa
    //Seleciona o elemento
    let tituloLuminoso = document.querySelector('#tituloLumi');


    //Verificando se existe a class neonOff aplicada
    tituloLuminoso.classList.toggle('neon', isOn);
    tituloLuminoso.classList.toggle('neonOff', !isOn);



    if (isOn) {
        //Tocar o audio ao clicar no botão
        let audio1 = document.querySelector('#som1');
        audio1.play();

        setTimeout(ligaLetreiro, 500);
    }
});

//Evento de click no botão .job
let botaoJob = document.querySelector('.job');
botaoJob.addEventListener('click', function () {
    // Seleciona o elemento #tituloLumi
    let tituloLuminoso = document.querySelector('#tituloLumi');

    // Verifica se a classe .neon está aplicada
    if (tituloLuminoso.classList.contains('neon')) {
        abreForm();
    } else {
        alert('A máquina está desligada. Por favor, ligue-a para prosseguir!');
    }
});




//-------------------------------------------------------------------
function abreForm() {
    //Selecionando as sections id open e id entradaDados
    let sectionOpen = document.querySelector('#open');
    let sectionDados = document.querySelector('#entradaDados');


    //Verificando se existe a class aberturaOpen aplicada
    if (sectionOpen.classList.contains('aberturaOpen')) {
        //Se contem, desativa  a class aberturaOpen e adiciona a class aberturaClosed
        sectionOpen.classList.remove('aberturaOpen');
        sectionOpen.classList.add('aberturaClosed');
    };

    //Verificando se existe a class .dadosClosed aplicada
    if (sectionDados.classList.contains('dadosClosed')) {
        //Se contem, desativa a class dadosClosed e ativa a class dadosOpen
        sectionDados.classList.remove('dadosClosed');
        sectionDados.classList.add('dadosOpen');
    };

    atualizarTotal();

    carregarDadosTabela();
};
//-----------------------------------------------------------------------
//Tocar audio no botão new job
let botaoAbertura = document.querySelector('#novoServico');
botaoAbertura.addEventListener('click', function () {
    //Selecionando o elemento de audio
    let audio3 = document.querySelector('#som3');
    audio3.play();
});


//-------------------------------------------------------------------------


//Função encerrar para voltar a tela inicial

function encerrar() {
    let sectionOpen = document.querySelector('#open');
    let sectionDados = document.querySelector('#entradaDados');

    //Verificando se existe a class .dadosOpen aplicada
    if (sectionDados.classList.contains('dadosOpen')) {
        //Se contem, desativa a class dadosOpen
        sectionDados.classList.remove('dadosOpen');
        sectionDados.classList.add('dadosClosed');
    }

    //Verificando se existe a class aberturaClosed aplicada
    if (sectionOpen.classList.contains('aberturaClosed')) {
        //Se contem, desativa  a class aberturaClosed
        sectionOpen.classList.remove('aberturaClosed');
        sectionOpen.classList.add('aberturaOpen');
    }


    atualizarTotal()

    salvarDadosTabela();


};




//---------------------------------------------------------------

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


    salvarDadosTabela();

    carregarDadosTabela()
};


// Chama a função para carregar os dados da tabela do localStorage ao carregar a página
//document.addEventListener('DOMContentLoaded', function () {
//carregarDadosTabela();
//});
