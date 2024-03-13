function mostrarAlert() {
    //Reproduzir o som
    let audio5 = document.getElementById("somAlert");
    audio5.play();

    //Exibir a mensagem modal no SweetAlert2
    Swal.fire({
        title: 'Alerta!',
        text: 'Você está acessando uma página que não é permitida para você. Por favor, volte para a página inicial.',
        icon: 'warning',
        showCancelButton: false,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ok'

    });
}