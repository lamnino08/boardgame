export const Prototype = {
  home: {
    greeting: () => {
      const hour = new Date().getHours();

      if (hour >= 5 && hour < 12) {
        return "Good morning";
      } else if (hour >= 12 && hour < 17) {
        return "Good afternoon";
      } else if (hour >= 17 && hour < 21) {
        return "Good evening";
      } else {
        return "Good night";
      }
    },
    motivationQuote: () => {
      const quotes = [
        "Believe you can and you're halfway there.",
        "Push yourself, because no one else is going to do it for you.",
        "Your limitation—it's only your imagination.",
        "Great things never come from comfort zones.",
        "Dream it. Wish it. Do it.",
        "Success doesn't just find you. You have to go out and get it.",
        "Don't watch the clock; do what it does. Keep going.",
        "It's going to be hard, but hard does not mean impossible.",
        "Sometimes later becomes never. Do it now.",
        "You are capable of amazing things.",
      ];

      const randomIndex = Math.floor(Math.random() * quotes.length);
      return quotes[randomIndex];
    },
  },
};
