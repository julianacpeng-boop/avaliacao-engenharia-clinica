const URL_API = "https://script.google.com/macros/s/AKfycbyNR_4H8cYKJJ0KDd8nwq1GYIp0oKEFyj3EnOfgNiCWgz141zNyN4hUJHPR3iqTp16C/exec";

let chamadoAtual = {};
let pendencias = JSON.parse(localStorage.getItem("pendencias") || "[]");

// -------------------- TELA --------------------

function mostrar(tela) {
  document.querySelectorAll(".tela").forEach(t => t.classList.remove("ativa"));
  document.getElementById(tela).classList.add("ativa");
}

// -------------------- NAVEGAÇÃO --------------------

function irTela2() {

  chamadoAtual = {
    chamado: document.getElementById("chamado").value,
    tecnico: document.getElementById("tecnico").value,
    data: document.getElementById("data").value,
    hora: document.getElementById("hora").value
  };

  mostrar("tela2");
}

// -------------------- QR CODE --------------------

function gerarQR() {

  const dados =
    `chamado=${chamadoAtual.chamado}&tecnico=${chamadoAtual.tecnico}&data=${chamadoAtual.data}&hora=${chamadoAtual.hora}`;

  const url = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(dados)}`;

  document.getElementById("qrcode").innerHTML =
    `<img src="${url}">`;

  mostrar("tela3");
}

// -------------------- ABRIR AVALIAÇÃO DO QR --------------------

// se abrir com parâmetros depois (QR avançado)
window.onload = function () {

  const params = new URLSearchParams(window.location.search);

  if (params.get("chamado")) {

    chamadoAtual = {
      chamado: params.get("chamado"),
      tecnico: params.get("tecnico"),
      data: params.get("data"),
      hora: params.get("hora")
    };

    mostrar("tela4");
  }
}

// -------------------- ENVIAR AVALIAÇÃO --------------------

function enviar() {

  const avaliacao = {
    chamado: chamadoAtual.chamado,
    tecnico: chamadoAtual.tecnico,
    nota: document.getElementById("nota").value,
    comentario: document.getElementById("comentario").value
  };

  if (navigator.onLine) {
    enviarServidor(avaliacao);
  } else {
    salvarOffline(avaliacao);
  }
}

// -------------------- ENVIAR SERVER --------------------

async function enviarServidor(dados) {

  try {

    const url =
      URL_API +
      "?chamado=" + encodeURIComponent(dados.chamado) +
      "&tecnico=" + encodeURIComponent(dados.tecnico) +
      "&nota=" + encodeURIComponent(dados.nota) +
      "&comentario=" + encodeURIComponent(dados.comentario);

    await fetch(url);

    alert("Enviado com sucesso!");

  } catch (e) {

    salvarOffline(dados);

  }
}

// -------------------- OFFLINE --------------------

function salvarOffline(dados) {

  pendencias.push(dados);
  localStorage.setItem("pendencias", JSON.stringify(pendencias));

  alert("Salvo offline. Será enviado depois.");
}

// -------------------- SINCRONIZAR --------------------

function sincronizar() {

  let novas = [];

  pendencias.forEach(async (p) => {

    try {
      await enviarServidor(p);
    } catch {
      novas.push(p);
    }

  });

  pendencias = novas;
  localStorage.setItem("pendencias", JSON.stringify(pendencias));

  alert("Sincronização concluída");
}

// -------------------- VOLTAR --------------------

function irTela1() {
  mostrar("tela1");
}

function irTela4() {
  mostrar("tela4");
}
