import { USER_MIN } from "../constants";

// Hər user artdıqca qiymət, board və bot sayı xətti artır.
// Starter: baza $49 (20 user), hər +1 user → +$2, +1 board/10 user, +1 bot/50 user
// Premium: baza $99 (20 user), hər +1 user → +$3; 250+ userdən boards/bots "Unlimited" olur
// Yearly: 20% endirim

export function calcStarter(users: number, yearly: boolean) {
  const base = 29 + (users - USER_MIN) * 1;
  const price = Math.round(base * (yearly ? 0.8 * 12 : 1));
  const boards = 5 + Math.floor((users - USER_MIN) / 10);
  const bots = 2 + Math.floor((users - USER_MIN) / 50);
  return {
    price,
    features: [
      `${users} Users included`,
      `${boards} boards and tasks`,
      "Apps Integrations",
      `${bots} Tasks automation bots`,
      "Community access",
    ],
  };
}

export function calcPremium(users: number, yearly: boolean) {
  const base = 59 + (users - USER_MIN) * 2;
  const price = Math.round(base * (yearly ? 0.8 * 12 : 1));
  const boards = users >= 250 ? "Unlimited" : String(25 + Math.floor((users - USER_MIN) / 8));
  const bots = users >= 200 ? "Unlimited" : String(5 + Math.floor((users - USER_MIN) / 20));
  return {
    price,
    features: [
      `${users} Users included`,
      `${boards} boards and tasks`,
      "Apps Integrations",
      `${bots} tasks automation bots`,
      "Community access",
    ],
  };
}
