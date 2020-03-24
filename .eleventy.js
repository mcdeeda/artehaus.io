const CleanCSS = require("clean-css");
const UglifyJS = require("uglify-es");
const htmlmin = require("html-minifier");
const PROJECT_CATEGORIES = new Set();

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
        PROJECT_CATEGORIES.add(tag);
      }
    }

    categories.delete("projects");
    categories.delete("pages");
    PROJECT_CATEGORIES.delete("projects");
    PROJECT_CATEGORIES.delete("pages");


    return Array.from(categories);

  });

  // --- MARKED FOR DELETE ---
  eleventyConfig.addCollection("thumbnails", function(collection) {

    const thumbnails = {};
    const categories = Array.from(PROJECT_CATEGORIES);
    
    for(const category of categories) {
      const projects = collection.getFilteredByTag(category);
      const randomIndex = Math.floor(Math.random() * projects.length);

      console.log(`category: ${category}, randomIndex: ${randomIndex}, projects.length: ${projects.length}`);

      thumbnails[category] = {
        name: category,
        src: projects[randomIndex].data.thumbnailSrc,
        alt: projects[randomIndex].data.thumbnailAlt
      }
    }
    return thumbnails;
  });
  // --- END MARKED FOR DELETE ---

  eleventyConfig.addCollection("featured", function(collection){
    const featured = collection.getAll().filter(item => item.data.hasOwnProperty("featured"));
    return featured;
  });

  eleventyConfig.addPassthroughCopy("static/media/");
  eleventyConfig.addPassthroughCopy("admin");
  eleventyConfig.addPassthroughCopy("_includes/assets/");
};