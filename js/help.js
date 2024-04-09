//Chama o audio de ajuda quando clicar no botão com icone de 'i' ao lado do título na página de dados 

let ajuda = document.querySelector('.help');
let audioAjuda = document.querySelector('#helpi');
ajuda.addEventListener('click', function () {
    audioAjuda.play();
});