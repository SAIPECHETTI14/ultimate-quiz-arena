// FUTURE MULTIPLAYER SUPPORT

const multiplayerRoom = {

  roomId: null,

  players: [],

  scores: {},

  status: "waiting"

};

// CREATE ROOM

function createRoom(){

  multiplayerRoom.roomId =
    Math.random().toString(36).substring(2, 8);

  console.log(
    "Room Created:",
    multiplayerRoom.roomId
  );

}

// JOIN ROOM

function joinRoom(playerName){

  multiplayerRoom.players.push(playerName);

}

// UPDATE SCORE

function updateScore(playerName, score){

  multiplayerRoom.scores[playerName] = score;

}