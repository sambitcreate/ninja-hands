// Hardcoded zen master responses for different game outcomes
const zenResponses = {
  // High score responses (score > 100)
  highScore: [
    "The blade becomes an extension of thought. Pure flow state achieved.",
    "In the emptiness between slices, you found perfection. The mind is clear.",
    "Your movements dance between form and void. True mastery revealed.",
    "The path of the blade traces the circle of enlightenment. Exceptional focus.",
    "Like water, your hand flows through targets. No resistance, only existence."
  ],
  
  // Medium score responses (score 50-100)
  mediumScore: [
    "The blade finds its mark, yet the mind hesitates. Good practice continues.",
    "Between targets, moments of clarity appear. You are learning the way.",
    "Your form improves with each slice. The journey of a thousand cuts begins with one.",
    "The hand moves with purpose, but the spirit seeks stillness. Keep training.",
    "Efficiency grows in your movements. The void welcomes your progress."
  ],
  
  // Low score responses (score < 50)
  lowScore: [
    "The blade moves, but the mind wanders. Return to the beginning with focus.",
    "In chaos, there is opportunity. Find the calm between the slices.",
    "Each miss teaches patience. The master was once a student.",
    "The hand must learn to listen before it can speak through the blade.",
    "True skill comes from emptiness. Clear your mind, try again."
  ],
  
  // Bomb hit responses
  bombHit: [
    "The explosion shatters the harmony. Peace disrupted by carelessness.",
    "In the pursuit of speed, you touched destruction. Mindfulness brings wisdom.",
    "The bomb teaches the price of distraction. Stillness prevents chaos.",
    "Your blade confused target with threat. The way requires discernment.",
    "Violence begets violence. The peaceful warrior knows what to cut."
  ],
  
  // No targets sliced
  noTargets: [
    "The blade remained sheathed. Opportunity passed like clouds in the wind.",
    "Hesitation kept the hand still. Action requires courage and commitment.",
    "The empty canvas awaits your first stroke. Begin with intention.",
    "In stillness, there is potential. Movement reveals your true nature.",
    "The master sees all targets. The student must first learn to see."
  ]
};

// Helper function to get random response from array
const getRandomResponse = (responses: string[]): string => {
  return responses[Math.floor(Math.random() * responses.length)];
};

export const generateSenseiFeedback = async (score: number, slicedCount: number, bombHit: boolean) => {
  // Determine which response category to use based on game outcome
  if (bombHit) {
    return getRandomResponse(zenResponses.bombHit);
  }
  
  if (slicedCount === 0) {
    return getRandomResponse(zenResponses.noTargets);
  }
  
  if (score > 100) {
    return getRandomResponse(zenResponses.highScore);
  }
  
  if (score >= 50) {
    return getRandomResponse(zenResponses.mediumScore);
  }
  
  return getRandomResponse(zenResponses.lowScore);
};