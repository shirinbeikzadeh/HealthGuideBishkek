export function searchItems(items, query, category = 'all') {
  const terms = query.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
  return items.filter(item => category === 'all' || item.kind === category).map(item => {
    const title = item.title.toLocaleLowerCase();
    const haystack = (item.title + ' ' + item.summary + ' ' + (item.keywords || '')).toLocaleLowerCase();
    if (!terms.every(term => haystack.includes(term))) return null;
    return { ...item, score: terms.reduce((score, term) => score + (title.includes(term) ? 3 : 1), 0) };
  }).filter(Boolean).sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));
}
