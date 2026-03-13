// ==================== CONSTANTES E CONFIGURAÇÕES ====================
const STORAGE_KEY = 'userFormData';
const API_VIACEP = 'https://viacep.com.br/ws';

// ==================== ELEMENTOS DO DOM ====================
const userForm = document.getElementById('userForm');
const cepInput = document.getElementById('cep');
const searchBtn = document.getElementById('searchBtn');
const clearBtn = document.getElementById('clearBtn');
const cepStatus = document.getElementById('cepStatus');
const successMessage = document.getElementById('successMessage');
const savedDataDiv = document.getElementById('savedData');

// Campos do formulário
const formFields = {
    name: document.getElementById('name'),
    email: document.getElementById('email'),
    phone: document.getElementById('phone'),
    cpf: document.getElementById('cpf'),
    cep: document.getElementById('cep'),
    street: document.getElementById('street'),
    number: document.getElementById('number'),
    complement: document.getElementById('complement'),
    neighborhood: document.getElementById('neighborhood'),
    city: document.getElementById('city'),
    state: document.getElementById('state')
};

// ==================== FUNCTIONS - WEB STORAGE ====================

/**
 * Salva os dados do formulário no localStorage
 */
function saveFormToStorage() {
    const formData = {};
    
    Object.keys(formFields).forEach(key => {
        formData[key] = formFields[key].value;
    });
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    console.log('Dados salvos no localStorage:', formData);
}

/**
 * Restaura os dados do formulário a partir do localStorage
 */
function restoreFormFromStorage() {
    const savedData = localStorage.getItem(STORAGE_KEY);
    
    if (savedData) {
        try {
            const formData = JSON.parse(savedData);
            
            Object.keys(formFields).forEach(key => {
                if (formData[key]) {
                    formFields[key].value = formData[key];
                }
            });
            
            console.log('Dados restaurados do localStorage:', formData);
            displaySavedData(formData);
        } catch (error) {
            console.error('Erro ao restaurar dados do localStorage:', error);
        }
    }
}

/**
 * Exibe os dados salvos na tela
 */
function displaySavedData(data) {
    if (!data || Object.values(data).every(v => !v)) {
        savedDataDiv.innerHTML = '<p class="info-text">Nenhum dado cadastrado ainda. Complete o formulário e clique em "Salvar Dados".</p>';
        return;
    }

    let html = '<div class="data-card">';
    html += '<h3>Informações Cadastradas</h3>';
    
    html += '<div class="data-section">';
    html += '<h4>Dados Pessoais</h4>';
    if (data.name) html += `<p><strong>Nome:</strong> ${escapeHtml(data.name)}</p>`;
    if (data.email) html += `<p><strong>E-mail:</strong> ${escapeHtml(data.email)}</p>`;
    if (data.phone) html += `<p><strong>Telefone:</strong> ${escapeHtml(data.phone)}</p>`;
    if (data.cpf) html += `<p><strong>CPF:</strong> ${escapeHtml(data.cpf)}</p>`;
    html += '</div>';
    
    html += '<div class="data-section">';
    html += '<h4>Endereço</h4>';
    if (data.cep) html += `<p><strong>CEP:</strong> ${escapeHtml(data.cep)}</p>`;
    if (data.street) {
        let endereco = escapeHtml(data.street);
        if (data.number) endereco += `, ${escapeHtml(data.number)}`;
        if (data.complement) endereco += ` - ${escapeHtml(data.complement)}`;
        html += `<p><strong>Endereço:</strong> ${endereco}</p>`;
    }
    if (data.neighborhood) html += `<p><strong>Bairro:</strong> ${escapeHtml(data.neighborhood)}</p>`;
    if (data.city) html += `<p><strong>Cidade:</strong> ${escapeHtml(data.city)}, ${escapeHtml(data.state)}</p>`;
    html += '</div>';
    
    html += '</div>';
    savedDataDiv.innerHTML = html;
}

/**
 * Escapa caracteres HTML para evitar XSS
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ==================== FUNCTIONS - FETCH API (ViaCEP) ====================

/**
 * Formata o CEP para o padrão XXXXX-XXX
 */
function formatCEP(cep) {
    cep = cep.replace(/\D/g, '');
    if (cep.length > 5) {
        cep = cep.slice(0, 5) + '-' + cep.slice(5, 8);
    }
    return cep;
}

