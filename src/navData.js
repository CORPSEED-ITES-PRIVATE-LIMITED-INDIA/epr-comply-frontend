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

export function formatMegaMenu(servicesData, blogsData) {
  const serviceGroup = {};
  const blogGroup = {};

  // ----------- SERVICES API -----------
  servicesData?.length > 0 &&
    servicesData?.forEach((item) => {
      const category = item.categoryName;
      const serviceName = item.title;
      const serviceSlug = item?.slug;
      const type = "service";
      const id = item?.id;

      if (!serviceGroup[category]) {
        serviceGroup[category] = [];
      }

      serviceGroup[category].push({
        name: serviceName,
        slug: serviceSlug,
        type,
        id,
      });
    });

  // ----------- BLOGS API -----------
  blogsData?.length > 0 &&
    blogsData?.forEach((item) => {
      const category = item.categoryName;
      const blogTitle = item.title;
      const blogSlug = item?.slug;
      const type = "blog";
      const id = item?.id;

      if (!blogGroup[category]) {
        blogGroup[category] = [];
      }

      blogGroup[category].push({ name: blogTitle, slug: blogSlug, type, id });
    });

  // ----------- Build Final Structure -----------
  return {
    Blogs: {
      categories: Object?.keys(blogGroup)?.map((category) => ({
        title: category,
        items: blogGroup[category],
      })),
    },

    Services: {
      categories: Object?.keys(serviceGroup)?.map((category) => ({
        title: category,
        items: serviceGroup[category],
      })),
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
