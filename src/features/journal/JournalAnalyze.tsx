
export const analyzeSentiment = (text: string) => {
    // This is a very basic implementation
    // In a real app, you would use a proper NLP library or API
    const positiveWords = [
      "happy",
      "joy",
      "grateful",
      "thankful",
      "excited",
      "love",
      "good",
      "great",
      "wonderful",
      "amazing",
    ];
    const negativeWords = [
      "sad",
      "angry",
      "upset",
      "frustrated",
      "anxious",
      "worried",
      "bad",
      "terrible",
      "awful",
      "hate",
    ];

    const lowerText = text.toLowerCase();
    let positiveCount = 0;
    let negativeCount = 0;

    positiveWords.forEach((word) => {
      const regex = new RegExp(`\\b${word}\\b`, "g");
      const matches = lowerText.match(regex);
      if (matches) positiveCount += matches.length;
    });

    negativeWords.forEach((word) => {
      const regex = new RegExp(`\\b${word}\\b`, "g");
      const matches = lowerText.match(regex);
      if (matches) negativeCount += matches.length;
    });

    if (positiveCount > negativeCount) {
      return {
        label: "Positive",
        score: positiveCount / (positiveCount + negativeCount),
      };
    } else if (negativeCount > positiveCount) {
      return {
        label: "Negative",
        score: negativeCount / (positiveCount + negativeCount),
      };
    } else {
      return { label: "Neutral", score: 0.5 };
    }
  };