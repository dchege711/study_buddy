interface MockCard {
  id: string;
  title: string;
  description: string;
  tags: string;
  urgency: number;
}

const sampleCards: MockCard[] = [
  {
    id: "1",
    title: "Sample Card 1",
    description: "Sample Description 1",
    tags: "tag1 tag2",
    urgency: 1,
  },
];

function mockQuery(): Promise<MockCard[]> {
  return Promise.resolve(sampleCards);
}

export const trpc = {
  searchPublicCards: {
    query: mockQuery,
  },
};
