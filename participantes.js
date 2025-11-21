import { db } from "./firebase.js";
import {
    doc,
    getDoc,
    updateDoc,
    deleteField
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { } from "./toast.js";

const listaRef = doc(db, "nomes", "lista");

const snap = await getDoc(listaRef);

if (!snap.exists()) {
    await updateDoc(listaRef, {
        nomes: [],
        sorteados: [],
        sorteios: {}
    });
}

async function carregar() {
    const snap = await getDoc(listaRef);

    if (!snap.exists()) {
        return { nomes: [], sorteados: [], sorteios: {} };
    }

    const data = snap.data();

    return {
        nomes: data.nomes || [],        // garante que sempre existe
        sorteados: data.sorteados || [],
        sorteios: data.sorteios || {}
    };
}

// ------------------ CONFETES ------------------
function dispararConfetes() {
    const container = document.getElementById("confetes-container");
    const cores = ["#f94144", "#f3722c", "#f9c74f", "#90be6d", "#577590", "#43aa8b"];
    
    for (let i = 0; i < 50; i++) {  // cria 50 confetes
        const confete = document.createElement("div");
        confete.classList.add("confete");
        
        // Posição horizontal aleatória
        confete.style.left = Math.random() * window.innerWidth + "px";
        
        // Cor aleatória
        confete.style.backgroundColor = cores[Math.floor(Math.random() * cores.length)];
        
        // Tamanho aleatório
        const tamanho = 5 + Math.random() * 10;
        confete.style.width = tamanho + "px";
        confete.style.height = tamanho + "px";
        
        // Velocidade aleatória
        confete.style.animationDuration = 1 + Math.random() * 2 + "s";
        
        // Direção levemente aleatória (desvio horizontal)
        const deslocamentoX = (Math.random() - 0.5) * 200; // -100 a 100px
        confete.style.transform = `translateX(${deslocamentoX}px)`;
        
        container.appendChild(confete);

        // Remove confete após a animação
        confete.addEventListener("animationend", () => confete.remove());
    }
}





//------------------ SORTEIO ------------------
window.sortear = async function () {
    const nomeDigitado = document.getElementById("input-nome").value.trim();
    if (!nomeDigitado) {
        return alert("Por favor, digite seu nome.");
    }

    const snap = await getDoc(listaRef);
    const data = snap.exists() ? snap.data() : {};

    const nomes = Array.isArray(data.nomes) ? data.nomes : [];
    const sorteios = typeof data.sorteios === "object" ? data.sorteios : {};

    // Normalizar nomes para evitar problemas com maiúsculas/minúsculas
    const nomeDigitadoLower = nomeDigitado.toLowerCase();
    const nomesLower = nomes.map(n => n.toLowerCase());

    // Validar se o nome está na lista
    if (!nomesLower.includes(nomeDigitadoLower)) {
        return toastMessage(
            "Poxa!Seu nome não está na lista de participantes.\n\n" +
            "Fale com o organizador para ser adicionado.", "error"
        );
    }

    // Verificar se o participante já fez o sorteio
    if (sorteios[nomeDigitadoLower]) {
        return toastMessage("Você já realizou seu sorteio.", "info");
    }

    // Criar lista de opções válidas (não tirar a si mesmo e não repetir sorteados)
    const opcoes = nomes.filter(
        n => n.toLowerCase() !== nomeDigitadoLower &&
            !Object.values(sorteios).map(x => x.toLowerCase()).includes(n.toLowerCase())
    );

    if (opcoes.length === 0) {
        return toastMessage("Não restam participantes disponíveis para serem sorteados.", "error");
    }

    // Sorteio aleatório
    const amigo = opcoes[Math.floor(Math.random() * opcoes.length)];

    // Atualizar sorteios e sorteados corretamente
    const novosSorteios = { ...sorteios, [nomeDigitadoLower]: amigo };
    const novosSorteados = [...new Set(Object.values(novosSorteios))];

    await updateDoc(listaRef, {
        sorteios: novosSorteios,
        sorteados: novosSorteados
    });

    const resultadoBox = document.getElementById("resultado");
resultadoBox.innerHTML = `<p>Você tirou: <strong>${amigo}</strong></p>`;

// Forçar reflow para que a transição funcione
resultadoBox.offsetWidth; 

// Adiciona classe para animar
resultadoBox.classList.add("show");

// Opcional: remover efeito depois de 5 segundos
// setTimeout(() => {
//     resultadoBox.classList.remove("show");
// }, 5000);

// Dispara confetes ao mesmo tempo
dispararConfetes();

};
