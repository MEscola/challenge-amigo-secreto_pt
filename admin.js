import { db } from "./firebase.js";
import { doc, getDoc, updateDoc } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const listaRef = doc(db, "nomes", "lista");
const CACHE_KEY = "listaCache";

// ------------------ TOAST BONITINHO ------------------
window.toastMessage = function(mensagem, tipo = "success") {
    const toast = document.createElement("div");
    toast.className = `toast ${tipo}`;
    toast.textContent = mensagem;

    document.body.appendChild(toast);

     // Ativa a animação de entrada
    requestAnimationFrame(() => {
        toast.classList.add("show");
    });

    // Anima a saída
    setTimeout(() => {
        toast.classList.remove("show");
        toast.classList.add("hide");

        // Remove depois da animação
        setTimeout(() => toast.remove(), 300);
    }, 2300);
};

// ------------------ CACHE ------------------
function salvarCache(lista) {
    localStorage.setItem(CACHE_KEY, JSON.stringify(lista));
}

function carregarCache() {
    const dado = localStorage.getItem(CACHE_KEY);
    return dado ? JSON.parse(dado) : null;
}

// ------------------ Firestore ------------------
async function carregarFirestore() {
    const snap = await getDoc(listaRef);
    return snap.exists() ? snap.data().nomes || [] : [];
}

async function carregar() {
    const cache = carregarCache();
    if (cache) return cache;

    const lista = await carregarFirestore();
    salvarCache(lista);
    return lista;
}

async function salvarLista(lista) {
    salvarCache(lista);
    await updateDoc(listaRef, { nomes: lista });
}

// ------------------ Renderizar Lista ------------------
async function mostrarLista() {
    const lista = await carregar();
    const ul = document.getElementById("lista");
    ul.innerHTML = "";

    lista.forEach((nome, index) => {
        const li = document.createElement("li");
        li.classList.add("item-lista");

        li.innerHTML = `
            <span class="nome-item" title="Clique para editar">${nome}</span>

            <div class="acoes">
                <button class="btn-acao editar" title="Editar">✏️</button>
                <button class="btn-acao remover" title="Remover">🗑️</button>
            </div>
        `;

        li.querySelector(".editar").addEventListener("click", () => editarNome(index, nome));
        li.querySelector(".remover").addEventListener("click", () => removerNome(index));

        li.querySelector(".nome-item").addEventListener("click", () => editarNome(index, nome));

        ul.appendChild(li);
    });
}


// ------------------ EDITAR NOME ------------------
function editarNome(index, nomeAntigo) {
    const ul = document.getElementById("lista");
    const li = ul.children[index];

    const input = document.createElement("input");
    input.value = nomeAntigo;
    input.className = "edit-input";

    li.textContent = "";
    li.appendChild(input);
    input.focus();

    input.addEventListener("blur", async () => {
        const novoNome = input.value.trim();

        if (!novoNome) {
            toastMessage("Nome não pode ficar vazio.", "error");
            mostrarLista();
            return;
        }

        const lista = await carregar();

        if (lista.includes(novoNome) && novoNome !== nomeAntigo) {
            toastMessage("Esse nome já existe.", "error");
            mostrarLista();
            return;
        }

        lista[index] = novoNome;

        await salvarLista(lista);
        toastMessage(`Nome atualizado!`, "success");
        mostrarLista();
    });
}

// ------------------ ADICIONAR ------------------
window.adicionarNome = async function () {
    const input = document.getElementById("nomeInput");
    const nome = input.value.trim();

    if (!nome) {
        toastMessage("Digite um nome.", "error");
        return;
    }

    const lista = await carregar();

    if (lista.includes(nome)) {
        toastMessage("Nome já existe.", "error");
        input.value = "";
        input.blur();
        return;
    }

    const novaLista = [...lista, nome];

    await salvarLista(novaLista);
    await mostrarLista();

    input.value = "";
    input.blur();
    toastMessage("Nome adicionado!", "success");
};

// ------------------ REMOVER ------------------
async function removerNome(index) {
    const lista = await carregar();
    lista.splice(index, 1);

    await salvarLista(lista);
    mostrarLista();
    toastMessage("Nome removido!", "success");
}


// ------------------ LIMPAR LISTA ------------------
window.limparLista = async function () {
    if (!confirm("Tem certeza que deseja limpar toda a lista?")) return;

    await updateDoc(listaRef, { 
        nomes: [], 
        sorteios: {}, 
        sorteados: []   // <-- adiciona isso para limpar corretamente
    });

    salvarCache([]);
    mostrarLista();

    toastMessage("Lista limpa!", "success");
};

// Carregar ao abrir
mostrarLista();
