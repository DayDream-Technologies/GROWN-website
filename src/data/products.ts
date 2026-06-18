export type ProductCategory = "powder" | "seasoning" | "fresh";

export type ProductRecipe = {
  title: string;
  body: string;
};

export type Product = {
  id: string;
  name: string;
  subtitle?: string;
  size: string;
  shortDescription: string;
  priceOneTime: string;
  /** Display string; `null` when subscription is not offered */
  priceSubscription: string | null;
  fulfillment: string;
  servingLine?: string;
  longDescription: string;
  ingredients: string;
  recipes: ProductRecipe[];
  /** e.g. Hearty Harvest: pairing ideas separate from numbered recipes */
  suggestedUses?: string[];
  labelNotes?: string;
  extraNotes?: string[];
  category: ProductCategory;
  /** When true, card shows "Local only" and can be filtered */
  localOnly?: boolean;
  /**
   * When true, show inquiry form instead of cart and omit purchasable price parsing.
   * Used for fresh produce, microgreens trays, and any SKU priced manually off-site.
   */
  contactForPricing?: boolean;
};

export const products: Product[] = [
  {
    id: "elevated-brew-mushroom",
    name: "Elevated Brew",
    subtitle: "Powered by Mushrooms",
    size: "Net weight: 5 oz (28 servings)",
    shortDescription:
      "Refreshing mushroom coffee blend. Stir 1 scoop (1 tbsp) into 6 oz of hot water, stir and enjoy. Add ice to make iced coffee or add cream and sweetener. Helps with cognitive function, mood, and focus.",
    priceOneTime: "$28.99",
    priceSubscription: null,
    fulfillment: "Local & Delivery",
    servingLine: "28 servings — 1 scoop per serving (1 tbsp)",
    longDescription:
      "Refreshing mushroom coffee blend. Stir 1 scoop (1 tbsp) into 6 oz hot water; add ice or creamer as desired. Helps with cognitive function, mood, and focus. Sugar-free options available. Powered by mushroom complex.",
    ingredients:
      "Organic Instant Coffee (Arabica), Organic Lion's Mane Powder, Organic Reishi Powder, Organic Chaga Powder, Organic Cordyceps Powder, Organic Turkey Tail Powder, Organic Shiitake Powder, Organic Maitake Powder, Organic Mesima Powder, Organic Wood Ear Powder, Organic Oyster Powder.",
    recipes: [
      {
        title: "Brain-Power Mocha",
        body: "1 cup of Elevated Brew Coffee + 1 tbsp cocoa + 1/2 cup almond milk + sweetener.",
      },
      {
        title: "Mushroom Coffee Smoothie",
        body: "1 cup Elevated Brew Coffee (cooled) + frozen banana + 1 tbsp oats + 1 tbsp almond butter, blend.",
      },
      {
        title: "Iced Vanilla Mushroom Latte",
        body: "1 cup Elevated Brew Coffee + 1/2 cup oat milk + 1 tsp vanilla over ice.",
      },
    ],
    labelNotes:
      "Net weight, caffeine content, ingredient list, directions, allergen/processing, manufacturer.",
    category: "powder",
  },
  {
    id: "green-leaf",
    name: "Green Citrus Leaf",
    subtitle: "Powered by Microgreens",
    size: "Net weight: 4.2 oz",
    shortDescription:
      "Revitalize your day with a zesty burst of citrus goodness! Stir 1.5 scoops into 4–6 oz of water, add ice and enjoy. Adjust to taste.",
    priceOneTime: "$25.99",
    priceSubscription: null,
    fulfillment: "Local & Delivery",
    servingLine: "32 servings — 1.5 scoops (1.5 tsp) per serving",
    longDescription:
      "Enjoy the zesty goodness of our Green Citrus Leaf drink, combining organic lemon powder, organic lime powder, and hydroponic spinach microgreen powder. This invigorating blend delivers a refreshing citrus flavor while offering a boost of nutrients, making it a perfect choice for a revitalizing drink any time of day. Sugar-free, vegan, made with real fruit and veggies. Powered by microgreens.",
    ingredients:
      "Organic Lemon Powder, Organic Lime Powder, Organic Stevia Powder, Organic Spinach Powder, Hydroponic Microgreen Blend.",
    recipes: [
      {
        title: "Green Citrus Refresher",
        body: "1.5 scoops Green Citrus Leaf + 6 oz cold water + ice + lime wheel + mint; stir and enjoy.",
      },
      {
        title: "Citrus Green Smoothie",
        body: "1.5 scoops Green Citrus Leaf + 6 oz coconut water + 1/2 avocado + handful spinach + ice; blend until smooth.",
      },
      {
        title: "Energizing Spritz",
        body: "1.5 scoops Green Citrus Leaf + 4 oz sparkling water + 2 oz cold water + 1/4 tsp grated ginger + ice; stir and serve.",
      },
    ],
    labelNotes:
      "Net weight, ingredient list, serving size/directions, probiotic CFU if claimed, organic certification, allergen/processing statement, manufacturer info, lot & best-by.",
    category: "powder",
  },
  {
    id: "berry-gut-glow",
    name: "Strawberry Rosé",
    subtitle: "Powered by Microgreens",
    size: "Net weight: 4.2 oz (24 servings)",
    shortDescription:
      "Indulge in the refreshing slight sweetness of strawberries with a hint of lemon. Stir 2 tsp into 4–6 oz of water, add ice and enjoy. Adjust to taste.",
    priceOneTime: "$24.99",
    priceSubscription: null,
    fulfillment: "Local & Delivery",
    servingLine: "24 servings — 2 scoops (2 tsp) per serving",
    longDescription:
      "Experience the refreshing taste of our Strawberry Rosé drink, a delightful blend of hydroponic microgreen powder, organic strawberry powder, and organic lemon, sweetened naturally with stevia. This vibrant mix not only offers a delicious flavor but also packs a nutritional punch, providing essential vitamins and minerals to support your wellness. Sugar-free, vegan, made with real fruit and veggies. Powered by microgreens.",
    ingredients:
      "Organic Strawberry Powder, Organic Lemon Powder, Organic Stevia Powder, Hydroponic Microgreen Powder.",
    recipes: [
      {
        title: "Strawberry Rosé Cooler",
        body: "2 scoops Strawberry Rosé + 6 oz cold water + ice + splash lemon juice + basil leaf; stir and serve.",
      },
      {
        title: "Berry Oat Smoothie",
        body: "2 scoops Strawberry Rosé + 6 oz oat milk + 1/2 cup frozen berries + 1 tbsp flaxseed; blend until creamy.",
      },
      {
        title: "Rosé Chia Refresher",
        body: "2 scoops Strawberry Rosé + 6 oz water + 1 tbsp chia seeds (soak 5 min) + ice + sliced strawberries; stir and serve.",
      },
    ],
    labelNotes:
      "Net weight, ingredient list, serving size/directions, organic claims where applicable, allergen/processing, manufacturer.",
    category: "powder",
  },
  {
    id: "matcha-revival",
    name: "Matcha Revival",
    subtitle: "Powered by Matcha + Mushrooms",
    size: "Net weight: 5 oz (46 servings)",
    shortDescription:
      "Matcha + mushroom complex with microgreens for clean focus and calm energy. Stir 1.5 scoops (1.5 tsp) into 6 oz of hot water, add your choice of sweetener and enjoy. Can also be enjoyed iced.",
    priceOneTime: "$38.99",
    priceSubscription: null,
    fulfillment: "Local & Delivery",
    servingLine: "46 servings — 1.5 scoops (1.5 tsp) per serving",
    longDescription:
      "Matcha blended with a mushroom complex and microgreens for calm, focused energy. Prepare hot or iced.",
    ingredients:
      "Organic Matcha Green Tea Powder, Organic Lion's Mane Powder, Organic Reishi Powder, Organic Chaga Powder, Organic Maitake Powder, Organic Cordyceps Powder, Organic Turkey Tail Powder, Organic Shiitake Powder, Organic Stevia Powder, Hydroponic Microgreens Blend.",
    recipes: [
      {
        title: "Matcha Mushroom Latte",
        body: "1.5 tsp Matcha Revival + 1 cup warm milk, honey, whisk.",
      },
      {
        title: "Green Power Smoothie",
        body: "1.5 tsp Matcha Revival + banana + 1 cup spinach + 1 cup coconut water, blend.",
      },
      {
        title: "Matcha Oats",
        body: "1.5 tsp Matcha Revival + 1/2 cup oats + 1 cup oat milk, refrigerate overnight.",
      },
    ],
    labelNotes:
      "Net weight, caffeine disclosure, ingredient list, serving size, allergen/processing, manufacturer.",
    category: "powder",
  },
  {
    id: "golden-calm",
    name: "Golden Calm",
    subtitle: "Powered by Saffron + Botanicals",
    size: "Net weight: 24-48 g (18 servings)",
    shortDescription:
      "Soothing loose-leaf tea with chamomile, lavender, saffron, and microgreens. Add 3 scoops to a tea infuser and steep in hot water for about 4 minutes. Remove infuser and enjoy before bed to help wind down.",
    priceOneTime: "$39.99",
    priceSubscription: null,
    fulfillment: "Local & Delivery",
    servingLine: "18 servings — 3 scoops (3 tsp) per serving",
    longDescription:
      "Soothing loose-leaf tea with chamomile, lavender, saffron, and microgreens. Steep 3 scoops for ~4 minutes. Helps with mood and winding down for the night.",
    ingredients:
      "Organic chamomile, Organic lavender, Saffron Threads, Hydroponic Microgreens Blend.",
    recipes: [
      {
        title: "Bedtime Latte",
        body: "1 tbsp Golden Calm Tea + 8 oz warm milk (oat, almond, or dairy) + 1/2 tsp vanilla + monkfruit. Steep 5 minutes, strain, sip warm.",
      },
      {
        title: "Golden Calm Lemon Honey Shot",
        body: "Brew 2 tbsp in 4 oz hot water. Add 1 tsp honey + squeeze of lemon.",
      },
      {
        title: "Calm-Infused Simple Syrup",
        body: "Perfect for mocktails or drizzle over fruit. Simmer 1 cup water + 1 cup sugar, add 2 tbsp Golden Calm Tea, steep 10 minutes, strain.",
      },
    ],
    extraNotes: ["Not eligible for monthly subscription."],
    category: "powder",
  },
  {
    id: "lemon-zest",
    name: "Blue Lemon Zest",
    subtitle: "Powered by Spirulina + Lemon",
    size: "Net weight: 4.2 oz (32 servings)",
    shortDescription:
      "Refreshing blend with a boost from spirulina and lemon. Stir 1.5 scoops (1.5 tsp) into 4–6 oz of water, add ice and enjoy. Adjust to taste.",
    priceOneTime: "$35.00",
    priceSubscription: null,
    fulfillment: "Local & Delivery",
    servingLine: "32 servings — 1.5 scoops per serving",
    longDescription:
      "A refreshing lemon-forward drink powder enhanced with spirulina for color and nutrition. Sugar-free, vegan, made with real fruit and veggies. Powered by spirulina.",
    ingredients:
      "Organic Lemon Powder, Organic Spirulina Powder, Organic Monkfruit, Hydroponic Microgreens Blend.",
    recipes: [
      {
        title: "Zesty Mocktail",
        body: "1.5 scoops Blue Lemon Zest + 6 oz cold water + ice + lemon slice + fresh mint; stir over ice.",
      },
      {
        title: "Citrus Fizz Spritzer",
        body: "1.5 scoops Blue Lemon Zest + 4 oz sparkling water + 2 oz cold water + ice + cucumber ribbon; gently stir.",
      },
      {
        title: "Lemon Smooth Boost",
        body: "1.5 scoops Blue Lemon Zest + 6 oz almond milk + 1 frozen banana + handful ice; blend until smooth.",
      },
    ],
    extraNotes: ["Not eligible for monthly subscription."],
    category: "powder",
  },
  {
    id: "medi-green-salt",
    name: "Medi Green Salt",
    subtitle: "Powered by Microgreens",
    size: "4 oz (48 servings; 1/2 tsp per serving)",
    shortDescription:
      "Finishing green salt powered by freeze-dried microgreens and organic herbs.",
    priceOneTime: "",
    priceSubscription: null,
    fulfillment: "Local and shipping available",
    longDescription:
      "Medi Green Salt blends mineral-rich sea salt with oregano, basil, garlic, pepper, and freeze-dried microgreens for a clean, herbaceous finishing salt. Microgreens provide naturally concentrated vitamins and antioxidants, making each pinch both flavorful and nutrient-dense. Use as a table seasoning or finishing sprinkle on any dish. Each jar contains roughly 1/4 tray of freeze-dried microgreens, giving you a natural nutritional boost with every sprinkle.",
    ingredients:
      "Sea Salt, Organic Spinach Powder, Organic Oregano, Organic Basil, Organic Garlic Powder, Organic Black Pepper, Hydroponic Microgreen Blend.",
    recipes: [
      {
        title: "Roasted Potatoes",
        body: "Toss with oil + 1 tsp Medi Green Salt.",
      },
      {
        title: "Avocado Toast",
        body: "Sprinkle 1/4-1/2 tsp over toast + lemon.",
      },
      {
        title: "Simple Vinaigrette",
        body: "1/2 tsp + 3 tbsp oil + 1 tbsp vinegar, whisk.",
      },
    ],
    suggestedUses: [
      "Roasted potatoes",
      "Grilled vegetables",
      "Hummus",
      "Grain bowls",
      "Steamed greens",
    ],
    labelNotes:
      "Net weight, ingredient list, allergen/processing, directions/uses, manufacturer.",
    category: "seasoning",
  },
  {
    id: "garden-luxe-ranch",
    name: "Garden Luxe Ranch",
    subtitle: "Powered by Microgreens",
    size: "4 oz (48 servings; 1/2 tsp per serving)",
    shortDescription:
      "Creamy, herby vegan ranch seasoning with a microgreen nutrient boost.",
    priceOneTime: "",
    priceSubscription: null,
    fulfillment: "Local and shipping available",
    longDescription:
      "Garden Luxe Ranch recreates classic creamy ranch flavor using organic herbs, garlic, onion, and nutritional yeast for savory depth. Freeze-dried microgreens add concentrated vitamins and antioxidants, making this a flavorful and nutrient-forward seasoning. Perfect for dips, dressings, roasted vegetables, and everyday cooking. Each jar contains ~1/4 tray of freeze-dried microgreens so you get a nutritional boost.",
    ingredients:
      "Organic Nutritional Yeast, Organic Garlic Powder, Organic Onion Powder, Organic Dried Dill, Organic Dried Parsley, Organic Dried Chives, Organic Black Pepper, Organic Sea Salt, Hydroponic Microgreen Blend.",
    recipes: [
      {
        title: "Classic Vegan Ranch Dip",
        body: "2 tbsp seasoning + 1/2 cup vegan mayo/silken tofu + 1/4 cup plant milk, chill.",
      },
      {
        title: "Ranch Dressing",
        body: "1 tbsp seasoning + 3 tbsp olive oil + 1 tbsp apple cider vinegar + 3 tbsp plant yogurt.",
      },
      {
        title: "Ranch Roasted Cauliflower",
        body: "Toss florets with oil + 1-2 tsp seasoning, roast.",
      },
    ],
    suggestedUses: [
      "Roasted potatoes",
      "Veggie sticks",
      "Sandwiches",
      "Grain bowls",
      "Cauliflower wings",
    ],
    labelNotes:
      "Net weight, ingredient list, directions, allergen/processing, manufacturer.",
    category: "seasoning",
  },
  {
    id: "salsa-verde-zest",
    name: "Salsa Verde Zest",
    subtitle: "Powered by Microgreens",
    size: "4 oz (48 servings; 1/2 tsp per serving)",
    shortDescription:
      "Bright, cilantro-lime salsa verde seasoning with a microgreen lift.",
    priceOneTime: "",
    priceSubscription: null,
    fulfillment: "Local and shipping available",
    longDescription:
      "This plant-based Salsa Verde seasoning captures the bright, citrus-herb profile of traditional salsa verde using organic cilantro, lime, cumin, and oregano. Freeze-dried microgreens add naturally concentrated nutrients, making it a clean, flavorful way to season salsas, marinades, and dressings. Each jar contains roughly 1/4 tray of freeze-dried microgreens, giving you a natural nutritional boost with every sprinkle.",
    ingredients:
      "Organic Dried Cilantro, Organic Lime Zest (powder), Organic Garlic Powder, Organic Cumin, Organic Dried Oregano, Organic Sea Salt, Organic Black Pepper, Hydroponic Microgreen Blend.",
    recipes: [
      {
        title: "Quick Salsa Verde",
        body: "2 tbsp seasoning + 3 tbsp water + 2 tbsp olive oil + diced tomato.",
      },
      {
        title: "Salsa Verde Marinade",
        body: "1 tbsp seasoning + 2 tbsp lime juice + 2 tbsp oil for tofu/tempeh.",
      },
      {
        title: "Avocado Salsa",
        body: "Mash avocado + 1 tsp seasoning + lime juice.",
      },
    ],
    suggestedUses: [
      "Tacos",
      "Roasted sweet potatoes",
      "Grilled vegetables",
      "Black bean bowls",
      "Avocado toast",
    ],
    labelNotes:
      "Net weight, ingredient list, directions, allergen/processing, manufacturer.",
    category: "seasoning",
  },
  {
    id: "harvest-pesto-blend",
    name: "Harvest Pesto Blend",
    subtitle: "Powered by Microgreens",
    size: "4 oz (48 servings; 1/2 tsp per serving)",
    shortDescription:
      "Shelf-stable pesto seasoning: basil, nutritional yeast, and ground seeds for quick pesto flavor.",
    priceOneTime: "",
    priceSubscription: null,
    fulfillment: "Local and shipping available",
    longDescription:
      "Harvest Pesto delivers the basil-forward flavor of pesto in a convenient, shelf-stable blend. Nutritional yeast and ground seeds add creamy umami depth, while freeze-dried microgreens contribute concentrated vitamins and antioxidants. Use as an instant sauce base, spread, or finishing seasoning. Each jar contains roughly 1/4 tray of freeze-dried microgreens, giving you a natural nutritional boost with every sprinkle.",
    ingredients:
      "Organic Nutritional Yeast, Organic Dried Basil, Organic Dried Oregano, Organic Garlic Powder, Organic Pine Nuts (or Organic Sunflower Seeds), Organic Sea Salt, Organic Black Pepper, Hydroponic Microgreen Blend.",
    recipes: [
      {
        title: "Quick Pesto Pasta",
        body: "2 tbsp seasoning + 3 tbsp olive oil + 2 tbsp water, toss with pasta.",
      },
      {
        title: "Pesto Toast",
        body: "1 tsp seasoning + olive oil, spread on toast with tomato.",
      },
      {
        title: "Pesto Hummus",
        body: "1 tbsp seasoning stirred into hummus.",
      },
    ],
    suggestedUses: [
      "Pasta",
      "Roasted potatoes",
      "Grilled vegetables",
      "Bruschetta",
      "Pizza finish",
    ],
    labelNotes:
      "Net weight, ingredient list, allergen (nuts if pine nuts used), directions, manufacturer.",
    category: "seasoning",
  },
  {
    id: "ice-balls-frozen",
    name: "Ice Balls (frozen)",
    size: "12-pack frozen ice balls (herb/fruit inclusions)",
    shortDescription:
      "Decorative flavored frozen ice balls (mint/lemon/basil or mint/lime/basil) for drinks.",
    priceOneTime: "Contact for pricing",
    priceSubscription: null,
    fulfillment: "Local only (fresh/frozen)",
    longDescription:
      "Hand-made frozen ice balls with fresh herbs and citrus for elevated beverages and events. We use farm-fresh mint, basil and citrus to create beautiful, flavorful ice - sustainable, local and perfect for entertaining. Freeze-dried herb options may be available - ask when you reach out.",
    ingredients:
      "Fresh mint leaves, lemon or lime slices, basil leaves, filtered water.",
    recipes: [
      { title: "Garnish cocktails", body: "Add to cocktails for aroma and chill." },
      { title: "Iced tea", body: "Float in iced tea for a refreshing presentation." },
      { title: "Summer mocktails", body: "Use in lemonades and spritzers." },
    ],
    labelNotes: "Local produce statement, refrigeration instructions.",
    category: "fresh",
    localOnly: true,
    contactForPricing: true,
  },
  {
    id: "fresh-butter-lettuce",
    name: "Fresh Produce - Butter Lettuce",
    size: "12 heads per order",
    shortDescription: "Fresh locally grown butter lettuce.",
    priceOneTime: "Contact for pricing",
    priceSubscription: null,
    fulfillment: "Local only (Michigan)",
    longDescription:
      "Tender, sweet butter lettuce grown locally. Perfect for family salads and sandwiches - sustainably grown and harvested fresh.",
    ingredients: "Fresh butter lettuce.",
    recipes: [
      { title: "Simple salad", body: "Wash, tear, dress with vinaigrette." },
      { title: "Lettuce wraps", body: "Fill leaves with protein, rice, and veg." },
      { title: "BLT with butter lettuce", body: "Layer with tomato, bacon, and mayo on soft leaves." },
    ],
    labelNotes: "Local, harvest date, storage instructions.",
    category: "fresh",
    localOnly: true,
    contactForPricing: true,
  },
  {
    id: "microgreens-full-tray",
    name: "Microgreens (full tray)",
    subtitle: "Pea, Radish, Spicy Salad, Broccoli, Arugula, Mustard",
    size: 'One full 10"x20" tray (contact us for availability)',
    shortDescription:
      "Fresh microgreen trays grown locally; also available freeze-dried for powders.",
    priceOneTime: "Contact for pricing",
    priceSubscription: null,
    fulfillment: "Local only",
    longDescription:
      "Fresh microgreens harvested at peak nutrient density - pea, radish, spicy salad, broccoli, arugula and mustard. Microgreens are tiny nutrition powerhouses (vitamins, minerals, antioxidants); we also freeze-dry surplus greens to make shelf-stable powders so families can access produce nutrition year-round. Sustainable, flavor-rich and perfect for busy households and restaurants. Pricing, subscriptions, and wholesale are handled directly - reach out via the form and we will reply with options.",
    ingredients: "Live microgreens (variety).",
    recipes: [
      { title: "Garnish salads", body: "Top finished salads for crunch and flavor." },
      { title: "Blend into smoothies", body: "Add a handful to green smoothies." },
      { title: "Fold into scrambled eggs", body: "Stir in at the end of cooking." },
    ],
    labelNotes: "Variety, harvest date, storage & shelf life, local farm origin.",
    extraNotes: [
      "Harvest and packaging add-ons available for restaurant orders - ask when you reach out.",
    ],
    category: "fresh",
    localOnly: true,
    contactForPricing: true,
  },
  {
    id: "fresh-rosemary",
    name: "Rosemary (fresh)",
    size: "0.5 lb bunches",
    shortDescription: "Fresh rosemary for cooking and aromatics.",
    priceOneTime: "Contact for pricing",
    priceSubscription: null,
    fulfillment: "Local",
    longDescription:
      "Fragrant, fresh rosemary grown locally - ideal for roasting, marinades and infused oils. We supply both retail and restaurant customers with consistent weekly harvests.",
    ingredients: "Fresh rosemary.",
    recipes: [
      { title: "Roast potatoes", body: "Toss with oil, salt, and chopped rosemary." },
      { title: "Herbed roast chicken", body: "Stuff cavity and rub skin with rosemary." },
      { title: "Rosemary focaccia", body: "Press sprigs into dimpled dough before baking." },
    ],
    labelNotes: "Local origin, harvest date, storage.",
    category: "fresh",
    contactForPricing: true,
  },
  {
    id: "fresh-dill",
    name: "Fresh Dill",
    size: "Sold by lb (bundles)",
    shortDescription: "Fresh dill for culinary uses.",
    priceOneTime: "Contact for pricing",
    priceSubscription: null,
    fulfillment: "Local",
    longDescription:
      "Bright, delicate dill harvested locally - perfect for dressings, pickles, fish and potato salads.",
    ingredients: "Fresh dill.",
    recipes: [
      { title: "Dill dip", body: "Stir chopped dill into yogurt or sour cream." },
      { title: "Potato salad", body: "Fold into warm potatoes with mustard and celery." },
      { title: "Dill pickles", body: "Pack spears in brine with dill heads." },
    ],
    labelNotes: "Local origin, storage.",
    category: "fresh",
    contactForPricing: true,
  },
  {
    id: "fresh-italian-parsley",
    name: "Italian Parsley",
    size: "1 lb",
    shortDescription: "Fresh Italian parsley for culinary uses.",
    priceOneTime: "Contact for pricing",
    priceSubscription: null,
    fulfillment: "Local only",
    longDescription:
      "Fresh, robust Italian parsley - versatile and nutrient-dense, great for gremolata, salads and finishing.",
    ingredients: "Fresh Italian parsley.",
    recipes: [
      { title: "Gremolata", body: "Mince with lemon zest and garlic for topping." },
      { title: "Tabbouleh", body: "Chop fine with bulgur, tomato, and mint." },
      { title: "Chimichurri", body: "Blend with oil, vinegar, and garlic for steak." },
    ],
    labelNotes: "Local origin, storage.",
    category: "fresh",
    localOnly: true,
    contactForPricing: true,
  },
  {
    id: "fresh-mint",
    name: "Mint",
    size: "0.5 lb",
    shortDescription: "Fresh mint for beverages and cooking.",
    priceOneTime: "Contact for pricing",
    priceSubscription: null,
    fulfillment: "Local only",
    longDescription:
      "Cooling, aromatic mint for cocktails, teas and cooking - grown and harvested locally then packaged fresh. Freeze-dried herb options may be available through our pantry line - ask when you reach out.",
    ingredients: "Fresh mint.",
    recipes: [
      { title: "Mint iced tea", body: "Steep leaves with black tea, chill, sweeten." },
      { title: "Mojito mocktail", body: "Muddle with lime, syrup, and soda." },
      { title: "Mint pesto", body: "Blend with nuts, oil, and parmesan alternative." },
    ],
    labelNotes: "Local origin, storage.",
    category: "fresh",
    localOnly: true,
    contactForPricing: true,
  },
  {
    id: "fresh-basil",
    name: "Basil",
    size: "1 lb",
    shortDescription: "Fresh sweet basil for culinary use.",
    priceOneTime: "Contact for pricing",
    priceSubscription: null,
    fulfillment: "Local only",
    longDescription:
      "Vibrant, aromatic basil grown locally - ideal for pesto, salads and finishing dishes. Shelf-stable freeze-dried basil may be available as a pantry item - ask when you reach out.",
    ingredients: "Fresh basil.",
    recipes: [
      { title: "Classic pesto", body: "Blend with pine nuts, garlic, oil, and cheese." },
      { title: "Caprese salad", body: "Layer with tomato and mozzarella." },
      { title: "Basil-lemon vinaigrette", body: "Whisk with lemon juice and olive oil." },
    ],
    labelNotes: "Local origin, storage.",
    category: "fresh",
    localOnly: true,
    contactForPricing: true,
  },
  {
    id: "fresh-baby-kale",
    name: "Baby Kale",
    size: "By the pound; weekly route options (contact us for sizing and minimums)",
    shortDescription:
      "Tender, nutrient-dense baby kale for salads and cooking.",
    priceOneTime: "Contact for pricing",
    priceSubscription: null,
    fulfillment: "Local only",
    longDescription:
      "Fresh baby kale harvested young for tender texture and high nutrient content - ideal for salads, smoothies and sautes. We grow sustainably and offer weekly delivery for regular customers.",
    ingredients: "Fresh baby kale.",
    recipes: [
      { title: "Kale salad with lemon tahini", body: "Massage with dressing, add toppings." },
      { title: "Kale smoothie", body: "Blend with fruit and liquid base." },
      { title: "Sauteed garlic kale", body: "Quick saute with garlic and oil." },
    ],
    extraNotes: [
      "Weekly bulk delivery available - share your route needs in the form.",
    ],
    category: "fresh",
    localOnly: true,
    contactForPricing: true,
  },
];

export const featuredProductIds: string[] = [
  "green-leaf",
  "elevated-brew-mushroom",
  "berry-gut-glow",
];

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

/** Short line for product cards */
export function getFulfillmentBadge(p: Product): string {
  if (p.localOnly) return "Local only";
  const f = p.fulfillment;
  if (/can ship|shipping available/i.test(f) && /local/i.test(f)) {
    return "Local & shipping";
  }
  if (/michigan/i.test(f)) return "Local (Michigan)";
  if (/local only/i.test(f)) return "Local only";
  if (/^local$/i.test(f.trim())) return "Local";
  return f.length > 40 ? `${f.slice(0, 37)}...` : f;
}
