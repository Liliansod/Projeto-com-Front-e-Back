const { console } = require("inspector");

// Ao campo CEP perder o foco será feito a tratativa
document.getElementById("cep").addEventListener("blur", async function () {
  const cep = this.value.replace(/\D/g, ""); // Remove caracteres não numericos

  // Verifica se o CEP tem exatamente 8 Dig.
  if (cep.length !== 8) {
    alert("CEP inválido, deve ter 8 digitos"); // Alerta se for inválido
    return; // Não executa o código para baixo
  }

  try {
    // Faz uma requisição para o Backend e a consulta do CEP informado
    const response = await fetch(`http://localhost:3000/api/cep/${cep}`);
    if (!response.ok) {
      // Verifica se a resposta foi bem sucedida
      throw new Error("Erro ao buscar o CEP"); // Erro ao falhar
    }

    // Converte a resposta da req. para JSON
    const data = await response.json();

    // Verifica se o CEP retornado pela API é inválido
    if (data.erro) {
      alert("Cep não encontrado!");
      return;
    }

    // Preenche os campos do formulário com os dados retornardos
    document.getElementById("logradouro").value = data.logradouro;
    document.getElementById("bairro").value = data.bairro;
    document.getElementById("cidade").value = data.localidade;
    document.getElementById("estado").value = data.uf;

    // Adiciona um feedback visual, alterando a cor da borda dos campos
    document.querySelectorAll(".form-group input").forEach((input) => {
        input.style.borderColor = "#6a11cb"; // Borda roxa ao CPF for encontrado
    });
  } catch (error) {
    console.error("Erro ao buscar o CEP:", error); // Exibe o erro no console
    alert("Erro ao buscar o CEP. Verifique o console para mais detalhes");
  }
});

// Adiciona um evento de envio
document.getElementById('addressForm').addEventListener('submit', async function (e){
  e.preventDefault(); // Impede o recarregamento da pagina ao enviar o formulário

  // Obtém os valores dos campos do formulário e armazena
  const cep = document.getElementById("Cep").value;
  const logradouro = document.getElementById("logradouro").value;
  const bairro = document.getElementById("bairro").value;
  const cidade = document.getElementById("cidade").value;
  const estado = document.getElementById("estado").value;

  try{
    // Faz a requisição POST para o backend para salvar o endereço
    const response = await fetch('http://localhost:3000/api/address', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Define o envio do conteudo como JSON 
      },
      body: JSON.stringify({ cep, logradouro, bairro, cidade, estado}), // Envia os campos
    });

    if (!response.ok){
      throw new Error('Erro ao salvar o endereço!') // Retorna um erro se falhar
    }

    // Converte a esposta req. para JSON
    const result = await response.json();
    alert(result.message); // Exibe a mensagem de sucesso retornada pelo backend

    //Limpa os campos de formulário após o envio bem-sucedido
    document.getElementById("AddressForm").request();

    // Remove o feedback visual (borda colorida)
    document.querySelectorAll(".form-grup input").forEach((input) =>{
      input.style.borderColor = "#ddd"; // Define a borda de volta para o padrão
    });
  }catch (error){
    console.error('Erro ao salvar o endereço', error);
    alert("Erro ao salvar o endereço. Verifique o console para mais detalhes!."); // Alerta ao usuário sobre o erro
  }
});
