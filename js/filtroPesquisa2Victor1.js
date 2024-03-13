//Configurando o input de filtro e busca

const input_busca = document.querySelector('#input-busca');
const tabela_horas = document.querySelector('#tabela');

input_busca.addEventListener('keyup', function () {
    let expressoes = input_busca.value.toLowerCase().split(' ');   //Separa os termos de busca

    /*if (expressao.length === 1) {
        return;
    }*/

    let linhas = tabela_horas.getElementsByTagName('tr');

    // Comece a partir da segunda linha (índice 1), ignorando o cabeçalho
    for (let posicao = 1; posicao < linhas.length; posicao++) {
        let conteudoDaLinha = linhas[posicao].innerHTML.toLowerCase();
        let correspondencia = expressoes.every(expressao => conteudoDaLinha.includes(expressao));   // Verifica se todas as expressões estão na linha

        /*if (conteudoDaLinha.includes(expressao)) {
            linhas[posicao].style.display = '';
        } else {
            linhas[posicao].style.display = 'none';
        }*/
        linhas[posicao].style.display = correspondencia ? '' : 'none';
    }

    atualizarTotal();

});



//------------------------------------------------------------------
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
}
