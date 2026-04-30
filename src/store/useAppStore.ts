import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Character, Milestone, SobrietyData, AIMessage } from '../types';

interface AppState {
  character: Character | null;
  milestones: Milestone[];
  sobrietyData: SobrietyData | null;
  chatHistory: AIMessage[];
  unlockedRewards: string[];
  
  setCharacter: (character: Character) => void;
  updateCharacter: (character: Partial<Character>) => void;
  startSobriety: () => void;
  getSobrietyStatus: () => SobrietyData | null;
  addMilestone: (milestone: Milestone) => void;
  completeMilestone: (milestoneId: string) => void;
  unlockReward: (rewardId: string) => void;
  addChatMessage: (message: AIMessage) => void;
  clearChat: () => void;
  loadFromStorage: () => Promise<void>;
  saveToStorage: () => Promise<void>;
}

const useAppStore = create<AppState>((set, get) => ({
  character: null,
  milestones: [],
  sobrietyData: null,
  chatHistory: [],
  unlockedRewards: [],
  
  setCharacter: (character) => {
    set({ character });
    get().saveToStorage();
  },
  
  updateCharacter: (updates) => set((state) => ({
    character: state.character ? { ...state.character, ...updates } : null,
  })),
  
  startSobriety: () => {
    const startDate = new Date();
    set({
      sobrietyData: {
        startDate,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      },
    });
    AsyncStorage.setItem('sobrietyStart', startDate.toISOString());
  },
  
  getSobrietyStatus: () => {
    const startDateStr = AsyncStorage.getItem('sobrietyStart');
    
    if (!startDateStr) return null;
    
    const startDate = new Date(startDateStr);
    const now = new Date();
    const diff = now.getTime() - startDate.getTime();
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    return { startDate, days, hours, minutes, seconds };
  },
  
  addMilestone: (milestone) => set((state) => ({
    milestones: [...state.milestones, milestone],
  })),
  
  completeMilestone: (milestoneId) => set((state) => ({
    milestones: state.milestones.map((m) =>
      m.id === milestoneId ? { ...m, completed: true, completedAt: new Date() } : m
    ),
  })),
  
  unlockReward: (rewardId) => set((state) => ({
    unlockedRewards: [...new Set([...state.unlockedRewards, rewardId])],
  })),
  
  addChatMessage: (message) => set((state) => ({
    chatHistory: [...state.chatHistory, message],
  })),
  
  clearChat: () => set({ chatHistory: [] }),
  
  loadFromStorage: async () => {
    try {
      const character = await AsyncStorage.getItem('character');
      const milestones = await AsyncStorage.getItem('milestones');
      const chatHistory = await AsyncStorage.getItem('chatHistory');
      const unlockedRewards = await AsyncStorage.getItem('unlockedRewards');
      
      if (character) set({ character: JSON.parse(character) });
      if (milestones) set({ milestones: JSON.parse(milestones) });
      if (chatHistory) set({ chatHistory: JSON.parse(chatHistory) });
      if (unlockedRewards) set({ unlockedRewards: JSON.parse(unlockedRewards) });
    } catch (error) {
      console.error('Error loading from storage:', error);
    }
  },
  
  saveToStorage: async () => {
    try {
      const state = get();
      await AsyncStorage.setItem('character', JSON.stringify(state.character));
      await AsyncStorage.setItem('milestones', JSON.stringify(state.milestones));
      await AsyncStorage.setItem('chatHistory', JSON.stringify(state.chatHistory));
      await AsyncStorage.setItem('unlockedRewards', JSON.stringify(state.unlockedRewards));
    } catch (error) {
      console.error('Error saving to storage:', error);
    }
  },
}));

export default useAppStore;