import { Card } from '../../../trpc.js';

export const kCardChangedEventName = 'card-changed';

export type ModifiableCardAttributes =
  Partial<Pick<Card, 'title' | 'urgency' | 'tags' | 'isPublic'>>
  & { prompt?: string, response?: string };

export class CardChangedEvent extends Event {
    changes: ModifiableCardAttributes;
    constructor(changes: ModifiableCardAttributes) {
        super(kCardChangedEventName, { bubbles: true, composed: true });
        this.changes = changes;
    }
}

declare global {
  interface GlobalEventHandlersEventMap {
    'card-changed': CardChangedEvent;
  }
}
