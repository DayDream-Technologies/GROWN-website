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
  longDescription: string;
  ingredients: string;
  recipes: ProductRecipe[];
  /** e.g. Hearty Harvest: pairing ideas separate from numbered recipes */
  suggestedUses?: string[];
  labelNotes?: string;
  extraNotes?: string[];
  category: ProductCategory;
  /** When true, card shows “Local only” and can be filtered */
  localOnly?: boolean;
};

export const products: Product[] = [
  {
    id: "immunity-smoothie-booster",
    name: "Immunity Smoothie Booster",
    subtitle: "Pure greens",
    size: "6 oz bottle",
    shortDescription:
      "Freeze-dried microgreens + supergreens powder to support immunity and daily nutrition.",
    priceOneTime: "$28.99",
    priceSubscription: "$27.99",
    fulfillment: "Local and shipping available",
    longDescription:
      "A concentrated greens powder made from rescued, freeze-dried microgreens (nature's multivitamin) blended with organic broccoli, alfalfa grass, kale, spinach, spirulina and wheatgrass plus inulin, ashwagandha, panax ginseng and Bacillus subtilis probiotic. A little powder goes a long way — microgreens pack vitamins, minerals and antioxidants; spirulina brings protein, iron and antioxidants; greens support immunity and cellular health. We turn farm surplus microgreens into shelf-stable nutrition so busy families get fresh produce benefits in seconds — clean ingredients, sustainable sourcing, delicious flavor.",
    ingredients:
      "Organic Broccoli powder, Organic Alfalfa Grass powder, Organic Kale powder, Organic Spinach powder, Organic Spirulina, Organic Wheatgrass, Organic Inulin, Organic Ashwagandha, Organic Panax Ginseng, Hydroponic microgreen powder (freeze-dried), Bacillus subtilis, natural flavor (if any).",
    recipes: [
      {
        title: "Immunity Smoothie",
        body: "1 scoop + 1 banana + 1 cup almond milk + 1/2 cup berries — blend.",
      },
      {
        title: "Green Yogurt Bowl",
        body: "1 scoop stirred into 6 oz yogurt, top with granola & fruit.",
      },
      {
        title: "Veggie Soup Boost",
        body: "1 tsp stirred into 1 cup hot vegetable broth for savory nutrient boost.",
      },
    ],
    labelNotes:
      "Net weight (6.2 oz), ingredient list, serving size/directions, probiotic CFU if claimed, organic certification, allergen/processing statement, manufacturer info, lot & best-by.",
    category: "powder",
  },
  {
    id: "energy-booster-mushroom-matcha",
    name: "Energy Booster",
    subtitle: "Mushroom Matcha",
    size: "6 oz bottle",
    shortDescription:
      "Ceremonial matcha blended with adaptogenic mushroom complex + microgreens for steady focus.",
    priceOneTime: "$22.99",
    priceSubscription: "$21.99",
    fulfillment: "Local and shipping available",
    longDescription:
      "Dual-action everyday energy: ceremonial matcha (natural caffeine + catechins) combined with Lion's Mane, Reishi, Chaga, Maitake, Cordyceps, Turkey Tail and Shiitake to support focus, cognitive resilience and balanced energy. Freeze-dried microgreens amplify nutrient density — a small scoop delivers whole-food vitamins and antioxidants. We convert farm surplus microgreens into shelf-stable powder for sustainable, family-friendly nutrition that tastes great and keeps you productive without the crash.",
    ingredients:
      "Organic Matcha Green Tea; Organic Lion's Mane; Organic Reishi; Organic Chaga; Organic Maitake; Organic Cordyceps; Organic Turkey Tail; Organic Shiitake; Freeze-dried Microgreen Powder.",
    recipes: [
      {
        title: "Matcha Mushroom Latte",
        body: "1 tsp + 1 cup warm milk, whisk.",
      },
      {
        title: "Green Power Smoothie",
        body: "1 tsp + banana + 1 cup spinach + 1 cup coconut water, blend.",
      },
      {
        title: "Matcha Oats",
        body: "1 tsp + 1/2 cup oats + 1 cup oat milk, refrigerate overnight.",
      },
    ],
    labelNotes:
      "Net wt (6 oz), caffeine disclosure, ingredient list, serving size, allergen/processing, manufacturer.",
    category: "powder",
  },
  {
    id: "mushroom-coffee",
    name: "Mushroom Coffee",
    size: "8 oz bag",
    shortDescription:
      "Instant Arabica coffee blended with a 10-mushroom complex and microgreens for mental clarity and immune support.",
    priceOneTime: "$17.99",
    priceSubscription: "$15.99 / month",
    fulfillment: "Local and shipping available",
    longDescription:
      "A flavorful medium-roast instant Arabica coffee enhanced with Lion's Mane, Reishi, Chaga, Cordyceps, Turkey Tail, Shiitake, Maitake, Mesima, Wood Ear and Oyster mushrooms plus freeze-dried microgreens. Mushrooms support cognitive function and immune resilience; microgreens add concentrated vitamins and antioxidants, turning your morning cup into a nutrient delivery. We use farm-rescued microgreens to create sustainable, shelf-stable functional coffee for busy families who want convenience and clean ingredients.",
    ingredients:
      "Organic Instant Arabica Coffee; Organic Lion's Mane; Organic Reishi; Organic Chaga; Organic Cordyceps; Organic Turkey Tail; Organic Shiitake; Organic Maitake; Organic Mesima; Organic Wood Ear; Organic Oyster; Freeze-dried Microgreens.",
    recipes: [
      {
        title: "Brain-Power Mocha",
        body: "Brewed coffee + 1 tbsp cocoa + 1/2 cup almond milk + sweetener.",
      },
      {
        title: "Mushroom Coffee Smoothie",
        body: "1 cup cooled brewed coffee + frozen banana + 1 tbsp oats + 1 tbsp almond butter, blend.",
      },
      {
        title: "Iced Vanilla Mushroom Latte",
        body: "Chilled coffee + 1/2 cup oat milk + 1 tsp vanilla over ice.",
      },
    ],
    labelNotes:
      "Net wt (8 oz), caffeine content, ingredient list, directions, allergen/processing, manufacturer.",
    category: "powder",
  },
  {
    id: "gut-smoothie-booster",
    name: "Gut Smoothie Booster",
    subtitle: "Red & Green Gut Smoothie Blend",
    size: "6 oz bottle",
    shortDescription:
      "Prebiotic + fiber + antioxidant veggie/fruit blend with microgreens and probiotics to support digestion.",
    priceOneTime: "$23.74",
    priceSubscription: "$21.53 / month",
    fulfillment: "Local and shipping available",
    longDescription:
      "A full-spectrum gut formula combining FiberSMART® prebiotics, a broad garden vegetable & superfruit antioxidant blend, soluble/insoluble fibers, enzymes and a dairy-free probiotic. Freeze-dried microgreens concentrate vitamins and phytonutrients so each scoop amplifies digestion, microbiome balance and immune support. We rescue microgreens from our farm and transform them into shelf-stable nutrition — an easy, tasty way for busy families to get real produce benefits daily.",
    ingredients:
      "Organic Prebiotic Blend (acacia gum, guar, inulin types); Organic Garden Vegetable & Superfruit Blend (beet, apple, barley grass, amla, moringa, alfalfa sprouts, chlorella, spirulina, berries, carrot, broccoli, kale, spinach, etc.); Organic Soluble/Insoluble Fiber (oat fiber, flaxseed); Organic Fruit Blend; Focus/Adaptogen Blend; Enzyme Blend; Probiotic Blend; Citric Acid; Organic Stevia extract; Freeze-dried Microgreens.",
    recipes: [
      {
        title: "Berry Gut Smoothie",
        body: "1 scoop + 1 cup mixed berries + 1 cup almond milk + 1 tbsp chia seeds, blend.",
      },
      {
        title: "Tropical Digestive Smoothie",
        body: "1 scoop + 1/2 banana + 1/2 cup pineapple + 1 cup coconut milk, blend.",
      },
      {
        title: "Green Detox Shake",
        body: "1 scoop + 1/2 avocado + 1 cup spinach + 1 cup cucumber juice, blend.",
      },
    ],
    category: "powder",
  },
  {
    id: "blue-spirulina-refresher",
    name: "Blue Spirulina Refresher",
    size: "6 oz bottle",
    shortDescription:
      "Blue spirulina + grasses + tropical fruit powders and microgreens for a nutrient-dense, refreshing spritz.",
    priceOneTime: "$27.99",
    priceSubscription: "$24.99 / month",
    fulfillment: "Local and shipping available",
    longDescription:
      "Bright, nutrient-dense blue spirulina provides concentrated protein, vitamins and antioxidants. Paired with wheatgrass, barley grass, chlorella, baobab, passion fruit and freeze-dried microgreens, this spritz supports energy, detox and immune health. Microgreens magnify fresh-produce micronutrients so small servings deliver real nutrition. We transform surplus microgreens into shelf-stable powder for sustainable, family-friendly superfood drinks that taste great.",
    ingredients:
      "Organic Blue Spirulina; Organic Wheatgrass; Organic Barley Grass; Organic Lemon Powder; Organic Chlorella; Organic Passion Fruit Juice Powder; Organic Baobab Fruit Powder; Organic Pineapple Juice Powder; Organic Mint; Organic Blackberry; Organic Coconut powder; Organic VitaFiber; Organic Stevia Leaf Extract; Organic Monk Fruit Extract; Natural Flavors; Malic Acid; Freeze-dried Microgreen Powder.",
    recipes: [
      {
        title: "Blue Spritz Refresher",
        body: "1 scoop + 1 cup water + ice, shake.",
      },
      {
        title: "Lemon Spirulina Cooler",
        body: "1 scoop + 1 cup lemonade + mint garnish.",
      },
      {
        title: "Spirulina Power Smoothie",
        body: "1 scoop + 1 banana + 1/2 cup pineapple + 1 cup coconut milk, blend.",
      },
    ],
    labelNotes:
      "Net wt, ingredient list, directions, organic claims, allergen note for coconut, storage.",
    category: "powder",
  },
  {
    id: "lemon-dragon-fruit-refresher",
    name: "Lemon Dragon Fruit Refresher",
    size: "6 oz jar",
    shortDescription:
      "Tangy lemon + raspberry/dragonfruit powder with microgreens for antioxidant and vitamin C support.",
    priceOneTime: "$23.99",
    priceSubscription: "$22.99 / month",
    fulfillment: "Local and shipping available",
    longDescription:
      "A bright, zesty blend of raspberry/dragonfruit and lemon, boosted with freeze-dried microgreens to concentrate vitamins and antioxidants. Perfect for refreshing drinks, smoothies and recipes — a little powder adds meaningful fresh-produce nutrition for busy families. We turn leftover microgreens into freeze-dried powder for sustainable, shelf-stable flavor and nutrition.",
    ingredients: "Raspberry powder; Lemon powder; Freeze-dried Microgreens.",
    recipes: [
      {
        title: "Lemon Raspberry Smoothie",
        body: "1 scoop + 1 banana + 1 cup almond milk + 1/2 cup spinach, blend.",
      },
      {
        title: "Zesty Mocktail",
        body: "1 scoop + 1 cup seltzer + lemon slice + mint, stir over ice.",
      },
      {
        title: "Chia Pudding",
        body: "1 scoop + 1/4 cup chia seeds + 1 cup almond milk + 1 tbsp maple syrup, refrigerate.",
      },
    ],
    category: "powder",
  },
  {
    id: "saffron-calm-refresher",
    name: "Saffron Calm Refresher",
    subtitle: "Saffron Calm",
    size: "6 oz bottle",
    shortDescription:
      "Botanical relaxation blend with passion flower, lavender, chamomile, saffron, L-theanine and soluble tapioca fiber.",
    priceOneTime: "TBD",
    priceSubscription: "TBD",
    fulfillment: "Local and shipping available",
    longDescription:
      "A gentle botanical formula for calm and balance. Passion flower, lavender and chamomile promote relaxation; saffron and L-theanine support mood and mental clarity; FiberSMART® tapioca fiber aids digestive comfort and provides a mild prebiotic. Freeze-dried microgreens add a subtle nutrient boost so every serving combines soothing botanicals with real produce nutrition. Designed for busy families seeking restful rituals without drowsiness — clean, sustainably sourced, shelf-stable.",
    ingredients:
      "Potassium (as potassium citrate) 20 mg; FiberSMART® Soluble Tapioca Fiber 4,440 mg; Passion Flower Extract (Passiflora incarnata) 250 mg; Lavender (aerial) 50 mg; Chamomile Extract 50 mg; Saffron Extract 45 mg; L-Theanine 20 mg; plus freeze-dried microgreens (if included).",
    recipes: [
      {
        title: "Evening Calm Latte",
        body: "1 heaping tsp + 6–8 oz warmed milk, whisk.",
      },
      {
        title: "Citrus Chamomile Cooler",
        body: "1 heaping tsp + 6 oz cold water/tea + 1 oz lemon, shake with ice.",
      },
      {
        title: "Bedtime Yogurt Parfait",
        body: "1 heaping tsp stirred into 6 oz yogurt, top with berries & granola.",
      },
    ],
    extraNotes: ["Per-unit cost: TBD (price TBD)."],
    category: "powder",
  },
  {
    id: "hearty-harvest-blend",
    name: "Hearty Harvest Blend",
    size: "4 oz jar",
    shortDescription:
      "Savory dry broth seasoning of herbs, aromatics, nutritional yeast and pea microgreens for umami and micronutrients.",
    priceOneTime: "$14.99",
    priceSubscription: "$14.15",
    fulfillment: "Local and shipping available",
    longDescription:
      "Warm and savory with organic herbs, nutritional yeast for umami, and a touch of freeze-dried pea microgreens for micronutrient density. Clean, pantry-friendly, and versatile — use as instant broth, seasoning for grains, or a flavor lift in sauces. We repurpose excess microgreens into shelf-stable blends so families get fresh produce nutrition without waste.",
    ingredients:
      "Pea microgreens (freeze-dried), nutritional yeast, organic thyme, organic rosemary, organic sage, organic garlic powder, organic onion powder, organic celery seed, white pepper, sea salt.",
    recipes: [
      {
        title: "Umami Grain Bowl",
        body: "1 tsp blended into tahini dressing, toss with grains & roasted veg.",
      },
    ],
    suggestedUses: [
      "Roasted root vegetables",
      "Lentil stews",
      "Mashed potatoes",
      "Baked tofu",
      "Warm grain bowls",
    ],
    labelNotes:
      "Net wt, ingredient list, directions/serving, allergen/processing, manufacturer.",
    category: "seasoning",
  },
  {
    id: "medi-green-salt",
    name: "Medi Green Salt",
    size: "4 oz jar",
    shortDescription:
      "Finishing salt blended with freeze-dried pea microgreens and organic herbs for bright, nutrient-forward flavor.",
    priceOneTime: "$14.99",
    priceSubscription: "$14.15",
    fulfillment: "Local and shipping available",
    longDescription:
      "A savory finishing salt powered by freeze-dried microgreens and organic herb powders that adds bright green flavor and a micronutrient bump to everyday dishes. Great on roasted veg, grains, avocado toast and more — clean ingredients, no fillers. We use rescued microgreens to create shelf-stable pantry staples that deliver real produce benefits.",
    ingredients:
      "Pea microgreens (1.5 tsp formula), spinach powder, organic oregano, organic basil, organic garlic powder, organic black pepper, sea salt.",
    recipes: [
      {
        title: "Roasted Potatoes",
        body: "Toss with oil + 1 tsp Medi Green Salt.",
      },
      {
        title: "Avocado Toast",
        body: "Sprinkle 1/4–1/2 tsp over toast + lemon.",
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
      "Net wt, ingredient list, allergen/processing, directions/uses, manufacturer.",
    category: "seasoning",
  },
  {
    id: "plant-based-ranch-seasoning",
    name: "Plant-Based Ranch Seasoning",
    size: "4 oz jar",
    shortDescription:
      "Vegan ranch seasoning with nutritional yeast, organic herbs and pea microgreens.",
    priceOneTime: "$10.99",
    priceSubscription: "$10.15",
    fulfillment: "Local and shipping available",
    longDescription:
      "A dry, clean vegan ranch brightened with organic herbs, nutritional yeast for savory depth and freeze-dried microgreens for extra micronutrients — great for dips, dressings and roasted veg. We convert farm microgreens into shelf-stable seasonings so families get fresh-produce nutrition in pantry form.",
    ingredients:
      "Organic nutritional yeast; organic garlic powder; organic onion powder; organic dried dill; organic dried parsley; organic dried chives; black pepper; sea salt; freeze-dried pea microgreens.",
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
        body: "Toss florets with oil + 1–2 tsp seasoning, roast.",
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
      "Net wt, ingredient list, directions, allergen/processing, manufacturer.",
    category: "seasoning",
  },
  {
    id: "plant-based-salsa-verde-seasoning",
    name: "Plant-Based Salsa Verde Seasoning",
    size: "4 oz jar",
    shortDescription:
      "Bright cilantro & lime salsa verde seasoning with microgreens.",
    priceOneTime: "$10.99",
    priceSubscription: "$10.15",
    fulfillment: "Local and shipping available",
    longDescription:
      "Tangy, herby salsa verde seasoning made with organic cilantro, lime zest, garlic and freeze-dried microgreens for flavor and a nutrient lift. Shelf-stable, clean and versatile — ideal for salsas, marinades and dressings. We turn farm microgreens into pantry boosters so families easily add fresh nutrition.",
    ingredients:
      "Organic dried cilantro; organic lime zest powder; organic garlic powder; organic cumin; organic dried oregano; sea salt; black pepper; freeze-dried pea microgreens.",
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
      "Net wt, ingredient list, directions, allergen/processing, manufacturer.",
    category: "seasoning",
  },
  {
    id: "plant-based-pesto-seasoning",
    name: "Plant-Based Pesto Seasoning",
    size: "4 oz jar",
    shortDescription:
      "Shelf-stable pesto seasoning with nutritional yeast, dried basil, seeds and microgreens.",
    priceOneTime: "$10.99",
    priceSubscription: "$10.15",
    fulfillment: "Local and shipping available",
    longDescription:
      "All the basil brightness of pesto in a shelf-stable seasoning: nutritional yeast for savory creaminess, ground seeds for body, dried basil and pea microgreens for a fresh green nutrient boost. A quick pantry shortcut to sauces, dressings and spreads. We upcycle microgreens from our farm into pantry staples that add real produce nutrition.",
    ingredients:
      "Organic nutritional yeast; organic dried basil; organic dried oregano; organic garlic powder; ground pine nuts or sunflower seeds; sea salt; black pepper; freeze-dried pea microgreens.",
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
      "Net wt, ingredient list, allergen (nuts if pine nuts used), directions, manufacturer.",
    category: "seasoning",
  },
  {
    id: "ice-balls-frozen",
    name: "Ice Balls (frozen)",
    size: "12-pack frozen ice balls (herb/fruit inclusions)",
    shortDescription:
      "Decorative flavored frozen ice balls (mint/lemon/basil or mint/lime/basil) for drinks.",
    priceOneTime: "$32 (12-pack)",
    priceSubscription: null,
    fulfillment: "Local only (fresh/frozen)",
    longDescription:
      "Hand-made frozen ice balls with fresh herbs and citrus for elevated beverages and events. We use farm-fresh mint, basil and citrus to create beautiful, flavorful ice — sustainable, local and perfect for entertaining. Freeze-dried herb option also available for shipping.",
    ingredients:
      "Fresh mint leaves, lemon or lime slices, basil leaves, filtered water.",
    recipes: [
      { title: "Garnish cocktails", body: "Add to cocktails for aroma and chill." },
      { title: "Iced tea", body: "Float in iced tea for a refreshing presentation." },
      { title: "Summer mocktails", body: "Use in lemonades and spritzers." },
    ],
    labelNotes: "Local produce statement, refrigeration instructions.",
    extraNotes: [
      "Frozen 12-pack $32; freeze-dried basil & mint $14 per 0.5 oz.",
    ],
    category: "fresh",
    localOnly: true,
  },
  {
    id: "fresh-butter-lettuce",
    name: "Fresh Produce — Butter Lettuce",
    size: "12 heads per order",
    shortDescription: "Fresh locally grown butter lettuce.",
    priceOneTime: "$40 per 12 heads",
    priceSubscription: null,
    fulfillment: "Local only (Michigan)",
    longDescription:
      "Tender, sweet butter lettuce grown locally. Perfect for family salads and sandwiches — sustainably grown and harvested fresh.",
    ingredients: "Fresh butter lettuce.",
    recipes: [
      { title: "Simple salad", body: "Wash, tear, dress with vinaigrette." },
      { title: "Lettuce wraps", body: "Fill leaves with protein, rice, and veg." },
      { title: "BLT with butter lettuce", body: "Layer with tomato, bacon, and mayo on soft leaves." },
    ],
    labelNotes: "Local, harvest date, storage instructions.",
    category: "fresh",
    localOnly: true,
  },
  {
    id: "microgreens-full-tray",
    name: "Microgreens (full tray)",
    subtitle: "Pea, Radish, Spicy Salad, Broccoli, Arugula, Mustard",
    size: 'One full 10"×20" tray',
    shortDescription:
      "Fresh microgreen trays grown locally; also available freeze-dried for powders.",
    priceOneTime: "$20 per tray (retail); restaurant/wholesale $18/tray (2-month min)",
    priceSubscription:
      "Weekly subscription at wholesale rate (e.g., $18/tray)",
    fulfillment: "Local only for now",
    longDescription:
      "Fresh microgreens harvested at peak nutrient density — pea, radish, spicy salad, broccoli, arugula and mustard. Microgreens are tiny nutrition powerhouses (vitamins, minerals, antioxidants); we also freeze-dry surplus greens to make shelf-stable powders so families can access produce nutrition year-round. Sustainable, flavor-rich and perfect for busy households and restaurants.",
    ingredients: "Live microgreens (variety).",
    recipes: [
      { title: "Garnish salads", body: "Top finished salads for crunch and flavor." },
      { title: "Blend into smoothies", body: "Add a handful to green smoothies." },
      { title: "Fold into scrambled eggs", body: "Stir in at the end of cooking." },
    ],
    labelNotes: "Variety, harvest date, storage & shelf life, local farm origin.",
    extraNotes: [
      "$20/tray retail; $18/tray restaurant; harvest & package extra $3/tray.",
    ],
    category: "fresh",
    localOnly: true,
  },
  {
    id: "fresh-rosemary",
    name: "Rosemary (fresh)",
    size: "0.5 lb bunches",
    shortDescription: "Fresh rosemary for cooking and aromatics.",
    priceOneTime: "$9 per 0.5 lb",
    priceSubscription: "$8.50 per 0.5 lb (weekly wholesale orders)",
    fulfillment: "Local",
    longDescription:
      "Fragrant, fresh rosemary grown locally — ideal for roasting, marinades and infused oils. We supply both retail and restaurant customers with consistent weekly harvests.",
    ingredients: "Fresh rosemary.",
    recipes: [
      { title: "Roast potatoes", body: "Toss with oil, salt, and chopped rosemary." },
      { title: "Herbed roast chicken", body: "Stuff cavity and rub skin with rosemary." },
      { title: "Rosemary focaccia", body: "Press sprigs into dimpled dough before baking." },
    ],
    labelNotes: "Local origin, harvest date, storage.",
    extraNotes: ["$9 per 0.5 lb retail; wholesale $8.50."],
    category: "fresh",
  },
  {
    id: "fresh-dill",
    name: "Fresh Dill",
    size: "Sold by lb (bundles)",
    shortDescription: "Fresh dill for culinary uses.",
    priceOneTime: "$8.50 / lb (3 bunches)",
    priceSubscription: "$7.50 / lb (restaurant)",
    fulfillment: "Local",
    longDescription:
      "Bright, delicate dill harvested locally — perfect for dressings, pickles, fish and potato salads.",
    ingredients: "Fresh dill.",
    recipes: [
      { title: "Dill dip", body: "Stir chopped dill into yogurt or sour cream." },
      { title: "Potato salad", body: "Fold into warm potatoes with mustard and celery." },
      { title: "Dill pickles", body: "Pack spears in brine with dill heads." },
    ],
    labelNotes: "Local origin, storage.",
    extraNotes: ["$8.50 / lb retail; $7.50 / lb wholesale."],
    category: "fresh",
  },
  {
    id: "fresh-italian-parsley",
    name: "Italian Parsley",
    size: "1 lb",
    shortDescription: "Fresh Italian parsley for culinary uses.",
    priceOneTime: "$6 per lb",
    priceSubscription: "$5 per lb (restaurants)",
    fulfillment: "Local only",
    longDescription:
      "Fresh, robust Italian parsley — versatile and nutrient-dense, great for gremolata, salads and finishing.",
    ingredients: "Fresh Italian parsley.",
    recipes: [
      { title: "Gremolata", body: "Mince with lemon zest and garlic for topping." },
      { title: "Tabbouleh", body: "Chop fine with bulgur, tomato, and mint." },
      { title: "Chimichurri", body: "Blend with oil, vinegar, and garlic for steak." },
    ],
    labelNotes: "Local origin, storage.",
    category: "fresh",
    localOnly: true,
  },
  {
    id: "fresh-mint",
    name: "Mint",
    size: "0.5 lb",
    shortDescription: "Fresh mint for beverages and cooking.",
    priceOneTime: "$9 per 0.5 lb",
    priceSubscription: "$8.50 per 0.5 lb (restaurants)",
    fulfillment: "Local; can ship",
    longDescription:
      "Cooling, aromatic mint for cocktails, teas and cooking — grown and harvested locally then packaged fresh or freeze-dried for shelf-stable options.",
    ingredients: "Fresh mint.",
    recipes: [
      { title: "Mint iced tea", body: "Steep leaves with black tea, chill, sweeten." },
      { title: "Mojito mocktail", body: "Muddle with lime, syrup, and soda." },
      { title: "Mint pesto", body: "Blend with nuts, oil, and parmesan alternative." },
    ],
    labelNotes: "Local origin, storage.",
    extraNotes: ["$9 per 0.5 lb retail; $8.50 wholesale."],
    category: "fresh",
  },
  {
    id: "fresh-basil",
    name: "Basil",
    size: "1 lb",
    shortDescription: "Fresh sweet basil for culinary use.",
    priceOneTime: "$14 per lb",
    priceSubscription: "$12 per lb (restaurants)",
    fulfillment: "Local only",
    longDescription:
      "Vibrant, aromatic basil grown locally — ideal for pesto, salads and finishing dishes. We also offer freeze-dried basil for shipping.",
    ingredients: "Fresh basil.",
    recipes: [
      { title: "Classic pesto", body: "Blend with pine nuts, garlic, oil, and cheese." },
      { title: "Caprese salad", body: "Layer with tomato and mozzarella." },
      { title: "Basil-lemon vinaigrette", body: "Whisk with lemon juice and olive oil." },
    ],
    labelNotes: "Local origin, storage.",
    extraNotes: ["$14 per lb retail; $12 wholesale."],
    category: "fresh",
    localOnly: true,
  },
  {
    id: "fresh-baby-kale",
    name: "Baby Kale",
    size: "Priced per lb (weekly delivery; min 8 lb for weekly route)",
    shortDescription:
      "Tender, nutrient-dense baby kale for salads and cooking.",
    priceOneTime: "$9 per lb",
    priceSubscription: "Contact for weekly bulk pricing (deliveries often 8 lb)",
    fulfillment: "Local only",
    longDescription:
      "Fresh baby kale harvested young for tender texture and high nutrient content — ideal for salads, smoothies and sautés. We grow sustainably and offer weekly delivery for regular customers.",
    ingredients: "Fresh baby kale.",
    recipes: [
      { title: "Kale salad with lemon tahini", body: "Massage with dressing, add toppings." },
      { title: "Kale smoothie", body: "Blend with fruit and liquid base." },
      { title: "Sautéed garlic kale", body: "Quick sauté with garlic and oil." },
    ],
    extraNotes: [
      "$9 per lb retail; weekly bulk delivery pricing varies.",
    ],
    category: "fresh",
    localOnly: true,
  },
];

export const featuredProductIds: string[] = [
  "immunity-smoothie-booster",
  "mushroom-coffee",
  "hearty-harvest-blend",
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
  return f.length > 40 ? `${f.slice(0, 37)}…` : f;
}
