// @flow

// -------------------------------------------------------------------------------
// Generic Types
// -------------------------------------------------------------------------------\

export type Vector = {x: number, y: number};
export type Mass = number;

// for eg fuel or ammo
export type Resource = {cur: number, max: number};

// Radians are preferred everywhere, but degrees might be used for display/debugging
export type Radians = number;
export type Degrees = number;

// Size is in the units of the world, vs pixels
export type Size = number;
export type Pixel = number;

export type Listener = () => mixed; // some callback passed to subscribe
export type Unsubscribe = () => mixed; // unsubscribe a listener
export type Store = {
  getState: () => State,
  dispatch: (action: Action) => Action, // dispatched action returns itself
  subscribe: (Listener) => Unsubscribe,
};

// -------------------------------------------------------------------------------
// General State
// -------------------------------------------------------------------------------

// some unique id per player
export type PlayerID = string; // number in practice lol
// unique id per game, 0 == lobby
export type GameID = string; // number in practice lol

export type State = {
  players: Array<Player>, // all players in any game
  games: {[id: GameID]: Game}, // all games that exist, for showing in the lobby
  game: ?GameState,
};

export type Game = {
  id: GameID,
  players: Array<PlayerID>,
  started: boolean,
};

export type Player = {
  id: PlayerID, // some unique id
  name: string, // display name
  score: number, // keep track of each player's score across games
  isThisClient: boolean, // whether the player is the one on this computer
  gameID: GameID,
  ready: boolean,
};

// -------------------------------------------------------------------------------
// Game State
// -------------------------------------------------------------------------------

export type GameState = {
  gamePlayers: Array<PlayerID>, // the players participating in this game
  time: number,

  // entities
  ships: {[id: PlayerID]: Ship},
  planets: Array<Entity>,
  sun: Entity,
  projectiles: Array<Projectile>,
};

export type Entity = {
  position: Vector,
  velocity: Vector,
  accel: Vector,

  mass: Mass,
  radius: Size,

  theta: Radians,
  thetaSpeed: Radians, // how theta changes over time

  history: Array<Entity>,
};

export type Ship = Entity & {
  playerID: PlayerID,

  // non-zero if the ship is thrusting right now
  // see config for how much accel to apply here
  thrust: number,

  fuel: Resource,
  laserCharge: Resource,
  // ammo: Resource,
  // missiles: Resource,
};

export type Projectile = Entity & {
  playerID: PlayerID,
  type: string,
};

// -------------------------------------------------------------------------------
// Actions
// -------------------------------------------------------------------------------

export type Action =
  {type: 'CREATE_GAME', gameID: GameID, playerID: PlayerID} |
  {type: 'JOIN_GAME', gameID: GameID, playerID: PlayerID} |
  {type: 'RESTART'} |
  {type: 'CREATE_PLAYER',
    playerID: PlayerID, name: string, isThisClient: boolean, gameID: GameID
  } |
  {type: 'START', gameID: GameID} |
  {type: 'READY', gameID: GameID} | // sent to server, server will send back serverID
  {type: 'SET_TURN', playerID: PlayerID, thetaSpeed: Radians, time: number} |
  {type: 'SET_THRUST', playerID: PlayerID, thrust: number, time: number} |
  {type: 'FIRE_LASER', playerID: PlayerID, time: number} |
  {type: 'SET_PLAYER_NAME', playerID: PlayerID, name: string} |
  {type: 'TICK'};

