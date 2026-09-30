/** Editorial demo articles for the Information Desk. General education only — no diagnosis, no treatment advice. */
export type Article = { id: string; category: string; title: string; description: string; body: string[] };

export const ARTICLES: Article[] = [
  // Veterinary Innovations
  { id: "ai-animal-care", category: "innovations", title: "How AI is changing the way animal health information reaches the veterinarian",
    description: "Photos, short videos, voice and structured intake — organised into a clear pre-visit case, while the veterinarian stays in charge.",
    body: [
      "Modern AI-assisted animal care is multimodal. An owner can describe a concern in their own words or by voice, add a photo of a skin change, or record a short video of how their animal walks or breathes.",
      "AI can help collect and organise this information: transcribing voice, reading visible text such as a medication label, describing what is observable in an image or video, and asking structured follow-up questions about duration, appetite, drinking and energy.",
      "Computer vision and language models can then prepare a structured pre-visit case and support routing — for example flagging possible warning signs so an owner is told to seek urgent care first.",
      "What AI does not do is diagnose. Observations are labelled as observations, owner reports stay owner reports, and clinical decisions and diagnosis remain the responsibility of the veterinarian. The value is a better-prepared visit, not a replacement for examination.",
    ] },
  { id: "pre-visit-case", category: "innovations", title: "Why a structured pre-visit case matters",
    description: "When the team knows who is coming, why, and what the owner has already shared, the appointment starts further along.",
    body: [
      "Many appointments begin with the same questions: when did it start, is the animal eating, has anything changed at home? Collecting these answers before the visit gives the veterinary team useful context.",
      "A structured case can include the pet profile, the owner-reported concern, intake answers, routing urgency, attached media and appointment details — each clearly labelled by source.",
      "The veterinarian still examines the animal and decides. Preparation simply helps the time together focus on care.",
    ] },
  // Nutrition
  { id: "balanced-routine", category: "nutrition", title: "Building a balanced feeding routine",
    description: "Consistency, appropriate portions and a food suited to your animal's species and life stage are the foundation.",
    body: [
      "A predictable routine helps many animals: similar feeding times, measured portions and a quiet place to eat.",
      "Choose food formulated for the species and life stage — needs differ between a growing puppy, an adult cat and a senior rabbit. Rabbits and guinea pigs, for example, rely on unlimited hay as the base of their diet.",
      "Treats add up. Many owners keep treats to a small share of daily intake so the main diet stays balanced.",
      "Your veterinarian can help you set portion sizes based on your animal's body condition and activity.",
    ] },
  { id: "feeding-schedules", category: "nutrition", title: "Understanding feeding schedules",
    description: "Meal frequency depends on species, age and lifestyle — here is what to consider.",
    body: [
      "Young animals often eat smaller, more frequent meals; many adult dogs do well on two meals a day, while cats often prefer several small portions.",
      "Grazing species such as rabbits and guinea pigs eat throughout the day, which is why constant access to hay and water matters.",
      "Changes in appetite are worth noting — a sudden drop in eating, especially in rabbits, is a reason to contact a veterinarian promptly.",
    ] },
  { id: "hydration", category: "nutrition", title: "Hydration: the nutrient owners forget",
    description: "Fresh water every day, placed where your animal actually drinks.",
    body: [
      "Provide fresh, clean water daily and clean bowls or bottles regularly. Some cats drink more from wide bowls or moving water.",
      "Wet food contributes to water intake. Hot weather, exercise and illness can all increase needs.",
      "A noticeable increase or decrease in drinking is useful information to share with your veterinarian.",
    ] },
  { id: "changing-food", category: "nutrition", title: "Changing food gradually",
    description: "A slow transition over about a week helps avoid digestive upset.",
    body: [
      "When switching foods, many owners mix a small amount of the new food with the old and increase the share over roughly 7–10 days.",
      "Watch appetite, droppings or stool, and energy during the change. If problems appear, pause and ask your veterinarian.",
      "Species with sensitive digestion, such as rabbits, need especially careful changes.",
    ] },
  { id: "diet-questions", category: "nutrition", title: "Questions to ask your veterinarian about diet",
    description: "A short list to bring to your next visit.",
    body: [
      "Is my animal at a healthy weight, and how many calories or what portion size fits them?",
      "Does their life stage or any existing condition change what they should eat?",
      "Which treats are appropriate, and how many?",
      "Are there foods that are unsafe for this species that I should avoid at home?",
    ] },
  // Vitamins & Supplements
  { id: "do-pets-need-supplements", category: "supplements", title: "Does my pet need a supplement?",
    description: "Most animals on a complete, balanced diet get what they need from their food.",
    body: [
      "Commercial complete diets are formulated to meet nutritional needs, so extra vitamins are often unnecessary.",
      "Supplements can be discussed for specific situations — for example life stage or a condition your veterinarian is managing — but that is an individual decision.",
      "Bring any supplement you are considering to your veterinarian so they can review it alongside your animal's diet and health.",
    ] },
  { id: "more-is-not-better", category: "supplements", title: "Why more is not always better",
    description: "Unnecessary supplementation can unbalance a diet.",
    body: [
      "Some vitamins and minerals can accumulate when given in excess, and combining several products can double up ingredients.",
      "Products made for humans may not be suitable for animals. Always check with a veterinarian before giving them.",
      "Keep a list of everything your animal receives, including chews and treats with added ingredients.",
    ] },
  { id: "species-differences", category: "supplements", title: "Species and age make a difference",
    description: "A guinea pig, a senior cat and a growing puppy have very different needs.",
    body: [
      "Guinea pigs, like people, cannot make their own vitamin C and depend on their diet for it — their food and fresh vegetables matter.",
      "Growing animals and seniors have different requirements from adults, and cats and dogs are not interchangeable.",
      "Your veterinarian can advise what, if anything, is appropriate for your individual animal.",
    ] },
  // Travel
  { id: "preparing-trip", category: "travel", title: "Preparing your pet for a trip",
    description: "Start early: carrier, routine, and a check that your animal is fit to travel.",
    body: [
      "Introduce the carrier or car restraint days or weeks ahead so it becomes familiar.",
      "Plan stops, check pet policies at accommodation and transport, and pack familiar bedding.",
      "A pre-travel check with your veterinarian is a good opportunity to ask about travel stress and any documentation you may need.",
    ] },
  { id: "food-water-travel", category: "travel", title: "Food and water while travelling",
    description: "Bring the usual food, plenty of water, and keep meals light before departure.",
    body: [
      "Pack enough of your animal's regular food for the whole trip plus extra, to avoid sudden diet changes.",
      "Offer water regularly and never leave an animal in a parked vehicle.",
      "Many owners feed a lighter meal a few hours before travel to reduce motion discomfort.",
    ] },
  { id: "carrier-stress", category: "travel", title: "Carriers and reducing travel stress",
    description: "A secure, well-ventilated carrier and a calm routine help most animals.",
    body: [
      "Choose a carrier where your animal can stand, turn and lie down, with good ventilation and a secure door.",
      "Cover part of the carrier to create a den-like space, keep noise low, and stay calm yourself.",
      "If your animal becomes very distressed when travelling, discuss options with your veterinarian before the next trip.",
    ] },
  { id: "vet-while-travelling", category: "travel", title: "Planning for a veterinary issue on the road",
    description: "Know where to go before you need it.",
    body: [
      "Before you leave, note veterinary and emergency clinics near your destination and along the route.",
      "Carry a copy of vaccination records, current medications and your veterinarian's contact details.",
      "Pack a basic travel kit and know the warning signs that mean seeking care immediately.",
    ] },
  // Documents
  { id: "id-microchip", category: "documents", title: "Identification and microchip records",
    description: "Make sure your animal can be identified and your contact details are current.",
    body: [
      "A collar tag with your phone number helps if your animal gets lost. Where microchips are used, keep the registration details up to date.",
      "Some destinations require a microchip of a particular standard, implanted before certain vaccinations — requirements vary.",
      "Keep the microchip number with your travel documents.",
    ] },
  { id: "vaccination-records", category: "documents", title: "Vaccination records and veterinary certificates",
    description: "Many trips require proof of vaccination and a recent health certificate.",
    body: [
      "Keep vaccination records in one place, with dates and product details as recorded by your veterinarian.",
      "Some destinations or carriers ask for a health certificate issued within a set number of days before travel.",
      "Timing can matter — some requirements must be completed weeks or months ahead.",
    ] },
  { id: "check-destination-rules", category: "documents", title: "Always check the rules for your destination",
    description: "Requirements differ by country, region and transport provider — there is no universal checklist.",
    body: [
      "Pet travel rules depend on where you are going, where you are coming from, and how you travel. What applies to one country does not apply everywhere.",
      "Check the official government guidance for your destination and your airline, ferry or rail operator well before the trip.",
      "Ask your veterinarian to help you plan the timeline for any required vaccinations, tests or certificates.",
    ] },
  // Animal World
  { id: "animal-senses", category: "news", title: "How animals see the world differently",
    description: "Editorial feature: from a dog's nose to a rabbit's near-360° view.",
    body: [
      "Dogs rely heavily on smell, which is far more sensitive than ours. Cats see well in low light. Rabbits have eyes positioned for a very wide field of view, helpful for spotting predators.",
      "Understanding these senses can help owners design calmer homes and more enriching play.",
    ] },
  { id: "enrichment", category: "news", title: "Enrichment: why play and variety matter",
    description: "Editorial feature on keeping companion animals mentally engaged.",
    body: [
      "Puzzle feeders, safe chew items, hiding places and time to explore can all provide mental stimulation.",
      "Enrichment looks different for each species — foraging for rabbits, sniffing walks for dogs, climbing and hunting-style play for cats.",
    ] },
  { id: "senior-companions", category: "news", title: "Living well with a senior companion animal",
    description: "Editorial feature on small home changes that help older pets.",
    body: [
      "Non-slip flooring, easier access to beds and litter trays, and gentle, regular activity can help older animals stay comfortable.",
      "Senior animals often benefit from more regular check-ups; your veterinarian can suggest how often.",
    ] },
];
