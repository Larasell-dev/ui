import { createContext } from 'react';

// The popup needs to know whether the menu is open to animate its exit.
export const MenuOpenContext = createContext(false);
