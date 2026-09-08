/**
 * Builds the repeated item list for a CSS marquee.
 *
 * The track animates `translateX(0 -> -50%)`, so the loop only looks seamless
 * when half the track is (a) an exact whole number of copies and (b) at least
 * as wide as the widest viewport it has to cover. With a short list - one blog
 * post, say - a fixed "duplicate it twice" gives a visible gap on desktop, so
 * the number of copies is derived from the item width instead.
 *
 * @param {Array} items      source list
 * @param {number} itemWidth rendered width of one item including its gap, in px
 * @param {number} minPeriod minimum width of one animation period, in px
 */
export function marqueeTrack(items = [], itemWidth = 300, minPeriod = 1600) {
  if (items.length === 0) return { items: [], animated: false };

  const copyWidth = items.length * itemWidth;

  // A handful of cards fits on screen without scrolling, so animating them
  // would only add duplicate DOM nobody sees. Render the row as-is instead.
  if (copyWidth < 1200) {
    return {
      items: items.map((item, i) => ({ item, key: i, duplicate: false })),
      animated: false,
    };
  }

  const copiesPerPeriod = Math.max(1, Math.ceil(minPeriod / copyWidth));
  const total = copiesPerPeriod * 2;

  return {
    items: Array.from({ length: total * items.length }, (_, i) => ({
      item: items[i % items.length],
      key: i,
      // Everything past the first pass is presentational only.
      duplicate: i >= items.length,
    })),
    animated: true,
  };
}
