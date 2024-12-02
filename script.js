document.addEventListener("DOMContentLoaded", function() {
    atribuirEventosRemocao();
});

document.getElementById('form-produto').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const nome = document.getElementById('nome-produto').value;
    const valor = document.getElementById('valor-produto').value;
    const imagemInput = document.getElementById('imagem-produto');
    const imagem = URL.createObjectURL(imagemInput.files[0]);

    try {
        await adicionarProduto(nome, valor, imagem);

        // Limpa os campos do formulário após adicionar o produto
        document.getElementById('form-produto').reset();
        mostrarMensagem("Produto adicionado com sucesso!");
    } catch (error) {
        console.error("Erro ao adicionar produto:", error);
        mostrarMensagem("Erro ao adicionar produto. Tente novamente.");
    }
});

async function adicionarProduto(nome, valor, imagem) {
    const listaProdutos = document.querySelector('[data-lista-produtos]');

    const produto = {
        nome,
        valor,
        imagem
    };

    // Para mockar a solicitação HTTP
    const resposta = await mockHttpPost('https://api.alurageek.com/produtos', produto);
    
    if (resposta.ok) {
        const li = document.createElement('li');
        li.innerHTML = `
            <img class="produto__imagem" src="${imagem}" alt="${nome}">
            <div class="produto__descricao">
                <h3 class="produto__nome">${nome}</h3>
                <p class="produto__valor">${valor}</p>
                <img class="lixeira" src="icone lixeira.png" alt="Remover produto" onclick="confirmarRemocaoProduto(this)">
            </div>
        `;
        listaProdutos.appendChild(li);

        // Para remover novo produto
        atribuirEventoRemocao(li.querySelector('.lixeira'));
    } else {
        throw new Error('Falha ao adicionar produto');
    }
}

async function confirmarRemocaoProduto(elemento) {
    mostrarConfirmacao("Tem certeza que deseja remover este produto?", async () => {
        try {
            await removerProduto(elemento);
            mostrarMensagem("Produto removido com sucesso!");
        } catch (error) {
            console.error("Erro ao remover produto:", error);
            mostrarMensagem("Erro ao remover produto. Tente novamente.");
        }
    });
}

async function removerProduto(elemento) {
    const produtoElement = elemento.parentElement.parentElement;
    const nome = produtoElement.querySelector('.produto__nome').textContent;

    // Mockando a solicitação HTTP
    const resposta = await mockHttpDelete(`https://api.alurageek.com/produtos/${nome}`);
    
    if (resposta.ok) {
        produtoElement.classList.add("removendo");
        setTimeout(() => {
            produtoElement.remove();
        }, 300); // Espera a animação de desvanecimento terminar
    } else {
        throw new Error('Falha ao remover produto');
    }
}

// Para mockar uma solicitação HTTP POST
async function mockHttpPost(url, data) {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log(`POST para ${url} com dados:`, data);
            resolve({ ok: true });
        }, 1000);
    });
}

// Para mockar uma solicitação HTTP DELETE
async function mockHttpDelete(url) {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log(`DELETE para ${url}`);
            resolve({ ok: true });
        }, 1000);
    });
}

// Função de exibição das mensagens modais
function mostrarMensagem(mensagem) {
    const modal = document.getElementById("modal");
    const mensagemModal = document.getElementById("mensagem-modal");
    mensagemModal.textContent = mensagem;

    const botaoFechar = document.getElementById("fechar-modal");
    botaoFechar.onclick = () => {
        modal.style.display = "none";
    };

    document.querySelector(".botoes__modal").style.display = "none";
    document.querySelector(".botao__fechar").style.display = "flex";
    modal.style.display = "block";
}

// Função de exibição das confirmações modais
function mostrarConfirmacao(mensagem, aoConfirmar) {
    const modal = document.getElementById("modal");
    const mensagemModal = document.getElementById("mensagem-modal");
    mensagemModal.textContent = mensagem;

    const botaoFechar = document.getElementById("fechar-modal");
    botaoFechar.onclick = () => {
        modal.style.display = "none";
    };

    const botaoConfirmar = document.getElementById("confirmar-modal");
    const botaoCancelar = document.getElementById("cancelar-modal");

    botaoConfirmar.onclick = () => {
        modal.style.display = "none";
        aoConfirmar();
    };

    botaoCancelar.onclick = () => {
        modal.style.display = "none";
    };

    document.querySelector(".botoes__modal").style.display = "flex";
    document.querySelector(".botao__fechar").style.display = "none";
    modal.style.display = "block";
}

// Código que fecha o modal ao clicar fora dele
window.onclick = function(event) {
    const modal = document.getElementById("modal");
    if (event.target == modal) {
        modal.style.display = "none";
    }
};

// Função para atribuir evento de remoção produtos existentes
function atribuirEventosRemocao() {
    const lixeiras = document.querySelectorAll('.lixeira');
    lixeiras.forEach(lixeira => {
        lixeira.onclick = function() {
            confirmarRemocaoProduto(this);
        };
    });
}

// Função para atribuir evento de remoção a um novo produto
function atribuirEventoRemocao(elemento) {
    elemento.onclick = function() {
        confirmarRemocaoProduto(this);
    };
}
