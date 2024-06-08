import { createContext } from '@lit/context';

import { AutoComplete } from '../models/auto-complete.js';

export const tagsAutoCompleteContext = createContext<AutoComplete>(
  Symbol('tags-auto-complete-context')
);
