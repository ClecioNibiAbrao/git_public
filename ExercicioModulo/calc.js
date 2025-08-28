document.getElementById('calcular').addEventListener('click', function() {
    let peso = parseFloat(document.getElementById('peso').value);
    let altura = parseFloat(document.getElementById('altura').value);
    let resultadoImc = document.getElementById('resultado-imc');
    let classificacao = document.getElementById('classificacao');

    if (!peso || !altura || altura <= 0) {
        resultadoImc.textContent = 'Por favor, preencha os campos corretamente.';
        classificacao.textContent = '';
        return;
    }

    const imc = peso / (altura * altura);
    resultadoImc.textContent = `Seu IMC é: ${imc.toFixed(2)}`;

    let classe = '';
    if (imc < 18.5) {
        classe = 'Abaixo do peso';
    } else if (imc < 24.9) {
        classe = 'Peso normal';
    } else if (imc < 29.9) {
        classe = 'Sobrepeso';
    } else if (imc < 34.9) {
        classe = 'Obesidade grau 1';
    } else if (imc < 39.9) {
        classe = 'Obesidade grau 2';
    } else {
        classe = 'Obesidade grau 3';
    }
    classificacao.textContent = classe;
});