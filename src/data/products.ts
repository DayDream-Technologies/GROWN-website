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
  /**
   * When true, show inquiry form instead of cart and omit purchasable price parsing.
   * Used for fresh produce, microgreens trays, and any SKU priced manually off-site.
   */
  contactForPricing?: boolean;
};

export const products: Product[] = [
  {
    id: "elevated-brew-mushroom",
    name: "Elevated Brew Mushroom",
    subtitle: "Powered by microgreens",
    size: "5 oz (56 servings; 2.5 g per serving, 2 scoops)",
    shortDescription:
      "Instant mushroom coffee blend for smooth, energizing flavor.",
    priceOneTime: "$23.99",
    priceSubscription: "$22.31 / month",
    fulfillment: "Local and shipping available",
    longDescription:
      "Our Elevated Brew Mushroom Coffee provides a rich and smooth flavor by combining high-quality organic instant coffee with a blend of functional mushrooms. Infused with Lion’s Mane and Reishi, this carefully crafted mix delivers focused energy, cognitive support, and immune resilience without the jitters or crashes. Enjoy it in hot coffee, iced coffee, or smoothies, and experience the delicious fusion of taste and health. Each serving is built with freeze-dried microgreens—roughly one-quarter to one-half a tray of fresh greens—for concentrated nutrition in every scoop.",
    ingredients:
      "Organic Instant Coffee (Arabica), Organic Lion’s Mane Powder, Organic Reishi Powder, Organic Chaga Powder, Organic Cordyceps Powder, Organic Turkey Tail Powder, Organic Shiitake Powder, Organic Maitake Powder, Organic Mesima Powder, Organic Wood Ear Powder, Organic Oyster Powder.",
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
      "Net weight, caffeine content, ingredient list, directions, allergen/processing, manufacturer.",
    category: "powder",
  },
  {
    id: "green-leaf",
    name: "Green Leaf",
    subtitle: "Powered by Microgreens",
    size: "8 oz (35 servings; 7 g, 1 scoop)",
    shortDescription:
      "Pure greens powered by freeze-dried microgreens for immune support.",
    priceOneTime: "$49.99",
    priceSubscription: "$46.49 / month",
    fulfillment: "Local and shipping available",
    longDescription:
      "Unlock the power of fresh greens with our Immunity Smoothie Booster. Crafted from a premium greens blend—Organic Broccoli, Alfalfa Grass, Kale, Spinach, Spirulina, and Wheatgrass—and enhanced with Organic Inulin, Ashwagandha, Panax Ginseng, and the probiotic Bacillus subtilis, this clean formula delivers concentrated vitamins, antioxidants, and prebiotic fiber without fillers or additives. Use daily in smoothies, bowls, and baking for a nutritional kick that supports your health. Each serving is built with freeze-dried microgreens—roughly one-quarter to one-half a tray of fresh greens—for concentrated nutrition in every scoop.",
    ingredients:
      "Organic Broccoli Powder, Organic Alfalfa Grass Powder, Organic Kale Powder, Organic Spinach Powder, Organic Spirulina Powder, Organic Wheatgrass Powder, Organic Inulin (chicory root), Organic Ashwagandha Root Powder, Organic Panax Ginseng Root Powder, Bacillus subtilis (probiotic), Hydroponic Microgreens Blend.",
    recipes: [
      {
        title: "Green Smoothie",
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
      "Net weight, ingredient list, serving size/directions, probiotic CFU if claimed, organic certification, allergen/processing statement, manufacturer info, lot & best-by.",
    category: "powder",
  },
  {
    id: "berry-gut-glow",
    name: "Berry Gut Glow",
    subtitle: "Powered by Microgreens",
    size: "Serving 2 Tbsp; 22.5 servings per container",
    shortDescription:
      "Berry-forward blend powered by microgreens—easy to stir into smoothies, oats, or yogurt.",
    priceOneTime: "$35.99",
    priceSubscription: "$33.47 / month",
    fulfillment: "Local and shipping available",
    longDescription:
      "Berry Gut Glow brings together clean berry superfoods and freeze-dried microgreens for a simple daily boost you can blend into smoothies, bowls, or snacks. Each serving is built with freeze-dried microgreens—roughly one-quarter to one-half a tray of fresh greens—for concentrated nutrition in every scoop.",
    ingredients:
      "Organic blueberry powder, organic chia seeds, organic flax berry powder, organic Acai Powder, Organic Camu Camu Powder, Sea Salt.",
    recipes: [
      {
        title: "Berry Gut Smoothie",
        body: "2 Tbsp + 1 cup mixed berries + 1 cup almond milk + extra chia if you like, blend.",
      },
      {
        title: "Tropical Digestive Smoothie",
        body: "2 Tbsp + 1/2 banana + 1/2 cup pineapple + 1 cup coconut milk, blend.",
      },
      {
        title: "Green Detox Shake",
        body: "2 Tbsp + 1/2 avocado + 1 cup spinach + 1 cup cucumber juice, blend.",
      },
    ],
    labelNotes:
      "Net weight, ingredient list, serving size/directions, organic claims where applicable, allergen/processing, manufacturer.",
    category: "powder",
  },
  {
    id: "matcha-revival",
    name: "Matcha Revival",
    subtitle: "Powered by Mushrooms",
    size: "8 oz (45 servings; 5 g per serving, 1.5 scoops)",
    shortDescription:
      "Matcha + mushroom complex with microgreens for clean focus and calm energy.",
    priceOneTime: "$35.99",
    priceSubscription: "$33.47 / month",
    fulfillment: "Local and shipping available",
    longDescription:
      "Mushroom Matcha blends ceremonial-grade organic matcha with a targeted mushroom complex, providing focused energy and cognitive support without the crash. Combined with freeze-dried microgreens, this blend brings together nature's best to help sustain your daily wellness goals while providing a delicious and refreshing drink.",
    ingredients:
      "Organic Matcha Green Tea Powder, Organic Lion’s Mane Powder, Organic Reishi Powder, Organic Chaga Powder, Organic Maitake Powder, Organic Cordyceps Powder, Organic Turkey Tail Powder, Organic Shiitake Powder, Hydroponic Microgreens Blend.",
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
      "Net weight, caffeine disclosure, ingredient list, serving size, allergen/processing, manufacturer.",
    category: "powder",
  },
  {
    id: "golden-calm",
    name: "Golden Calm",
    subtitle: "Powered by Saffron",
    size: "6.2 oz (30 servings; 5.9 g, 1 scoop)",
    shortDescription:
      "Uplifting saffron blend for mood and energy.",
    priceOneTime: "$39.99",
    priceSubscription: null,
    fulfillment: "Local and shipping available",
    longDescription:
      "Experience the uplifting properties of saffron with our Saffron Drink blend, designed to support mood, energy levels, and emotional balance. Combining the calming effects of chamomile and lavender with the mood-enhancing benefits of saffron, this drink also includes key nutrients like vitamin D and magnesium. Enjoy a soothing, flavorful drink that fits seamlessly into your daily routine, promoting a balanced, vibrant lifestyle.",
    ingredients:
      "Active ingredients: Vitamin D (as Vitamin D3, Cholecalciferol) 125 mcg (5000 IU), 625% DV; Calcium (as Calcium Citrate) 20 mg, <2% DV; Magnesium (as Magnesium Citrate) 50 mg, 12% DV; Sodium (as Himalayan Pink Salt) 25 mg, 1% DV; Potassium (as Potassium Citrate) 20 mg, <2% DV; FiberSMART® Soluble Tapioca Fiber 4,440 mg; Passion Flower (Passiflora incarnata) (flower) Extract 250 mg; Lavender (Lavandula angustifolia) (aerial parts) 50 mg; Chamomile (Matricaria chamomilla L.) (flower) Extract 50 mg; Saffron (Crocus sativus) (stigma) Extract 45 mg; L-Theanine 20 mg. Additional ingredients: Natural Fruit Flavors, Citric Acid, Stevia Leaf Extract.",
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
    extraNotes: ["Not eligible for monthly subscription."],
    category: "powder",
  },
  {
    id: "lemon-zest",
    name: "Lemon Zest",
    subtitle: "Powered by Spirulina",
    size: "4.2 oz (32 servings; 4 g per serving, 2 scoops)",
    shortDescription:
      "Refreshing blend with a boost from spirulina and lemon.",
    priceOneTime: "$26.99",
    priceSubscription: null,
    fulfillment: "Local and shipping available",
    longDescription:
      "Our Lemon + Spirulina blend combines the refreshing zest of lemon with the nutrient power of spirulina, designed to hydrate and nourish. Perfect for busy individuals looking to enhance their nutrition on the go, simply mix it into water or your favorite drinks for an easy boost anytime.",
    ingredients: "Organic Spirulina Powder, Lemon Juice Powder.",
    recipes: [
      {
        title: "Lemon Spirulina Water",
        body: "1 scoop + 1 cup cold water, stir or shake.",
      },
      {
        title: "Zesty Mocktail",
        body: "1 scoop + 1 cup seltzer + lemon slice + mint, stir over ice.",
      },
      {
        title: "Citrus Smoothie",
        body: "1 scoop + 1 banana + 1 cup almond milk + handful of spinach, blend.",
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
    priceOneTime: "$14.99",
    priceSubscription: "$13.94 / month",
    fulfillment: "Local and shipping available",
    longDescription:
      "Medi Green Salt is a finishing salt that brings savory, herbaceous flavor and concentrated microgreen nutrition to everyday dishes. Freeze-dried pea microgreens and organic spinach powder lend vitamins and phytonutrients to a balanced blend of oregano, basil, garlic, and pepper. Use it as a table seasoning or finishing sprinkle to boost flavor and micronutrients with a single pinch. Each jar contains one-quarter to one-half a tray of fresh microgreens, boosting nutrition in every sprinkle.",
    ingredients:
      "Sea Salt, Organic Spinach Powder, Organic Oregano, Organic Basil, Organic Garlic Powder, Organic Black Pepper, Hydroponic Microgreen Blend.",
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
    priceOneTime: "$10.99",
    priceSubscription: "$10.22 / month",
    fulfillment: "Local and shipping available",
    longDescription:
      "Our Plant-Based Ranch Seasoning recreates the classic creamy ranch flavor in a dry, vegan-friendly seasoning. Organic herbs, garlic, and onion, along with nutritional yeast, provide savory depth while freeze-dried pea microgreens contribute extra micronutrients. Use it to make quick dips, dressings, or to season roasted vegetables for a familiar, health-forward flavor. Each jar contains one-quarter to one-half a tray of fresh microgreens, boosting nutrition in every sprinkle.",
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
    priceOneTime: "$10.99",
    priceSubscription: "$10.22 / month",
    fulfillment: "Local and shipping available",
    longDescription:
      "This Plant-Based Salsa Verde Seasoning captures the bright citrus herb profile of salsa verde in a dry, concentrated form. Organic cilantro, lime zest, cumin, and oregano combine with freeze-dried microgreens to add freshness and nutrition to salsas, marinades, and dressings — no preservatives, just clean organic herbs. Each jar contains one-quarter to one-half a tray of fresh microgreens, boosting nutrition in every sprinkle.",
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
    priceOneTime: "$10.99",
    priceSubscription: "$10.22 / month",
    fulfillment: "Local and shipping available",
    longDescription:
      "Plant-Based Pesto Seasoning brings the bright basil-forward taste of pesto to a convenient, shelf-stable format. Nutritional yeast and ground seeds create a creamy umami backbone while freeze-dried microgreens add extra vitamins. Use as an instant sauce base, spread, or finishing seasoning for broad culinary uses. Each jar contains one-quarter to one-half a tray of fresh microgreens, boosting nutrition in every sprinkle.",
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
      "Hand-made frozen ice balls with fresh herbs and citrus for elevated beverages and events. We use farm-fresh mint, basil and citrus to create beautiful, flavorful ice — sustainable, local and perfect for entertaining. Freeze-dried herb options may be available—ask when you reach out.",
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
    name: "Fresh Produce — Butter Lettuce",
    size: "12 heads per order",
    shortDescription: "Fresh locally grown butter lettuce.",
    priceOneTime: "Contact for pricing",
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
    contactForPricing: true,
  },
  {
    id: "microgreens-full-tray",
    name: "Microgreens (full tray)",
    subtitle: "Pea, Radish, Spicy Salad, Broccoli, Arugula, Mustard",
    size: 'One full 10"×20" tray (contact us for availability)',
    shortDescription:
      "Fresh microgreen trays grown locally; also available freeze-dried for powders.",
    priceOneTime: "Contact for pricing",
    priceSubscription: null,
    fulfillment: "Local only",
    longDescription:
      "Fresh microgreens harvested at peak nutrient density — pea, radish, spicy salad, broccoli, arugula and mustard. Microgreens are tiny nutrition powerhouses (vitamins, minerals, antioxidants); we also freeze-dry surplus greens to make shelf-stable powders so families can access produce nutrition year-round. Sustainable, flavor-rich and perfect for busy households and restaurants. Pricing, subscriptions, and wholesale are handled directly — reach out via the form and we will reply with options.",
    ingredients: "Live microgreens (variety).",
    recipes: [
      { title: "Garnish salads", body: "Top finished salads for crunch and flavor." },
      { title: "Blend into smoothies", body: "Add a handful to green smoothies." },
      { title: "Fold into scrambled eggs", body: "Stir in at the end of cooking." },
    ],
    labelNotes: "Variety, harvest date, storage & shelf life, local farm origin.",
    extraNotes: [
      "Harvest and packaging add-ons available for restaurant orders—ask when you reach out.",
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
      "Fragrant, fresh rosemary grown locally — ideal for roasting, marinades and infused oils. We supply both retail and restaurant customers with consistent weekly harvests.",
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
      "Bright, delicate dill harvested locally — perfect for dressings, pickles, fish and potato salads.",
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
      "Cooling, aromatic mint for cocktails, teas and cooking — grown and harvested locally then packaged fresh. Freeze-dried herb options may be available through our pantry line—ask when you reach out.",
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
      "Vibrant, aromatic basil grown locally — ideal for pesto, salads and finishing dishes. Shelf-stable freeze-dried basil may be available as a pantry item—ask when you reach out.",
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
      "Fresh baby kale harvested young for tender texture and high nutrient content — ideal for salads, smoothies and sautés. We grow sustainably and offer weekly delivery for regular customers.",
    ingredients: "Fresh baby kale.",
    recipes: [
      { title: "Kale salad with lemon tahini", body: "Massage with dressing, add toppings." },
      { title: "Kale smoothie", body: "Blend with fruit and liquid base." },
      { title: "Sautéed garlic kale", body: "Quick sauté with garlic and oil." },
    ],
    extraNotes: [
      "Weekly bulk delivery available—share your route needs in the form.",
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
  return f.length > 40 ? `${f.slice(0, 37)}…` : f;
}
