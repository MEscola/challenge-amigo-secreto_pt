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
export {};