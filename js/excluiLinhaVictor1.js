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




//------------------------------------------------------------------
//capturando o botão "Deletar linha"
const btnDeletarLinha = document.getElementById('btnDeletarLinha');

//Capturando a tabela
let tabela = document.getElementById('tabela');

//-----------------------------------------------------------------------
// Adicionar um evento de clique no botão
btnDeletarLinha.addEventListener('click', () => {
    // Exibir alerta solicitando que o usuário selecione uma linha da tabela
    alert('Por favor, clique sobre uma linha da tabela para selecioná-la.');

    // Adicionar um evento de clique na tabela
    tabela.addEventListener('click', clickHandler);
});

//--------------------------------------------------------------------
// Função de tratamento de clique
function clickHandler(event) {
    const clickedRow = event.target.closest('tr');

    // Verificar se a linha clicada não está dentro do cabeçalho da tabela
    if (!clickedRow.closest('thead')) {
        if (clickedRow.dataset.selecionada === 'true') {
            // Desfazer a seleção
            clickedRow.classList.remove('linha-selecionada');
            clickedRow.removeAttribute('data-selecionada');
        } else {
            // Selecionar a linha
            pintarLinha(clickedRow);
        };
    };
};

//-------------------------------------------------------------
// Function pintarLinha
function pintarLinha(linha) {
    linha.classList.add('linha-selecionada');
    linha.setAttribute('data-selecionada', 'true');

    // Adicionar um delay para garantir que a classe seja aplicada antes do modal
    setTimeout(() => {
        // Exibir confirmação de deleção
        let confirmacao = confirm('Você tem certeza de que deseja excluir esta linha?');

        if (confirmacao) {
            deletarLinha(linha);
        } else {
            linha.classList.remove('linha-selecionada');
            linha.removeAttribute('data-selecionada');
            // Remover o evento de clique da tabela
            tabela.removeEventListener('click', clickHandler);
        }
    }, 100); // Tempo em milissegundos (100ms = 0.1s)
};


//-----------------------------------------------------------------------
// Function deletarLinha
function deletarLinha(linha) {
    // Remover a linha da tabela    
    linha.remove();
    // Chamar a função para atualizar o total
    atualizarTotal();
    // Salvar os dados da tabela no localStorage após exclusão ou não...
    salvarDadosTabela();
    // Remover o evento de clique da tabela
    tabela.removeEventListener('click', clickHandler);
};

//-----------------------------------------------------------------


//-----------------------------------------------------------------
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
