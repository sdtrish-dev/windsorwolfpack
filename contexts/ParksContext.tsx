// contexts/ParksContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Park {
  id: string;
  name: string;
  address: string;
  rating: number;
  features: string[];
  description: string;
  addedBy?: string;
  dateAdded?: string;
}

interface ParksContextType {
  parks: Park[];
  addPark: (park: Omit<Park, 'id' | 'dateAdded'>) => void;
  updatePark: (id: string, updates: Partial<Park>) => void;
}

const ParksContext = createContext<ParksContextType | undefined>(undefined);

// Initial Windsor parks data
const INITIAL_PARKS: Park[] = [
  {
    id: '1',
    name: 'Malden Park Dog Area',
    address: '3540 Malden Rd, Windsor, ON',
    rating: 4.5,
    features: ['Fenced', 'Water Station', 'Large Dogs'],
    description: 'Large fenced area with separate sections for big and small dogs.',
  },
  {
    id: '2',
    name: 'Jackson Park',
    address: '1453 Ouellette Ave, Windsor, ON',
    rating: 4.2,
    features: ['Open Space', 'Walking Trails', 'Scenic'],
    description: 'Beautiful park with walking trails along the Detroit River.',
  },
  {
    id: '3',
    name: 'Mic Mac Park',
    address: '2540 Richmond St, Windsor, ON',
    rating: 4.0,
    features: ['Large Area', 'Baseball Diamond', 'Parking'],
    description: 'Spacious park perfect for letting dogs run and play fetch.',
  },
  {
    id: '4',
    name: 'Little River Corridor',
    address: 'Little River Dr, Windsor, ON',
    rating: 4.3,
    features: ['Trail', 'Natural', 'Creek Access'],
    description: 'Natural trail system where dogs can explore and splash in the creek.',
  },
  {
    id: '5',
    name: 'Sandpoint Beach',
    address: '7800 Riverside Dr E, Windsor, ON',
    rating: 3.8,
    features: ['Beach', 'Swimming', 'Leash Required'],
    description: 'Sandy beach where leashed dogs can enjoy the water.',
  },
];

export function ParksProvider({ children }: { children: ReactNode }) {
  const [parks, setParks] = useState<Park[]>(INITIAL_PARKS);

  const addPark = (newPark: Omit<Park, 'id' | 'dateAdded'>) => {
    const park: Park = {
      ...newPark,
      id: Date.now().toString(), // Simple ID generation
      dateAdded: new Date().toISOString(),
      addedBy: 'user', // You could make this dynamic later
    };
    
    setParks(prevParks => [...prevParks, park]);
  };

  const updatePark = (id: string, updates: Partial<Park>) => {
    setParks(prevParks => 
      prevParks.map(park => 
        park.id === id ? { ...park, ...updates } : park
      )
    );
  };

  return (
    <ParksContext.Provider value={{ parks, addPark, updatePark }}>
      {children}
    </ParksContext.Provider>
  );
}

export function useParks() {
  const context = useContext(ParksContext);
  if (context === undefined) {
    throw new Error('useParks must be used within a ParksProvider');
  }
  return context;
}