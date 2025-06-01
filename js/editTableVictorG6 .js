let edicaoIniciada = false;

function editar() {
    edicaoIniciada = true;
    let tabela = document.getElementById("tabela");
    for (let i = 1; i < tabela.rows.length; i++) {
        for (let j = 1; j < tabela.rows[i].cells.length - 1; j++) {
            tabela.rows[i].cells[j].contentEditable = "true";
        }
    }
    Swal.fire('IMPORTANTE', 'Edite os dados respeitando os formatos! Após a edição clique no botão Finalizar edição!', 'info');
}

function finalizarEdicao() {
    if (!edicaoIniciada) {
        mostrarAlert();
        return;
    }

    edicaoIniciada = false;
    let tabela = document.getElementById("tabela");
    const updates = [];
    for (let i = 1; i < tabela.rows.length; i++) {
        for (let j = 1; j < tabela.rows[i].cells.length; j++) {
            tabela.rows[i].cells[j].contentEditable = "false";
        }
        const row = tabela.rows[i];
        const rowData = {
            id: parseInt(row.dataset.id),
            data: row.cells[1].innerText,
            paciente: row.cells[2].innerText,
            local: row.cells[3].innerText,
            horaInicio: row.cells[4].innerText,
            horaFim: row.cells[5].innerText,
            subTotal: formatar(duracao(row.cells[4].innerText, row.cells[5].innerText))
        };
        row.cells[6].innerHTML = rowData.subTotal;
        updates.push(rowData);
    }

    Promise.all(updates.map(updateRow)).then(() => {
        carregarDadosTabela();
    });
}

function mostrarAlert() {
    let audio2 = document.getElementById("somAlert");
    audio2.play();
    Swal.fire({
        title: 'Alerta!',
        text: 'Você está tentando finalizar uma edição que não foi iniciada! Clique primeiro no botão com o ícone do lápis!',
        icon: 'warning',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Ok'
    });
}







