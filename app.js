function testarEnvio() {
  fetch("https://script.google.com/macros/s/AKfycby9NyvrwB6FTjGN_n6Y9z8Ig56mdaG0HKgvDdyMNDpmZIZWu93rm-5T-kx30hJq_VYVZA/exec", {
    method: "POST",
    body: JSON.stringify({
      chamado: "TESTE001",
      tecnico: "João Teste",
      dataConclusao: "13/06/2026",
      horaConclusao: "10:00",
      nota: 5,
      comentario: "Teste do sistema"
    })
  })
  .then(r => r.text())
  .then(res => {
    alert("Resposta: " + res);
  })
  .catch(err => {
    alert("Erro: " + err);
  });
}
