let listaDeAmigos = []

function adicionarAmigo() {
    let amigo = document.getElementById('amigo').value
    
    if (amigo) {
        listaDeAmigos.push(amigo);
        document.getElementById('amigo').value = '';
        atualizarLista();
        console.log(amigo);
    } else {
        alert('Por favor, digite um nome válido.');
    }
    
}

function atualizarLista() {
    let listaDeAmigos = document.getElementById('listaAmigos');
    listaDeAmigos.innerHTML = ''; //lista não fique duplicada ao adicionar novos amigos

    for (let i = 0; i < listaDeAmigos.length; i++) {
        let amigo = listaDeAmigos[i];
        
        let li = document.createElement('li'); 
        li.textContent = amigo;
        listaDeAmigos.appendChild(li);
    }
}

function exibirNome(nome) {
    let exibirNome = document.getElementById('resultado');
    exibirNome.innerHTML = `<p><strong>${nome}</strong></p>`;
    
}

function sortearAmigo() {
    if (listaDeAmigos.length > 0) {
        let amigoSorteado = listaDeAmigos[Math.floor(Math.random() * listaDeAmigos.length)]; // Correto
        exibirNome(amigoSorteado);
        atualizarLista();
}    else {
        alert('Por favor, adicione amigos antes de sortear.');
    }
}

function listarAmigos() {
    if (listaDeAmigos.length > 0) {
        exibirNome(listaDeAmigos)
        atualizarLista();

}
}

function removerAmigo() {
    let removerNome = document.getElementById('remover-amigo').value
    if (removerNome !==""){
        alert('Deseja realmente remover o amigo ' + removerNome + '?');
        listaDeAmigos = listaDeAmigos.filter(amigo => amigo !== removerNome);
        document.getElementById('remover-amigo').value = ''; 
        alert('Amigo removido com sucesso!');
        atualizarLista();
    }else {
        alert('Por favor, digite um nome válido.');
    }
}

