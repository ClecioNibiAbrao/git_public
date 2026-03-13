// gera num aleatorio
const numeroSecreto = Math.floor(Math.random() * 100) + 1;
// num max de tentativas
const maxTentativas = 10;

let tentativasRestantes = maxTentativas;
let jogoAtivo = true;

const inputPalpite = document.getElementById('palpite');
const btnChutar = document.getElementById('chutar');
const mensagem = document.getElementById('mensagem');
const tentativas = document.getElementById('tentativas');

tentativas.textContent = `Tentativas restantes: ${tentativasRestantes}`;


btnChutar.addEventListener('click', function() {
    if (!jogoAtivo) return;

    const palpite = parseInt(inputPalpite.value);

    if (isNaN(palpite) || palpite < 1 || palpite > 100) {
        mensagem.textContent = 'Por favor, insira um número válido entre 1 e 100.';
        return;
    }

    tentativasRestantes--;
    tentativas.textContent = `Tentativas restantes: ${tentativasRestantes}`;

    if (palpite === numeroSecreto) {
        mensagem.textContent = `Você acertou o número ${numeroSecreto}! Parabéns!`;
        jogoAtivo = false;
        btnChutar.disabled = true;
        inputPalpite.disabled = true;
    } else if (tentativasRestantes === 0) {
        mensagem.textContent = `Você perdeu! O número secreto era ${numeroSecreto}.`;
        jogoAtivo = false;
        btnChutar.disabled = true;
        inputPalpite.disabled = true;
    } else if (palpite < numeroSecreto) {
        mensagem.textContent = 'O número secreto é maior!';
    } else {
        mensagem.textContent = 'O número secreto é menor!';
    }

    inputPalpite.value = '';
    inputPalpite.focus();
});