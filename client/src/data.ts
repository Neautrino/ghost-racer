const avatar = (seed: string, bg: string) =>
  `https://api.dicebear.com/9.x/adventurer/svg?seed=${seed}&backgroundColor=${bg}`;

export interface Player {
  rank: number;
  name: string;
  score: number;
  attempts: number;
  avatar: string;
  crown?: boolean;
}

export const players: Player[] = [
  { rank: 1, name: "Kianna Torff", score: 420, attempts: 88, avatar: avatar("Kianna", "b6e3f4"), crown: true },
  { rank: 2, name: "Abram Mango", score: 415, attempts: 100, avatar: avatar("Abram", "ffd5dc") },
  { rank: 3, name: "Alfonso Lubin", score: 390, attempts: 89, avatar: avatar("Alfonso", "c0aede") },
  { rank: 4, name: "Maren Gouse", score: 385, attempts: 90, avatar: avatar("Maren", "d1d4f9") },
  { rank: 5, name: "Desirae Herwitz", score: 360, attempts: 112, avatar: avatar("Desirae", "ffdfbf") },
  { rank: 6, name: "Kianna Torff", score: 324, attempts: 76, avatar: avatar("Kianna2", "b6e3f4") },
  { rank: 7, name: "Max Cooper", score: 290, attempts: 97, avatar: avatar("Max", "c0aede") },
];

export const podium = [players[0], players[1], players[2]];

export interface Reward {
  place: number;
  suffix: string;
  amount: number;
}

export const rewards: Reward[] = [
  { place: 1, suffix: "st", amount: 250 },
  { place: 2, suffix: "nd", amount: 200 },
  { place: 3, suffix: "rd", amount: 150 },
  { place: 4, suffix: "th", amount: 100 },
  { place: 5, suffix: "th", amount: 75 },
  { place: 6, suffix: "th", amount: 60 },
  { place: 7, suffix: "th", amount: 50 },
  { place: 8, suffix: "th", amount: 40 },
  { place: 9, suffix: "th", amount: 30 },
  { place: 10, suffix: "th", amount: 25 },
];

export const currentUser = {
  name: "James C.",
  avatar: avatar("James", "ffdfbf"),
  balance: 540,
};
