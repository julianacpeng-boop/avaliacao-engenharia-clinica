function salvarPendente(dados) {
  let pendencias = JSON.parse(localStorage.getItem("pendencias")) || [];

  pendencias.push(dados);

  localStorage.setItem("pendencias", JSON.stringify(pendencias));

  console.log("Salvo offline:", dados);
}
