// src/hooks/useGitlantisStore.ts
import { create } from 'zustand';
import { Vector3 } from 'three';

interface GitlantisState {
  boatPosition: [number, number, number];
  boatRotation: [number, number, number];
  selectedProject: any | null;
  hoveredObject: string | null;
  isNavigating: boolean;
  cameraFollow: boolean;
  hasMoved: boolean;

  projects: { id: string; title: string; featured?: boolean; position: [number, number, number] }[];
  skills: { name: string; category: string; level: number; position: [number, number, number] }[];

  setBoatPosition: (position: [number, number, number]) => void;
  setBoatRotation: (rotation: [number, number, number]) => void;
  setSelectedProject: (project: any | null) => void;
  setHoveredObject: (objectId: string | null) => void;
  setIsNavigating: (navigating: boolean) => void;
  toggleCameraFollow: () => void;
  setHasMoved: (moved: boolean) => void;

  setProjects: (projects: GitlantisState['projects']) => void;
  setSkills: (skills: GitlantisState['skills']) => void;
}

export const useGitlantisStore = create<GitlantisState>((set) => ({
  boatPosition: [0, 0, 0],
  boatRotation: [0, 0, 0],
  selectedProject: null,
  hoveredObject: null,
  isNavigating: false,
  cameraFollow: true,
  hasMoved: false,

  projects: [],
  skills: [],

  setBoatPosition: (position) => set({ boatPosition: position }),
  setBoatRotation: (rotation) => set({ boatRotation: rotation }),
  setSelectedProject: (project) => set({ selectedProject: project }),
  setHoveredObject: (objectId) => set({ hoveredObject: objectId }),
  setIsNavigating: (navigating) => set({ isNavigating: navigating }),
  toggleCameraFollow: () => set((state) => ({ cameraFollow: !state.cameraFollow })),
  setHasMoved: (moved) => set({ hasMoved: moved }),

  setProjects: (projects) => set({ projects }),
  setSkills: (skills) => set({ skills }),
}));
