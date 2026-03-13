const API_URL = 'https://crudcrud.com/api/YOUR_CRUDCRUD_API/clientes';

const form = document.getElementById('cliente-form');
const lista = document.getElementById('lista-clientes');

// Cadastrar cliente
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;

    await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email })
    });

    form.reset();
    listarClientes();
});

// Listar clientes
async function listarClientes() {
    lista.innerHTML = '';
    const res = await fetch(API_URL);
    const clientes = await res.json();

    clientes.forEach(cliente => {
        const li = document.createElement('li');
        li.textContent = `${cliente.nome} (${cliente.email})`;

        const btn = document.createElement('button');
        btn.textContent = 'Excluir';
        btn.onclick = () => excluirCliente(cliente._id);

        li.appendChild(btn);
        lista.appendChild(li);
    });
}

// Excluir cliente
async function excluirCliente(id) {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    listarClientes();
}

// Carregar lista ao abrir
listarClientes();