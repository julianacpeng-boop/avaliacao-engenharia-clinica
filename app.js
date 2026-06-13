
const URL_API = "https://script.google.com/macros/s/AKfycbyNR_4H8cYKJJ0KDd8nwq1GYIp0oKEFyj3EnOfgNiCWgz141zNyN4hUJHPR3iqTp16C/exec";

let chamadoAtual = {};
let pendencias = JSON.parse(localStorage.getItem("pendencias") || "[]");

// ------------------ INICIAL ------------------

window.onload = function () {

  const params = new URLSearchParams(window.location.search);

  if (params.get("chamado")) {

    chamadoAtual = {
      chamado: params.get("chamado"),
      tecnico: params.get("tecnico"),
      data: params.get("data"),
      hora: params.get("hora")
    };

    mostrar("tela4"); // QR abre direto avaliação
  }

  setDataHora();
}

// ------------------ DATA/HORA AUTOMÁTICA ------------------

function setDataHora() {
  const agora = new Date();

  const data = document.getElementById("data");
  const hora = document.getElementById("hora");

  if (data) data.value = agora.toISOString().split("T")[0];
  if (hora) hora.value = agora.toTimeString().slice(0,5);
}

// ------------------ TROCA DE TELAS ------------------

function mostrar(tela) {
  document.querySelectorAll(".tela").forEach(t => t.classList.remove("ativa"));
  document.getElementById(tela).classList.add("ativa");

  if (tela === "tela5") atualizarPendencias();
}

// ------------------ TELA 1 ------------------

function concluirChamado() {

  chamadoAtual = {
    chamado: document.getElementById("chamado").value,
    tecnico: document.getElementById("tecnico").value,
    data: document.getElementById("data").value,
    hora: document.getElementById("hora").value
  };

  mostrar("tela2");
}

// ------------------ QR CODE ------------------

function gerarQR() {

  const dados =
    `chamado=${chamadoAtual.chamado}&tecnico=${chamadoAtual.tecnico}&data=${chamadoAtual.data}&hora=${chamadoAtual.hora}`;

  const urlQR = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(dados)}`;

  document.getElementById("qrcode").innerHTML = `<img src="${urlQR}">`;

  mostrar("tela3");
}

// ------------------ AVALIAÇÃO ------------------

function enviarAvaliacao() {

  const avaliacao = {
    chamado: chamadoAtual.chamado,
    tecnico: chamadoAtual.tecnico,
    nota: document.getElementById("nota").value,
    comentario: document.getElementById("comentario").value
  };

  if (navigator.onLine) {
    enviarServidor(avaliacao, true);
  } else {
    salvarOffline(avaliacao);
  }
}

// ------------------ ENVIO SERVIDOR ------------------

async function enviarServidor(dados, mostrarMsg=false) {

  const url =
    URL_API +
    "?chamado=" + encodeURIComponent(dados.chamado) +
    "&tecnico=" + encodeURIComponent(dados.tecnico) +
    "&nota=" + encodeURIComponent(dados.nota) +
    "&comentario=" + encodeURIComponent(dados.comentario);

  try {

    await fetch(url);

    if (mostrarMsg) alert("Avaliação enviada com sucesso!");

  } catch (e) {

    salvarOffline(dados);

  }
}

// ------------------ OFFLINE ------------------

function salvarOffline(dados) {

  pendencias.push(dados);
  localStorage.setItem("pendencias", JSON.stringify(pendencias));

  alert("Avaliação salva. Pendente envio para base de dados.");

  mostrar("tela5");
}

// ------------------ PENDÊNCIAS ------------------

function atualizarPendencias() {

  const div = document.getElementById("pendencias");
  div.innerHTML = "";

  pendencias.forEach((p, i) => {

    div.innerHTML += `
      <div class="card">
        <b>${p.chamado}</b><br>
        Técnico: ${p.tecnico}<br>
        Nota: ${p.nota}<br>

        <button onclick="remover(${i})">Remover</button>
      </div>
    `;
  });
}

// ------------------ REMOVER ------------------

function remover(i) {
  pendencias.splice(i, 1);
  localStorage.setItem("pendencias", JSON.stringify(pendencias));
  atualizarPendencias();
}

// ------------------ SINCRONIZAR ------------------

function sincronizar() {

  let restantes = [];

  pendencias.forEach(async (p) => {

    try {
      await enviarServidor(p);
    } catch {
      restantes.push(p);
    }

  });

  pendencias = restantes;
  localStorage.setItem("pendencias", JSON.stringify(pendencias));

  alert("Sincronização concluída");
}
