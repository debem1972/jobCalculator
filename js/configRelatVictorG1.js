function geraPrompt() {
    Swal.fire({
        title: 'Gerar Relatório',
        html: `
            <input type="text" id="nome" class="swal2-input" placeholder="Nome do trabalhador">
            <input type="text" id="mes" class="swal2-input" placeholder="Mês (ex: junho)">
            <input type="text" id="ano" class="swal2-input" placeholder="Ano (ex: 2025)">
        `,
        confirmButtonText: 'Gerar PDF',
        preConfirm: () => {
            const nome = Swal.getPopup().querySelector('#nome').value.trim();
            const mes = Swal.getPopup().querySelector('#mes').value.trim().toLowerCase();
            const ano = Swal.getPopup().querySelector('#ano').value.trim();
            const meses = [
                "janeiro", "jan", "fevereiro", "fev", "março", "mar", "abril", "abr",
                "maio", "mai", "junho", "jun", "julho", "jul", "agosto", "ago",
                "setembro", "set", "outubro", "out", "novembro", "nov", "dezembro", "dez",
                "1", "01", "2", "02", "3", "03", "4", "04", "5", "05", "6", "06",
                "7", "07", "8", "08", "9", "09", "10", "11", "12"
            ];
            const anoAtual = new Date().getFullYear();
            if (!nome) {
                Swal.showValidationMessage('O nome do trabalhador é obrigatório!');
                return false;
            }
            if (!meses.includes(mes)) {
                Swal.showValidationMessage('Digite um mês válido (nome por extenso, abreviação ou número)!');
                return false;
            }
            if (!ano || ano < 1900 || ano > anoAtual || ano.length < 2 || ano.length > 4) {
                Swal.showValidationMessage('O ano deve estar entre 1900 e o ano corrente!');
                return false;
            }
            return { nome, mes, ano };
        }
    }).then(result => {
        if (result.isConfirmed) {
            const { nome, mes, ano } = result.value;
            const nomeFormatado = nome.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
            document.getElementById("name").innerHTML = nomeFormatado;
            document.getElementById("monthYear").innerHTML = `Mês: ${mes} / ${ano}`;
            document.getElementById("tituloRelatorio").classList.add("tituloVisivel");
            document.getElementById("tituloRelatorio").classList.remove("oculto");
            document.getElementById("name").classList.add("tituloVisivel");
            document.getElementById("name").classList.remove("oculto");
            document.getElementById("monthYear").classList.add("tituloVisivel");
            document.getElementById("monthYear").classList.remove("oculto");
            geraPdf(mes, ano);
            setTimeout(() => {
                document.getElementById("tituloRelatorio").classList.remove("tituloVisivel");
                document.getElementById("tituloRelatorio").classList.add("oculto");
                document.getElementById("name").classList.remove("tituloVisivel");
                document.getElementById("name").classList.add("oculto");
                document.getElementById("monthYear").classList.remove("tituloVisivel");
                document.getElementById("monthYear").classList.add("oculto");
            }, 5000);
        }
    });
}

function geraPdf(mes, ano) {
    const conteudo = document.querySelector('.content');
    const options = {
        margin: [4, 10, 10, 2],
        filename: `relatorioDeHoras${mes}${ano}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        pagebreak: { mode: ['css', 'legacy'] }
    };
    html2pdf().set(options).from(conteudo).save();
}