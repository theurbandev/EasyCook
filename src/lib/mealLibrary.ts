import type { Diet } from './types';

export type LibraryMeal = {
  name: string;
  cuisine: string;
  description: string;
  minutes: number;
  kidFriendly: boolean;
  diets: Diet[];
  budget: 1 | 2 | 3; // Budget, Moderate, Splurge
  effort: 1 | 2 | 3; // Easy, Medium, Ambitious
  mealTypes: string[];
  batchFriendly: boolean; // reheats well for several days
  ingredients: string[];
};

const V: Diet = 'Vegetarian';
const GF: Diet = 'Gluten-free';
const DF: Diet = 'Dairy-free';
const NF: Diet = 'Nut-free';
const LC: Diet = 'Low-carb';
const D = ['Dinner'];
const DL = ['Dinner', 'Lunch'];
const B = ['Breakfast'];

// Built-in ideas so the app works with no internet or API key.
export const MEAL_LIBRARY: LibraryMeal[] = [
  // American
  { name: 'Sheet-Pan Chicken & Veggies', cuisine: 'American', description: 'Juicy chicken thighs roasted with potatoes, carrots and broccoli on one pan.', minutes: 40, kidFriendly: true, diets: [GF, DF, NF], budget: 1, effort: 1, mealTypes: D, batchFriendly: true, ingredients: ['chicken thighs', 'potatoes', 'carrots', 'broccoli', 'olive oil', 'garlic powder'] },
  { name: 'Classic Cheeseburgers', cuisine: 'American', description: 'Smash-style burgers with cheddar, pickles and a quick burger sauce.', minutes: 25, kidFriendly: true, diets: [NF], budget: 2, effort: 1, mealTypes: DL, batchFriendly: false, ingredients: ['ground beef', 'burger buns', 'cheddar', 'pickles', 'lettuce', 'ketchup', 'mayo'] },
  { name: 'Slow-Cooker Chili', cuisine: 'American', description: 'Hearty beef and bean chili that gets better on day two.', minutes: 30, kidFriendly: true, diets: [GF, DF, NF], budget: 1, effort: 1, mealTypes: DL, batchFriendly: true, ingredients: ['ground beef', 'kidney beans', 'crushed tomatoes', 'onion', 'chili powder', 'cumin'] },
  { name: 'Mac & Cheese with Peas', cuisine: 'American', description: 'Creamy stovetop mac and cheese with sweet peas stirred in.', minutes: 25, kidFriendly: true, diets: [V, NF], budget: 1, effort: 1, mealTypes: DL, batchFriendly: true, ingredients: ['elbow pasta', 'cheddar', 'milk', 'butter', 'frozen peas'] },
  { name: 'Turkey Meatloaf & Mash', cuisine: 'American', description: 'Glazed turkey meatloaf with buttery mashed potatoes.', minutes: 70, kidFriendly: true, diets: [NF], budget: 1, effort: 2, mealTypes: D, batchFriendly: true, ingredients: ['ground turkey', 'breadcrumbs', 'egg', 'ketchup', 'potatoes', 'butter'] },
  { name: 'Chicken Pot Pie', cuisine: 'American', description: 'Creamy chicken and vegetable filling under a flaky crust.', minutes: 75, kidFriendly: true, diets: [NF], budget: 2, effort: 3, mealTypes: D, batchFriendly: true, ingredients: ['chicken', 'pie crust', 'carrots', 'peas', 'celery', 'chicken stock', 'cream'] },
  { name: 'Buttermilk Pancakes & Berries', cuisine: 'American', description: 'Fluffy pancakes with fresh berries and maple syrup.', minutes: 25, kidFriendly: true, diets: [V, NF], budget: 1, effort: 1, mealTypes: B, batchFriendly: false, ingredients: ['flour', 'buttermilk', 'eggs', 'butter', 'berries', 'maple syrup'] },
  { name: 'Veggie Egg Scramble', cuisine: 'American', description: 'Soft scrambled eggs with spinach, peppers and cheese.', minutes: 15, kidFriendly: true, diets: [V, GF, NF, LC], budget: 1, effort: 1, mealTypes: B, batchFriendly: false, ingredients: ['eggs', 'spinach', 'bell pepper', 'cheddar', 'butter'] },
  { name: 'Grilled Salmon & Asparagus', cuisine: 'American', description: 'Lemon-garlic salmon with charred asparagus.', minutes: 25, kidFriendly: false, diets: [GF, DF, NF, LC], budget: 3, effort: 1, mealTypes: D, batchFriendly: false, ingredients: ['salmon fillets', 'asparagus', 'lemon', 'garlic', 'olive oil'] },

  // Mexican
  { name: 'Build-Your-Own Tacos', cuisine: 'Mexican', description: 'Seasoned ground beef with a taco bar of toppings everyone picks.', minutes: 25, kidFriendly: true, diets: [GF, NF], budget: 1, effort: 1, mealTypes: DL, batchFriendly: false, ingredients: ['ground beef', 'corn tortillas', 'lettuce', 'tomato', 'cheese', 'sour cream', 'taco seasoning'] },
  { name: 'Chicken Burrito Bowls', cuisine: 'Mexican', description: 'Cilantro-lime rice, black beans, chicken, corn salsa and guac.', minutes: 35, kidFriendly: true, diets: [GF, DF, NF], budget: 1, effort: 1, mealTypes: DL, batchFriendly: true, ingredients: ['chicken breast', 'rice', 'black beans', 'corn', 'lime', 'cilantro', 'avocado'] },
  { name: 'Cheesy Bean Quesadillas', cuisine: 'Mexican', description: 'Crispy tortillas stuffed with refried beans and melty cheese.', minutes: 15, kidFriendly: true, diets: [V, NF], budget: 1, effort: 1, mealTypes: DL, batchFriendly: false, ingredients: ['flour tortillas', 'refried beans', 'monterey jack', 'salsa'] },
  { name: 'Chicken Enchiladas', cuisine: 'Mexican', description: 'Rolled tortillas with shredded chicken baked in red sauce.', minutes: 50, kidFriendly: true, diets: [NF], budget: 2, effort: 2, mealTypes: D, batchFriendly: true, ingredients: ['chicken', 'tortillas', 'enchilada sauce', 'cheese', 'onion'] },
  { name: 'Pork Carnitas', cuisine: 'Mexican', description: 'Slow-braised, crisped pork shoulder for tacos all week.', minutes: 180, kidFriendly: true, diets: [GF, DF, NF], budget: 2, effort: 2, mealTypes: D, batchFriendly: true, ingredients: ['pork shoulder', 'orange', 'lime', 'cumin', 'oregano', 'tortillas'] },
  { name: 'Shrimp Fajitas', cuisine: 'Mexican', description: 'Sizzling shrimp with peppers and onions in warm tortillas.', minutes: 25, kidFriendly: false, diets: [DF, NF], budget: 3, effort: 1, mealTypes: D, batchFriendly: false, ingredients: ['shrimp', 'bell peppers', 'onion', 'fajita seasoning', 'tortillas', 'lime'] },
  { name: 'Huevos Rancheros', cuisine: 'Mexican', description: 'Fried eggs on tortillas with ranchero sauce and beans.', minutes: 20, kidFriendly: false, diets: [V, GF, NF], budget: 1, effort: 1, mealTypes: B, batchFriendly: false, ingredients: ['eggs', 'corn tortillas', 'salsa', 'black beans', 'queso fresco'] },

  // Italian
  { name: 'Spaghetti & Meatballs', cuisine: 'Italian', description: 'Tender beef meatballs simmered in marinara over spaghetti.', minutes: 45, kidFriendly: true, diets: [NF], budget: 1, effort: 2, mealTypes: D, batchFriendly: true, ingredients: ['spaghetti', 'ground beef', 'breadcrumbs', 'egg', 'marinara', 'parmesan'] },
  { name: 'Baked Ziti', cuisine: 'Italian', description: 'Pasta baked with tomato sauce, ricotta and mozzarella.', minutes: 50, kidFriendly: true, diets: [V, NF], budget: 1, effort: 1, mealTypes: D, batchFriendly: true, ingredients: ['ziti', 'marinara', 'ricotta', 'mozzarella', 'parmesan'] },
  { name: 'Homemade Pizza Night', cuisine: 'Italian', description: 'Store-bought dough, everyone tops their own pizza.', minutes: 35, kidFriendly: true, diets: [V, NF], budget: 1, effort: 1, mealTypes: D, batchFriendly: false, ingredients: ['pizza dough', 'pizza sauce', 'mozzarella', 'toppings of choice'] },
  { name: 'Chicken Parmesan', cuisine: 'Italian', description: 'Crispy breaded chicken with marinara and melted mozzarella.', minutes: 45, kidFriendly: true, diets: [NF], budget: 2, effort: 2, mealTypes: D, batchFriendly: false, ingredients: ['chicken breast', 'breadcrumbs', 'eggs', 'marinara', 'mozzarella', 'pasta'] },
  { name: 'Lasagna', cuisine: 'Italian', description: 'Layers of meat sauce, ricotta and noodles — feeds a crowd for days.', minutes: 90, kidFriendly: true, diets: [NF], budget: 2, effort: 3, mealTypes: D, batchFriendly: true, ingredients: ['lasagna noodles', 'ground beef', 'marinara', 'ricotta', 'mozzarella', 'parmesan'] },
  { name: 'Lemon Garlic Shrimp Pasta', cuisine: 'Italian', description: 'Quick linguine with shrimp, garlic, lemon and parsley.', minutes: 20, kidFriendly: false, diets: [NF], budget: 2, effort: 1, mealTypes: D, batchFriendly: false, ingredients: ['linguine', 'shrimp', 'garlic', 'lemon', 'butter', 'parsley'] },
  { name: 'Mushroom Risotto', cuisine: 'Italian', description: 'Creamy arborio rice with mushrooms and parmesan.', minutes: 45, kidFriendly: false, diets: [V, GF, NF], budget: 2, effort: 2, mealTypes: D, batchFriendly: false, ingredients: ['arborio rice', 'mushrooms', 'vegetable stock', 'parmesan', 'onion', 'white wine'] },

  // Chinese
  { name: 'Chicken Fried Rice', cuisine: 'Chinese', description: 'Day-old rice stir-fried with chicken, egg, peas and carrots.', minutes: 20, kidFriendly: true, diets: [DF, NF], budget: 1, effort: 1, mealTypes: DL, batchFriendly: true, ingredients: ['cooked rice', 'chicken', 'eggs', 'peas', 'carrots', 'soy sauce', 'green onion'] },
  { name: 'Beef & Broccoli', cuisine: 'Chinese', description: 'Tender sliced beef and broccoli in a glossy savory sauce.', minutes: 25, kidFriendly: true, diets: [DF, NF], budget: 2, effort: 1, mealTypes: D, batchFriendly: true, ingredients: ['flank steak', 'broccoli', 'soy sauce', 'oyster sauce', 'garlic', 'ginger', 'rice'] },
  { name: 'Sweet & Sour Chicken', cuisine: 'Chinese', description: 'Crispy chicken bites with peppers and pineapple.', minutes: 35, kidFriendly: true, diets: [DF, NF], budget: 1, effort: 2, mealTypes: D, batchFriendly: false, ingredients: ['chicken breast', 'cornstarch', 'bell pepper', 'pineapple', 'ketchup', 'vinegar', 'rice'] },
  { name: 'Kung Pao Chicken', cuisine: 'Chinese', description: 'Spicy stir-fried chicken with peanuts and dried chilies.', minutes: 25, kidFriendly: false, diets: [DF], budget: 1, effort: 2, mealTypes: D, batchFriendly: false, ingredients: ['chicken thighs', 'peanuts', 'dried chilies', 'soy sauce', 'vinegar', 'sichuan pepper'] },
  { name: 'Vegetable Lo Mein', cuisine: 'Chinese', description: 'Soft noodles tossed with crisp vegetables in savory sauce.', minutes: 20, kidFriendly: true, diets: [V, DF, NF], budget: 1, effort: 1, mealTypes: DL, batchFriendly: true, ingredients: ['lo mein noodles', 'cabbage', 'carrots', 'mushrooms', 'soy sauce', 'sesame oil'] },
  { name: 'Mapo Tofu', cuisine: 'Chinese', description: 'Silky tofu in a spicy, numbing chili bean sauce.', minutes: 25, kidFriendly: false, diets: [DF, NF], budget: 1, effort: 2, mealTypes: D, batchFriendly: false, ingredients: ['tofu', 'ground pork', 'doubanjiang', 'sichuan pepper', 'garlic', 'rice'] },

  // Japanese
  { name: 'Chicken Teriyaki Bowls', cuisine: 'Japanese', description: 'Sticky teriyaki chicken over rice with steamed broccoli.', minutes: 25, kidFriendly: true, diets: [DF, NF], budget: 1, effort: 1, mealTypes: DL, batchFriendly: true, ingredients: ['chicken thighs', 'soy sauce', 'mirin', 'brown sugar', 'rice', 'broccoli'] },
  { name: 'Japanese Curry', cuisine: 'Japanese', description: 'Mild, sweet curry with potatoes and carrots — a kid favorite.', minutes: 45, kidFriendly: true, diets: [NF], budget: 1, effort: 1, mealTypes: D, batchFriendly: true, ingredients: ['curry roux blocks', 'chicken or beef', 'potatoes', 'carrots', 'onion', 'rice'] },
  { name: 'Homemade Sushi Rolls', cuisine: 'Japanese', description: 'Roll-your-own maki with cucumber, avocado and crab.', minutes: 60, kidFriendly: true, diets: [DF, NF], budget: 2, effort: 3, mealTypes: DL, batchFriendly: false, ingredients: ['sushi rice', 'nori', 'cucumber', 'avocado', 'imitation crab', 'rice vinegar'] },
  { name: 'Chicken Katsu', cuisine: 'Japanese', description: 'Panko-crusted fried chicken with tangy katsu sauce.', minutes: 35, kidFriendly: true, diets: [DF, NF], budget: 1, effort: 2, mealTypes: D, batchFriendly: false, ingredients: ['chicken breast', 'panko', 'eggs', 'flour', 'tonkatsu sauce', 'cabbage', 'rice'] },
  { name: 'Miso Ramen', cuisine: 'Japanese', description: 'Rich miso broth with noodles, soft egg and corn.', minutes: 30, kidFriendly: true, diets: [DF, NF], budget: 1, effort: 2, mealTypes: DL, batchFriendly: false, ingredients: ['ramen noodles', 'miso paste', 'chicken stock', 'eggs', 'corn', 'green onion'] },

  // Thai
  { name: 'Thai Basil Chicken', cuisine: 'Thai', description: 'Pad krapow — spicy minced chicken with holy basil and a fried egg.', minutes: 20, kidFriendly: false, diets: [DF, NF, GF], budget: 1, effort: 1, mealTypes: D, batchFriendly: false, ingredients: ['ground chicken', 'thai basil', 'garlic', 'chilies', 'fish sauce', 'eggs', 'rice'] },
  { name: 'Pad Thai', cuisine: 'Thai', description: 'Rice noodles with shrimp or chicken, egg, peanuts and lime.', minutes: 30, kidFriendly: true, diets: [DF, GF], budget: 2, effort: 2, mealTypes: D, batchFriendly: false, ingredients: ['rice noodles', 'shrimp', 'eggs', 'bean sprouts', 'peanuts', 'tamarind', 'fish sauce'] },
  { name: 'Thai Green Curry', cuisine: 'Thai', description: 'Coconut green curry with chicken, bamboo shoots and basil.', minutes: 30, kidFriendly: false, diets: [GF, DF, NF], budget: 2, effort: 1, mealTypes: D, batchFriendly: true, ingredients: ['green curry paste', 'coconut milk', 'chicken', 'bamboo shoots', 'thai basil', 'rice'] },
  { name: 'Peanut Noodle Stir-Fry', cuisine: 'Thai', description: 'Noodles and veggies in a creamy peanut-lime sauce.', minutes: 20, kidFriendly: true, diets: [V, DF], budget: 1, effort: 1, mealTypes: DL, batchFriendly: true, ingredients: ['noodles', 'peanut butter', 'soy sauce', 'lime', 'carrots', 'bell pepper'] },

  // Korean
  { name: 'Beef Bulgogi Bowls', cuisine: 'Korean', description: 'Sweet-savory marinated beef over rice with quick pickles.', minutes: 30, kidFriendly: true, diets: [DF, NF], budget: 2, effort: 1, mealTypes: D, batchFriendly: true, ingredients: ['ribeye or sirloin', 'soy sauce', 'pear', 'garlic', 'sesame oil', 'rice', 'cucumber'] },
  { name: 'Bibimbap', cuisine: 'Korean', description: 'Rice bowl with sautéed veggies, egg and gochujang.', minutes: 40, kidFriendly: false, diets: [DF, NF], budget: 1, effort: 2, mealTypes: DL, batchFriendly: false, ingredients: ['rice', 'spinach', 'carrots', 'bean sprouts', 'eggs', 'gochujang', 'ground beef'] },
  { name: 'Kimchi Fried Rice', cuisine: 'Korean', description: 'Tangy kimchi fried rice topped with a runny egg.', minutes: 15, kidFriendly: false, diets: [DF, NF], budget: 1, effort: 1, mealTypes: DL, batchFriendly: false, ingredients: ['cooked rice', 'kimchi', 'eggs', 'gochujang', 'green onion', 'sesame oil'] },

  // Vietnamese
  { name: 'Lemongrass Chicken Vermicelli', cuisine: 'Vietnamese', description: 'Bún gà — grilled chicken over noodles with herbs and nuoc cham.', minutes: 35, kidFriendly: true, diets: [GF, DF, NF], budget: 2, effort: 2, mealTypes: DL, batchFriendly: false, ingredients: ['chicken thighs', 'lemongrass', 'rice vermicelli', 'lettuce', 'mint', 'fish sauce', 'lime'] },
  { name: 'Shortcut Chicken Pho', cuisine: 'Vietnamese', description: 'Spiced chicken broth with rice noodles and fresh herbs.', minutes: 45, kidFriendly: true, diets: [GF, DF, NF], budget: 1, effort: 2, mealTypes: DL, batchFriendly: true, ingredients: ['chicken', 'rice noodles', 'star anise', 'ginger', 'onion', 'fish sauce', 'herbs'] },

  // Indian
  { name: 'Butter Chicken', cuisine: 'Indian', description: 'Mild, creamy tomato curry with tender chicken and naan.', minutes: 40, kidFriendly: true, diets: [GF, NF], budget: 2, effort: 2, mealTypes: D, batchFriendly: true, ingredients: ['chicken thighs', 'tomato sauce', 'cream', 'butter', 'garam masala', 'ginger', 'naan'] },
  { name: 'Chana Masala', cuisine: 'Indian', description: 'Spiced chickpea and tomato curry, great with rice.', minutes: 30, kidFriendly: false, diets: [V, GF, DF, NF], budget: 1, effort: 1, mealTypes: DL, batchFriendly: true, ingredients: ['chickpeas', 'tomatoes', 'onion', 'garlic', 'ginger', 'garam masala', 'rice'] },
  { name: 'Red Lentil Dal', cuisine: 'Indian', description: 'Comforting golden lentils with cumin and garlic.', minutes: 30, kidFriendly: true, diets: [V, GF, DF, NF], budget: 1, effort: 1, mealTypes: DL, batchFriendly: true, ingredients: ['red lentils', 'turmeric', 'cumin', 'garlic', 'onion', 'rice'] },
  { name: 'Chicken Tikka Skewers', cuisine: 'Indian', description: 'Yogurt-marinated chicken skewers with cucumber raita.', minutes: 35, kidFriendly: true, diets: [GF, NF, LC], budget: 2, effort: 2, mealTypes: D, batchFriendly: false, ingredients: ['chicken breast', 'yogurt', 'tikka spices', 'cucumber', 'lemon'] },

  // Mediterranean
  { name: 'Chicken Gyro Wraps', cuisine: 'Mediterranean', description: 'Spiced chicken in pita with tzatziki, tomato and cucumber.', minutes: 30, kidFriendly: true, diets: [NF], budget: 2, effort: 1, mealTypes: DL, batchFriendly: false, ingredients: ['chicken thighs', 'pita', 'greek yogurt', 'cucumber', 'tomato', 'oregano'] },
  { name: 'Greek Lemon Chicken & Potatoes', cuisine: 'Mediterranean', description: 'One-pan roasted chicken and potatoes with lemon and oregano.', minutes: 60, kidFriendly: true, diets: [GF, DF, NF], budget: 1, effort: 1, mealTypes: D, batchFriendly: true, ingredients: ['chicken thighs', 'potatoes', 'lemon', 'garlic', 'oregano', 'olive oil'] },
  { name: 'Falafel Bowls', cuisine: 'Mediterranean', description: 'Crispy falafel with hummus, couscous and chopped salad.', minutes: 35, kidFriendly: false, diets: [V, DF, NF], budget: 1, effort: 2, mealTypes: DL, batchFriendly: false, ingredients: ['falafel mix', 'hummus', 'couscous', 'cucumber', 'tomato', 'tahini'] },
  { name: 'Shakshuka', cuisine: 'Mediterranean', description: 'Eggs poached in spiced tomato and pepper sauce.', minutes: 30, kidFriendly: false, diets: [V, GF, DF, NF, LC], budget: 1, effort: 1, mealTypes: [...B, ...D], batchFriendly: false, ingredients: ['eggs', 'crushed tomatoes', 'bell pepper', 'onion', 'cumin', 'paprika'] },

  // BBQ & Grill
  { name: 'Pulled Pork Sandwiches', cuisine: 'BBQ & Grill', description: 'Slow-cooked BBQ pulled pork on soft buns with slaw.', minutes: 30, kidFriendly: true, diets: [DF, NF], budget: 1, effort: 1, mealTypes: DL, batchFriendly: true, ingredients: ['pork shoulder', 'bbq sauce', 'buns', 'coleslaw mix'] },
  { name: 'Grilled Chicken Kebabs', cuisine: 'BBQ & Grill', description: 'Marinated chicken and veggie skewers off the grill.', minutes: 35, kidFriendly: true, diets: [GF, DF, NF, LC], budget: 2, effort: 1, mealTypes: D, batchFriendly: false, ingredients: ['chicken breast', 'zucchini', 'bell peppers', 'red onion', 'olive oil', 'lemon'] },
  { name: 'BBQ Ribs & Corn', cuisine: 'BBQ & Grill', description: 'Low-and-slow baby back ribs with grilled corn on the cob.', minutes: 180, kidFriendly: true, diets: [GF, DF, NF], budget: 3, effort: 3, mealTypes: D, batchFriendly: false, ingredients: ['baby back ribs', 'dry rub', 'bbq sauce', 'corn on the cob'] },
  { name: 'Steak & Baked Potatoes', cuisine: 'BBQ & Grill', description: 'Grilled steaks with loaded baked potatoes and salad.', minutes: 60, kidFriendly: true, diets: [GF, NF], budget: 3, effort: 1, mealTypes: D, batchFriendly: false, ingredients: ['ribeye steaks', 'russet potatoes', 'sour cream', 'butter', 'salad greens'] },
];
