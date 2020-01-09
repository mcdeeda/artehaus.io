const CleanCSS = require("clean-css");
const UglifyJS = require("uglify-es");
const htmlmin = require("html-minifier");

module.exports = function (eleventyConfig) {
  // Output directory: _site

  //filter to get a list of items and separate them into individual items separated by spaces
  eleventyConfig.addNunjucksFilter("separate", function(list) {
    let listTransform = list.map(x => x.toLowerCase().replace(" ", "-"));
    return listTransform.join(" ");
    // return list.join(" ");
  });

  // Minify CSS
  eleventyConfig.addFilter("cssmin", function (code) {
    return new CleanCSS({}).minify(code).styles;
  });

  // Minify JS
  eleventyConfig.addFilter("jsmin", function (code) {
    let minified = UglifyJS.minify(code);
    if (minified.error) {
      console.log("UglifyJS error: ", minified.error);
      return code;
    }
    return minified.code;
  });

  // Minify HTML output
  eleventyConfig.addTransform("htmlmin", function (content, outputPath) {
    if (outputPath.indexOf(".html") > -1) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true
      });
      return minified;
    }
    return content;
  });

  eleventyConfig.addCollection("projectCategories", function(collection){
    
    const categories = new Set();
    const projects = collection.getFilteredByTag("projects");

    for(const project of projects) {
      for(const tag of project.data.tags) {
        categories.add(tag);
      }
    }

    categories.delete("projects");
    categories.delete("pages");

    return Array.from(categories);

  });

  eleventyConfig.addPassthroughCopy("static/media/");
  eleventyConfig.addPassthroughCopy("admin");
  eleventyConfig.addPassthroughCopy("_includes/assets/");
};