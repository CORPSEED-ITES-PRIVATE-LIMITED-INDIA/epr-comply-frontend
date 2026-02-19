export const megaMenu = {
  Blogs: {
    categories: [
      {
        title: "Company Registration",
        items: [
          "Private Limited Company Registration",
          "Public Limited Company Registration",
          "LLP Registration",
          "Partnership Firm Registration",
          "Sole Proprietorship Registration",
          "Startup India Registration",
          "OPC Registration",
          "Producer Company Registration",
        ],
      },
 
      {
        title: "Government Registration",
        items: [
          "NGO Registration",
          "Trust Registration",
          "Society Registration",
          "Virtual Office Registration",
          "Nidhi Company Registration",
        ],
      },
 
      {
        title: "FSSAI Registration",
        items: ["FSSAI Basic", "FSSAI State", "FSSAI Central"],
      },
 
      {
        title: "Trade License",
        items: ["Trade License Apply", "Renew Trade License"],
      },
    ],
  },
  Services: {
    categories: [
      {
        title: "IT Services",
        items: ["Web Development", "Mobile Apps", "UI/UX Design"],
      },
      {
        title: "Marketing",
        items: ["SEO", "Social Media", "Branding"],
      },
    ],
  },
};
 
export function formatMegaMenu(servicesData = [], blogsData = []) {
  const groupByCategory = (list = [], type) => {
    const map = {};
 
    list.forEach((item) => {
      const categoryId = item.categoryId ?? item.category_id ?? item.categorySlug ?? item.categoryName;
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
 
    // sort items inside each category
    const categories = Object.values(map).map((cat) => ({
      title: cat.title,
      displayOrder: cat.displayOrder ?? 0,
      items: [...cat.items].sort(
        (a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0),
      ),
    }));
 
    // sort categories
    categories.sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
 
    // remove displayOrder field if you don’t want it in final output
    return categories.map(({ displayOrder, ...rest }) => rest);
  };
 
  return {
    Blogs: {
      categories: groupByCategory(blogsData, "blog"),
    },
    Services: {
      categories: groupByCategory(servicesData, "service"),
    },
  };
}
 
export const groupServicesByCategory = (data = []) => {
  return data.reduce((acc, item) => {
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
};


export const cards = [
  {
    img: "/icons/save-money.png",
    title: "Save Your Money",
    text: "Save money on utilities & increase property value using solar power.",
  },
  {
    img: "/icons/home-energy.png",
    title: "Your Home Is Energy",
    text: "Use free solar energy every day with a sustainable rooftop setup.",
  },
  {
    img: "/icons/consult.png",
    title: "Consult & Planning",
    text: "Our industrial solar systems are engineered to serve large clients.",
  },
  {
    img: "/icons/engineers.png",
    title: "Certified Engineers",
    text: "Our certified solar engineers design reliable systems for all.",
  },
];
 
export const generateSlug = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "") // remove special chars
    .replace(/\s+/g, "-") // spaces to hyphen
    .replace(/-+/g, "-"); // avoid multiple hyphens
};