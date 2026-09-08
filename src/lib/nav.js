/**
 * Shaping helpers for the header mega-menu and the footer link columns.
 * Pure functions, so they run on the server during render.
 */

export function formatMegaMenu(servicesData = [], blogsData = []) {
  const groupByCategory = (list = [], type) => {
    const map = {};

    list.forEach((item) => {
      const categoryId =
        item.categoryId ??
        item.category_id ??
        item.categorySlug ??
        item.categoryName;
      const categoryName = item.categoryName ?? "Others";
      const categoryDisplayOrder =
        item.categoryDisplayOrder ??
        item.categoryOrder ??
        item.category?.displayOrder ??
        item.displayOrderCategory ??
        0;

      const itemDisplayOrder = item.displayOrder ?? 0;

      if (!map[categoryId]) {
        map[categoryId] = {
          id: categoryId,
          title: categoryName,
          displayOrder: categoryDisplayOrder,
          items: [],
        };
      }

      map[categoryId].items.push({
        id: item.id,
        name: item.title,
        slug: item.slug,
        type,
        displayOrder: itemDisplayOrder,
      });
    });

    const categories = Object.values(map).map((cat) => ({
      title: cat.title,
      displayOrder: cat.displayOrder ?? 0,
      items: [...cat.items].sort(
        (a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0),
      ),
    }));

    categories.sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));

    return categories.map(({ displayOrder, ...rest }) => rest);
  };

  return {
    Blogs: { categories: groupByCategory(blogsData, "blog") },
    Services: { categories: groupByCategory(servicesData, "service") },
  };
}

export const groupServicesByCategory = (data = []) =>
  data.reduce((acc, item) => {
    if (!acc[item.categoryId]) {
      acc[item.categoryId] = {
        categoryName: item.categoryName,
        categorySlug: item.categorySlug,
        services: [],
      };
    }

    acc[item.categoryId].services.push({
      id: item.id,
      title: item.title,
      slug: item.slug,
    });

    return acc;
  }, {});

export const generateSlug = (text) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
