//Variáveis no escopo global
let mes;
let ano;

function geraPrompt() {
    //Abre um window.prompt para o usuário digitar o nome do trabalhador
    let nomeDoTrabalhador = window.prompt("Digite o nome do trabalhador...");
    //Abre um window.prompt para o usuário digitar o mes e o ano
    mes = window.prompt("Digite o mês...");
    ano = window.prompt("Digite o ano...");
    //---------------------------------------------------------------
    //Variáveis booleanas para controlar os loops
    let nomeValido = false;
    let mesValido = false;
    let anoValido = false;


    //Remove os espaços em branco
    nomeDoTrabalhador = nomeDoTrabalhador.trim();
    //Verifica se o campo está vazio
    if (nomeDoTrabalhador == "") {
        //Exibe uma mensagem de erro
        window.alert("O nome do trabalhador deve ser preenchido!!!");
    } else {
        //Converte o nome para letras minúsculas
        nomeDoTrabalhador = nomeDoTrabalhador.toLowerCase();

        // Divide o nome em um array de palavras
        nomeDoTrabalhador = nomeDoTrabalhador.split(" ");

        // Percorre o array e capitaliza a primeira letra de cada palavra
        for (let i = 0; i < nomeDoTrabalhador.length; i++) {
            nomeDoTrabalhador[i] = nomeDoTrabalhador[i].charAt(0).toUpperCase() + nomeDoTrabalhador[i].slice(1);
        }

        // Junta o array em uma string novamente
        nomeDoTrabalhador = nomeDoTrabalhador.join(" ");

        //Muda o valor da variável booleana para sair do loop
        nomeValido = true;
    }

    if (mes == null || mes == "") {
        alert("O campo mês é obrigatório! Preencha todos os campos!");
        return false;
    }
    if (ano == null || ano == "") {
        alert("O campo ano é obrigatório!Preencha todos os campos!");
        return false;
    };


    // Verificar se o mês é válido
    let meses = [
        "janeiro",
        "jan",
        "fevereiro",
        "fev",
        "março",
        "mar",
        "abril",
        "abr",
        "maio",
        "mai",
        "junho",
        "jun",
        "julho",
        "jul",
        "agosto",
        "ago",
        "setembro",
        "set",
        "outubro",
        "out",
        "novembro",
        "nov",
        "dezembro",
        "dez",
        "1",
        "01",
        "2",
        "02",
        "3",
        "03",
        "4",
        "04",
        "5",
        "05",
        "6",
        "06",
        "7",
        "07",
        "8",
        "08",
        "9",
        "09",
        "10",
        "11",
        "12"
    ];
    if (!meses.includes(mes.toLowerCase())) {
        alert("Digite o nome de um mês válido e nos formatos por extenso, ou mmm ou 1 ou 01! Preencha todos os campos!");
        return false;
    };

    // Verificar se o ano é válido
    let anoAtual = new Date().getFullYear();
    if (ano < 1900 || ano > anoAtual || ano.length < 2 || ano.length > 4) {
        alert("O ano digitado deve estar entre 1900 e o ano corrente!");
        return false;
    };



    //Verifica se todos os campos foram preenchidos ou cancelados
    if (nomeDoTrabalhador && mes && ano) {
        //Aplica a classe tituloVisivel ao elemento com id tituloRelatorio
        document.getElementById("tituloRelatorio").classList.add("tituloVisivel");
        //Remove a classe oculto do elemento com id tituloRelatorio
        document.getElementById("tituloRelatorio").classList.remove("oculto");
        //---------------------------------------------------------------

        //Aplica a classe tituloVisivel ao elemento com id name
        document.getElementById("name").classList.add("tituloVisivel");
        //Remove a classe oculto do elemento com id name
        document.getElementById("name").classList.remove("oculto");
        //---------------------------------------------------------------

        //Aplica a classe tituloVisivel ao elemento com id monthYear
        document.getElementById("monthYear").classList.add("tituloVisivel");
        //Remove a classe oculto do elemento com id monthYear
        document.getElementById("monthYear").classList.remove("oculto");
        //---------------------------------------------------------------





        //O id name recebe o nome do trabalhador digitado pelo usuário e é impresso na página em html
        document.getElementById("name").innerHTML = nomeDoTrabalhador;

        //Concatenar as variáveis mes e ano e imprimi-las na página em html
        document.getElementById("monthYear").innerHTML = `Mês: ${mes} / ${ano}`;

        //------------------------------------------------------------------

        //Gera uma página em pdf apartir do elemento com a class content
        geraPdf();

    }

    setTimeout(() => {
        document.getElementById("tituloRelatorio").classList.remove("tituloVisivel");
        document.getElementById("tituloRelatorio").classList.add("oculto");

        document.getElementById("name").classList.remove("tituloVisivel");
        document.getElementById("name").classList.add("oculto");

        document.getElementById("monthYear").classList.remove("tituloVisivel");
        document.getElementById("monthYear").classList.add("oculto");
    }, 5000); // 5 segundos em milissegundos


};



//-----------------------------------------------------------------
function geraPdf() {
    //Selecionando o conteúdo que será convertido para pdf
    const conteudo = document.querySelector('.content');

    //Configuração do arquivo final do pdf
    const options = {
        margin: [4, 10, 10, 2],
        filename: `relatorioDeHorasTrabalhadas ${mes}${ano}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDf: { unit: "mm", format: "a4", orientation: "portrait" },
        pagebreak: { mode: ['css', 'legacy'] }
    }

    //Gerar e baixar o pdf
    html2pdf().set(options).from(conteudo).save();
}