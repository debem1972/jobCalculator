const DB_NAME = 'jobCalculatorDB';
const DB_VERSION = 1;
const STORE_NAME = 'workHours';

let db;

function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
        };
        request.onsuccess = (event) => {
            db = event.target.result;
            resolve(db);
        };
        request.onerror = (event) => reject(event.target.error);
    });
}

function saveRow(rowData) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.add(rowData);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

function updateRow(rowData) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.put(rowData);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

function getAllRows() {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

function deleteRows(ids) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        let completed = 0;
        ids.forEach(id => {
            const request = store.delete(id);
            request.onsuccess = () => {
                if (++completed === ids.length) resolve();
            };
            request.onerror = () => reject(request.error);
        });
    });
}

function carregarDadosTabela() {
    const tabela = document.getElementById('tabela');
    getAllRows().then(rows => {
        while (tabela.rows.length > 1) tabela.deleteRow(1);
        rows.forEach(row => {
            const tr = tabela.insertRow();
            tr.dataset.id = row.id;
            tr.innerHTML = `
                <td><input type="checkbox" class="row-checkbox"></td>
                <td>${row.data}</td>
                <td>${row.paciente}</td>
                <td>${row.local}</td>
                <td>${row.horaInicio}</td>
                <td>${row.horaFim}</td>
                <td>${row.subTotal}</td>
            `;
        });
        atualizarTotal();
        updateCheckboxListeners();
    });
}

function exportToJson() {
    Swal.fire({
        title: 'Exportar JSON',
        html: `
            <input type="text" id="mes" class="swal2-input" placeholder="Mês (ex: junho)">
            <input type="text" id="ano" class="swal2-input" placeholder="Ano (ex: 2025)">
        `,
        confirmButtonText: 'Exportar',
        preConfirm: () => {
            const mes = Swal.getPopup().querySelector('#mes').value;
            const ano = Swal.getPopup().querySelector('#ano').value;
            if (!mes || !ano) {
                Swal.showValidationMessage('Por favor, insira o mês e o ano.');
            }
            return { mes, ano };
        }
    }).then(result => {
        if (result.isConfirmed) {
            const { mes, ano } = result.value;
            getAllRows().then(rows => {
                const json = JSON.stringify(rows, null, 2);
                const blob = new Blob([json], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `relatorioDeHoras${mes}${ano}.json`;
                a.click();
                URL.revokeObjectURL(url);
            });
        }
    });
}

function importFromJson(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            const transaction = db.transaction([STORE_NAME], 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            store.clear().onsuccess = () => {
                data.forEach(row => saveRow(row));
                carregarDadosTabela();
                Swal.fire('Sucesso', 'Dados importados com sucesso!', 'success');
            };
        } catch (error) {
            Swal.fire('Erro', 'Falha ao importar o arquivo JSON.', 'error');
        }
    };
    reader.readAsText(file);
}

const btnDeletarLinha = document.getElementById('btnDeletarLinha');
const selectAll = document.getElementById('selectAll');

function updateCheckboxListeners() {
    const checkboxes = document.querySelectorAll('.row-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateDeleteButtonState);
    });
}

function updateDeleteButtonState() {
    const checkboxes = document.querySelectorAll('.row-checkbox');
    const anyChecked = Array.from(checkboxes).some(cb => cb.checked);
    btnDeletarLinha.classList.toggle('pulsar', anyChecked);
}

selectAll.addEventListener('change', () => {
    const checkboxes = document.querySelectorAll('.row-checkbox');
    checkboxes.forEach(cb => cb.checked = selectAll.checked);
    updateDeleteButtonState();
});

btnDeletarLinha.addEventListener('click', () => {
    const checkboxes = document.querySelectorAll('.row-checkbox');
    const checkedIds = Array.from(checkboxes)
        .filter(cb => cb.checked)
        .map(cb => parseInt(cb.closest('tr').dataset.id));

    if (checkedIds.length === 0) {
        Swal.fire('Atenção', 'Por favor, escolha marcar a caixa de checagem Selecionar tudo ou clique nas caixas de checagem das linhas que deseja deletar.', 'warning');
        return;
    }

    Swal.fire({
        title: 'Você tem certeza?',
        text: 'Você tem certeza que deseja excluir as linhas selecionadas?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancelar'
    }).then(result => {
        if (result.isConfirmed) {
            deleteRows(checkedIds).then(() => {
                carregarDadosTabela();
                selectAll.checked = false;
                Swal.fire('Sucesso', 'Dados atualizados com sucesso!', 'success');
            });
        } else {
            checkboxes.forEach(cb => cb.checked = false);
            selectAll.checked = false;
            updateDeleteButtonState();
        }
    });
});

document.getElementById('btnExportarJson').addEventListener('click', exportToJson);
document.getElementById('btnImportarJson').addEventListener('click', () => {
    document.getElementById('inputImportarJson').click();
});
document.getElementById('inputImportarJson').addEventListener('change', importFromJson);

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

openDB().then(() => carregarDadosTabela());