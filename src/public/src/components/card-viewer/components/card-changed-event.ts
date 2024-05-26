import { Card } from '../../../trpc.js';

export const kCardChangedEventName = 'card-changed';

type ModifiableCardAttributes = Partial<Pick<Card, 'title' | 'description' | 'urgency' | 'tags' | 'isPublic'>>;

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