/**
 * Busca o endereço a partir do CEP usando a API ViaCEP
 */
async function searchAddressByCEP() {
    const cep = cepInput.value.replace(/\D/g, '');
    
    // Validação do CEP
    if (!cep || cep.length !== 8) {
        showCepStatus('CEP deve conter 8 dígitos', 'error');
        clearAddressFields();
        return;
    }
    
    try {
        showCepStatus('Buscando...', 'loading');
        
        const url = `${API_VIACEP}/${cep}/json/`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Verifica se o CEP foi encontrado
        if (data.erro) {
            showCepStatus('CEP não encontrado', 'error');
            clearAddressFields();
            return;
        }
        
        // Preenche os campos de endereço
        fillAddressFields(data);
        showCepStatus('CEP encontrado com sucesso!', 'success');
        
        console.log('Dados do CEP:', data);
    } catch (error) {
        console.error('Erro ao buscar CEP:', error);
        showCepStatus(`Erro ao buscar CEP: ${error.message}`, 'error');
        clearAddressFields();
    }
}

/**
 * Preenche os campos de endereço com os dados da API
 */
function fillAddressFields(data) {
    formFields.street.value = data.logradouro || '';
    formFields.neighborhood.value = data.bairro || '';
    formFields.city.value = data.localidade || '';
    formFields.state.value = data.uf || '';
    
    // Foca no campo de número
    document.getElementById('number').focus();
}

/**
 * Limpa os campos de endereço
 */
function clearAddressFields() {
    formFields.street.value = '';
    formFields.neighborhood.value = '';
    formFields.city.value = '';
    formFields.state.value = '';
}

/**
 * Exibe mensagem de status do CEP
 */
function showCepStatus(message, type) {
    cepStatus.textContent = message;
    cepStatus.className = `status-message ${type}`;
    
    // Remove a mensagem após 3 segundos se for sucesso
    if (type === 'success') {
        setTimeout(() => {
            cepStatus.textContent = '';
            cepStatus.className = 'status-message';
        }, 3000);
    }
}

// ==================== EVENT LISTENERS ====================

// Evento de submit do formulário
userForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    // Valida se há dados para salvar
    const cepValue = cepInput.value.trim();
    if (!cepValue) {
        showSuccessMessage('Por favor, preencha o CEP para buscar o endereço');
        return;
    }
    
    // Salva os dados no localStorage
    saveFormToStorage();
    
    // Obtém os dados atuais
    const formData = {};
    Object.keys(formFields).forEach(key => {
        formData[key] = formFields[key].value;
    });
    
    // Exibe os dados na seção de dados salvos
    displaySavedData(formData);
    
    // Exibe mensagem de sucesso
    showSuccessMessage('Dados salvos com sucesso!');
});

// Evento de reset do formulário
clearBtn.addEventListener('click', function(event) {
    event.preventDefault();
    
    userForm.reset();
    clearAddressFields();
    cepStatus.textContent = '';
    
    // Também remove do localStorage
    localStorage.removeItem(STORAGE_KEY);
    console.log('Formulário limpo e dados removidos do localStorage');
    
    // Limpa a exibição dos dados salvos
    displaySavedData(null);
    
    showSuccessMessage('Formulário limpo com sucesso!');
});

// Botão de busca do CEP
searchBtn.addEventListener('click', searchAddressByCEP);

// Busca ao pressionar Enter no campo de CEP
cepInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        searchAddressByCEP();
    }
});

// Formata o CEP enquanto digita
cepInput.addEventListener('input', function(event) {
    event.target.value = formatCEP(event.target.value);
});

// Auto-salva no localStorage ao alterar qualquer campo
Object.values(formFields).forEach(field => {
    field.addEventListener('change', saveFormToStorage);
});

/**
 * Exibe mensagem de sucesso
 */
function showSuccessMessage(message) {
    successMessage.textContent = message;
    successMessage.style.display = 'block';
    
    setTimeout(() => {
        successMessage.style.display = 'none';
    }, 4000);
}

// ==================== INICIALIZAÇÃO ====================

// Restaura os dados ao carregar a página
document.addEventListener('DOMContentLoaded', function() {
    console.log('Página carregada - Restaurando dados do localStorage');
    restoreFormFromStorage();
});
