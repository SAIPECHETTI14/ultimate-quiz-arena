const roomCodeInput = document.getElementById("roomCodeInput");
const createRoomBtn = document.getElementById("createRoomBtn");
const joinRoomBtn = document.getElementById("joinRoomBtn");
const startRoomQuizBtn = document.getElementById("startRoomQuizBtn");
const roomStatus = document.getElementById("roomStatus");
const roomPlayers = document.getElementById("roomPlayers");

const playerName = localStorage.getItem("playerName") || "Player";

function getRooms(){
  return JSON.parse(localStorage.getItem("multiplayerRooms") || "{}");
}

function saveRooms(rooms){
  localStorage.setItem("multiplayerRooms", JSON.stringify(rooms));
}

function renderRoom(room){
  if(!room) return;

  if(roomStatus){
    roomStatus.textContent = `Room ${room.code} - ${room.status}`;
  }

  if(roomPlayers){
    roomPlayers.innerHTML = room.players
      .map((name) => `<div class="feature-item"><h3>${name}</h3><p>Ready to play</p></div>`)
      .join("");
  }

  if(startRoomQuizBtn) startRoomQuizBtn.disabled = false;
}

createRoomBtn?.addEventListener("click", () => {
  const rooms = getRooms();
  const code = Math.random().toString(36).slice(2, 8).toUpperCase();
  const room = {
    code,
    host: playerName,
    players: [playerName],
    scores: {},
    status: "waiting"
  };

  rooms[code] = room;
  saveRooms(rooms);
  localStorage.setItem("activeRoomCode", code);
  if(roomCodeInput) roomCodeInput.value = code;
  renderRoom(room);
});

joinRoomBtn?.addEventListener("click", () => {
  const code = roomCodeInput?.value.trim().toUpperCase();
  const rooms = getRooms();
  const room = rooms[code];

  if(!room){
    alert("Room not found. Create a new room or check the code.");
    return;
  }

  if(!room.players.includes(playerName)){
    room.players.push(playerName);
  }

  rooms[code] = room;
  saveRooms(rooms);
  localStorage.setItem("activeRoomCode", code);
  renderRoom(room);
});

startRoomQuizBtn?.addEventListener("click", () => {
  const code = localStorage.getItem("activeRoomCode");
  if(!code) return;

  localStorage.setItem("quizCategory", "coding");
  localStorage.setItem("quizDifficulty", "easy");
  localStorage.setItem("quizAmount", "10");
  localStorage.setItem("multiplayerMode", "true");
  window.location.href = "quiz.html";
});

const activeCode = localStorage.getItem("activeRoomCode");
if(activeCode){
  const activeRoom = getRooms()[activeCode];
  if(roomCodeInput) roomCodeInput.value = activeCode;
  renderRoom(activeRoom);
}
