fetch("https://script.google.com/macros/s/AKfycby9NyvrwB6FTjGN_n6Y9z8Ig56mdaG0HKgvDdyMNDpmZIZWu93rm-5T-kx30hJq_VYVZA/exec", {
  method: "POST",
  body: JSON.stringify({
    chamado: "123",
    tecnico: "João",
    dataConclusao: "13/06/2026",
    horaConclusao: "10:30",
    nota: 5,
    comentario: "OK"
  })
})
