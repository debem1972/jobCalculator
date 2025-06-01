function parse(horario) {
    let [hora, minuto] = horario.split(':').map(v => parseInt(v));
    return minuto + (hora * 60);
}

function duracao(entrada, saida) {
    return parse(saida) - parse(entrada);
}

function formatar(minutos) {
    let horas = Math.floor(minutos / 60);
    minutos = minutos % 60;
    return horas.toString().padStart(2, '0') + ':' + minutos.toString().padStart(2, '0') + 'hs';
}

document.querySelector("#entradaData").addEventListener('input', function () {
    let entradaData = this.value;
    let entradaDataNumeros = entradaData.replace(/\D/g, '');
    let dataFormatada = entradaDataNumeros.replace(
        /(\d{2})(\d{2})(\d{4})/,
        function (match, dia, mes, ano) {
            return dia + '/' + mes + '/' + ano;
        }
    );
    this.value = dataFormatada;

    let partesData = dataFormatada.split('/');
    let dia = parseInt(partesData[0]);
    let mes = parseInt(partesData[1]);
    let ano = parseInt(partesData[2]);

    let bissexto = (ano % 4 === 0 && ano % 100 !== 0) || ano % 400 === 0;
    if (mes === 2 && ((bissexto && dia > 29) || (!bissexto && dia > 28))) {
        window.alert(`Data inválida. Fevereiro não possui mais de 28 dias em ${ano}.`);
        this.value = '';
        this.focus();
        return;
    }
});

const inputPaciente = document.querySelector('#paciente');
inputPaciente.addEventListener("input", function () {
    const texto = inputPaciente.value;
    inputPaciente.value = texto.charAt(0).toUpperCase() + texto.slice(1);
});

function lancar() {
    function horaEmMinutos(hora) {
        let partes = hora.split(":");
        let horas = parseInt(partes[0]);
        let minutos = parseInt(partes[1]);
        return horas * 60 + minutos;
    }

    let dataInput = document.getElementById('entradaData').value;
    let paciente = document.getElementById('paciente').value;
    let local = document.querySelector('input[name="local"]:checked')?.value;
    let horaInicio = document.getElementById("horaInicio").value;
    let horaFim = document.getElementById("horaFim").value;

    if (!dataInput) {
        window.alert('Preencha a data!');
        document.querySelector("#entradaData").focus();
        return;
    }

    let dataRegex = /^\d{1,2}\/\d{1,2}\/\d{2,4}$/;
    if (!dataRegex.test(dataInput)) {
        window.alert('Formato de data inválido. Utilize ddmmaaaa!');
        document.querySelector("#entradaData").value = "";
        document.querySelector("#entradaData").focus();
        return;
    }

    if (!horaInicio || !horaFim) {
        window.alert('Preencha os campos Hora de Inicio e Hora de Fim!');
        return;
    }

    if (horaEmMinutos(horaInicio) > horaEmMinutos(horaFim)) {
        window.alert('A hora de início de um trabalho não poderá ser maior que a hora final! Para horários até as 23:59hs do dia corrente, lançar dentro do mesmo dia! ');
        return;
    }

    let duracaoPeriodo = duracao(horaInicio, horaFim);
    let resultado = formatar(duracaoPeriodo);

    const rowData = {
        data: dataInput,
        paciente,
        local,
        horaInicio,
        horaFim,
        subTotal: resultado
    };

    saveRow(rowData).then(() => {
        carregarDadosTabela();
        let formulario = document.querySelector('#formulario');
        formulario.reset();
        document.getElementById('entradaData').focus();
        let audio4 = document.getElementById('som4');
        audio4.play();
    });
}

function atualizarTotal() {
    let totalHoras = 0;
    getAllRows().then(rows => {
        rows.forEach(row => {
            totalHoras += duracao(row.horaInicio, row.horaFim);
        });
        const totalFormatado = formatar(totalHoras);
        document.getElementById('calcTotalHoras').innerHTML = totalFormatado;
    });
}

document.addEventListener('DOMContentLoaded', () => {
    openDB().then(() => carregarDadosTabela());
});