
var recipes = [["dough", ["flour", "water"]],["mayo", ["egg", "egg"]],["bread", ["dough", "salt"]],["cheescake", ["dough", "sugar-cube"]],["sugar-cubes", ["sugar-cube", "sugar-cube"],["cheese", ["milk", "milk"]]],["cake", ["cheescake", "chocolate"]],["cherry-cheescake", ["cherry", "cheescake"]],["strawberry-cheescake", ["cheescake", "strawberry"]],["hamburger", ["steak", "bread"]],["waffle", ["bread", "egg"]],["sauce", ["tomato", "tomato"]],["salad", ["lettuce", "lettuce"]],["salad", ["tomato", "lettuce"]],["pizza", ["sauce", "cheese"]],["sushi", ["fish", "rice"]],["cookie", ["dough", "chocolate"]],["cupcake", ["cookie", "chocolate"]],["gingerbread-house", ["cookie", "cookie"]],["rice-cake", ["rice", "sugar-cube"]], ["rice-cake", ["rice", "cheescake"]], ["bento", ["sushi", "sushi"]]];


var allRecipes = recipes.reduce((comb, [first, second]) => {
  if (!comb.hasOwnProperty(second)) comb[second] = [];
  comb[second].push(first);
  return comb;
}, {});

module.exports = allRecipes;
