class Estacionamento {
    constructor(valor) {
        this.valor = valor;
    }

    calcularTempo() {
        // Exemplo de regras: R$1,00 = 30min, R$2,00 = 1h, R$3,00 = 2h
        if (this.valor < 1) {
            return { tempo: 0, troco: 0, insuficiente: true };
        } else if (this.valor < 2) {
            return { tempo: 30, troco: this.valor - 1, insuficiente: false };
        } else if (this.valor < 3) {
            return { tempo: 60, troco: this.valor - 2, insuficiente: false };
        } else {
            return { tempo: 120, troco: this.valor - 3, insuficiente: false };
        }
    }
}

document.getElementById('calculateButton').addEventListener('click', function() {
    const valor = parseFloat(document.getElementById('valueInput').value);
    const estacionamento = new Estacionamento(valor);
    const resultado = estacionamento.calcularTempo();

    const timeResult = document.getElementById('timeResult');
    const changeResult = document.getElementById('changeResult');
    const insufficientMessage = document.getElementById('insufficientMessage');

    if (resultado.insuficiente) {
        timeResult.textContent = '';
        changeResult.textContent = '';
        insufficientMessage.textContent = 'Valor insuficiente. Insira pelo menos R$1,00.';
        insufficientMessage.classList.remove('hidden');
    } else {
        timeResult.textContent = `Tempo: ${resultado.tempo} minutos`;
        changeResult.textContent = `Troco: R$ ${resultado.troco.toFixed(2)}`;
        insufficientMessage.textContent = '';
        insufficientMessage.classList.add('hidden');
    }
});