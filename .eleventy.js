module.exports = function (eleventyConfig) {
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    const d = new Date(dateObj);
    return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  });

  eleventyConfig.addFilter("isoDate", (dateObj) => new Date(dateObj).toISOString());

  eleventyConfig.addFilter("rfc822Date", (dateObj) => new Date(dateObj).toUTCString());

  eleventyConfig.addFilter("slug", (str) =>
    String(str || "").toLowerCase().trim().replace(/\s+/g, "-")
  );

  const VERDICT_RATINGS = {
    true: 5,
    "mostly true": 4,
    misleading: 2,
    false: 1,
    unverified: 3,
  };
  eleventyConfig.addFilter("verdictRating", (verdict) =>
    VERDICT_RATINGS[String(verdict || "").toLowerCase()] || 3
  );

  eleventyConfig.addPassthroughCopy({ "src/admin": "admin" });
  eleventyConfig.addPassthroughCopy({ "src/css": "css" });
  eleventyConfig.addPassthroughCopy({ "src/images": "images" });

  eleventyConfig.addCollection("posts", function (collectionApi) {
    return collectionApi.getFilteredByGlob("src/posts/*.md").sort((a, b) => {
      return b.date - a.date;
    });
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
    },
  };
};
