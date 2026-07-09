import { create } from 'zustand';
import { setBuildPart, type Build, type Category, type PartOf } from '@/lib/types';

interface BuildState {
  build: Build;
  powered: boolean;
  setPart: <C extends Category>(category: C, part: PartOf<C>) => void;
  removePart: (category: Category) => void;
  clearBuild: () => void;
  loadBuild: (build: Build) => void;
  togglePower: () => void;
}

export const useBuildStore = create<BuildState>((set) => ({
  build: {},
  powered: false,

  setPart: (category, part) =>
    set((state) => ({ build: setBuildPart(state.build, category, part) })),

  removePart: (category) =>
    set((state) => {
      const build: Build = { ...state.build };
      delete build[category];
      return { build };
    }),

  clearBuild: () => set({ build: {}, powered: false }),

  loadBuild: (build) => set({ build }),

  togglePower: () => set((state) => ({ powered: !state.powered })),
}));
