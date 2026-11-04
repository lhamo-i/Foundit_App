// The grids have 2 columns. If the number of items is odd, we add an invisible
// "spacer" so the last card does not stretch across the full width.
export function padToEven(list) {
  if (list.length % 2 === 1) return [...list, { id: 'spacer', spacer: true }];
  return list;
}

// Puts bookmarked items first. Everything else keeps its original order.
// isSaved is a function: isSaved(id) -> true or false.
export function savedFirst(list, isSaved) {
  const saved = [];
  const others = [];
  list.forEach((item) => {
    if (isSaved(item.id)) saved.push(item);
    else others.push(item);
  });
  return [...saved, ...others];
}
