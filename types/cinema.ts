export interface Scene {
  number: number;
  title: string;
  duration: number; // in seconds
  visual: string;
  action: string;
  dialogue: string;
  soundDesign?: string;
  style?: string;
}

export interface CinemaProject {
  id: string;
  title: string;
  style: string;
  duration: string;
  language: string;
  script: string;
  format?: string;
  scenes: Scene[];
  createdAt: string;
  updatedAt: string;
  isFavorite?: boolean;
}
