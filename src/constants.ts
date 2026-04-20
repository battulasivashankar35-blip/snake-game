export interface Track {
  id: string;
  title: string;
  artist: string;
  url: string;
  cover: string;
}

export const TRACKS: Track[] = [
  {
    id: 'X-001',
    title: 'VOID_PROTOCOL',
    artist: 'UNKNOWN_ENTITY',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    cover: 'https://picsum.photos/seed/glitch1/400/400?grayscale',
  },
  {
    id: 'X-002',
    title: 'STATIC_DREAMS',
    artist: 'NULL_RECURSION',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    cover: 'https://picsum.photos/seed/glitch2/400/400?grayscale',
  },
  {
    id: 'X-003',
    title: 'RECURSIVE_GHOST',
    artist: 'VOID_WALKER',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    cover: 'https://picsum.photos/seed/glitch3/400/400?grayscale',
  },
];

export const COLORS = {
  cyan: '#00ffff',
  magenta: '#ff00ff',
  yellow: '#ffff00',
  black: '#000000',
};
