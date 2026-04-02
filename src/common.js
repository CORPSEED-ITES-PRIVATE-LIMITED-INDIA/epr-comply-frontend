export const generateSlug = (text = "") => {
  return (
    text
      .toString()
      .toLowerCase()
      .trim()
      // replace spaces & special chars with -
      .replace(/[\s\W-]+/g, "-")
      // remove starting/ending -
      .replace(/^-+|-+$/g, "")
  );
};
