const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// ⭐ socket tự động kết nối server online
const socket = io();

let players = {};
const speed = 5;

socket.on("currentPlayers", (data) => {
  players = data;
});

socket.on("newPlayer", ({ id, player }) => {
  players[id] = player;
});

socket.on("updatePlayers", (data) => {
  players = data;
});

socket.on("removePlayer", (id) => {
  delete players[id];
});

function drawMap() {
  ctx.fillStyle = "#666";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // bàn bếp
  ctx.fillStyle = "#8B4513";
  ctx.fillRect(300, 200, 200, 50);
}

function drawPlayers() {
  for (let id in players) {
    const p = players[id];
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x, p.y, 30, 30);
  }
}

function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawMap();
  drawPlayers();
  requestAnimationFrame(loop);
}
loop();

document.addEventListener("keydown", (e) => {
  let dx = 0, dy = 0;

  if (e.key === "ArrowUp") dy = -speed;
  if (e.key === "ArrowDown") dy = speed;
  if (e.key === "ArrowLeft") dx = -speed;
  if (e.key === "ArrowRight") dx = speed;

  if (dx !== 0 || dy !== 0) {
    socket.emit("move", { dx, dy });
  }
});