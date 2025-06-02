let ajuda = document.querySelector('.help');
let audioAjuda = document.querySelector('#helpi');
let isPlaying = false;
let swalInstance = null;

ajuda.addEventListener('click', function () {
    if (!isPlaying) {
        // Iniciar o áudio e abrir o modal
        audioAjuda.play();
        isPlaying = true;

        // Abrir o modal com SweetAlert2
        swalInstance = Swal.fire({
            title: 'Instruções do Job Calculator',
            html: `
                <p>Olá! Este é o app Job Calculator. Aplicação web com persistência dos dados em IndexedDB. Permite salvar, editar e excluir registros da tabela, além de exportar e importar dados em JSON e gerar relatórios em PDF. Sugiro a cada alteração (inclusão, edição ou exclusão), exportar os dados como arquivo JSON, garantindo a consistência destes e mantendo a tabela sempre atualizada. Espero que gostem!</p>
                <button id="toggleAudio" class="swal2-confirm swal2-styled">Pausar Áudio</button>
            `,
            showConfirmButton: false,
            showCloseButton: true,
            allowOutsideClick: false,
            didOpen: () => {
                // Adicionar evento ao botão de toggle no modal
                const toggleButton = document.getElementById('toggleAudio');
                toggleButton.addEventListener('click', toggleAudio);
            },
            willClose: () => {
                // Pausar o áudio quando o modal for fechado
                audioAjuda.pause();
                audioAjuda.currentTime = 0; // Reiniciar o áudio
                isPlaying = false;
            }
        });
    } else {
        // Pausar o áudio e fechar o modal
        audioAjuda.pause();
        audioAjuda.currentTime = 0; // Reiniciar o áudio
        isPlaying = false;
        if (swalInstance) {
            swalInstance.close();
        }
    }
});

// Função para alternar entre play e pause
function toggleAudio() {
    const toggleButton = document.getElementById('toggleAudio');
    if (isPlaying) {
        audioAjuda.pause();
        isPlaying = false;
        toggleButton.textContent = 'Retomar Áudio';
    } else {
        audioAjuda.play();
        isPlaying = true;
        toggleButton.textContent = 'Pausar Áudio';
    }
}

// Fechar o modal automaticamente quando o áudio terminar
audioAjuda.addEventListener('ended', function () {
    isPlaying = false;
    if (swalInstance) {
        swalInstance.close();
    }
});