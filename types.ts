export type GameState = 'start' | 'loading_model' | 'playing' | 'gameover';

export interface Point {
  x: number;
  y: number;
}

export interface Vector {
  x: number;
  y: number;
}

export interface Fruit {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  type: 'apple' | 'orange' | 'watermelon' | 'bomb';
  rotation: number;
  rotationSpeed: number;
  sliced: boolean;
  scale: number;
}

export interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number; // 0 to 1
  color: string;
  size: number;
}

export interface TrailPoint {
  x: number;
  y: number;
  age: number; // Frames alive
}

export interface HandLandmark {
  x: number;
  y: number;
  z: number;
}