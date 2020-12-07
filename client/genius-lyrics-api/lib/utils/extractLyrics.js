const axios = require("axios");
const cio = require("cheerio-without-node-native");

/**
 * @param {string} url - Genius URL
 */
module.exports = async function (url) {
  try {
    url = "https://cors-anywhere.herokuapp.com/" + url;
    let { data } = await axios.get(url);

    const $ = cio.load(data);
    console.log($);
    let lyrics = $('div[class="lyrics"]').text().trim();
    console.log(lyrics);
    if (!lyrics) {
      lyrics = "";
      $('div[class^="Lyrics__Container"]').each((i, elem) => {
        if ($(elem).text().length !== 0) {
          let snippet = $(elem)
            .html()
            .replace(/<br>/g, "\n")
            .replace(/<(?!\s*br\s*\/?)[^>]+>/gi, "");
          lyrics += $("<textarea/>").html(snippet).text().trim() + "\n\n";
        }
      });
    }
    if (!lyrics) return null;
    return lyrics.trim();
  } catch (e) {
    throw e;
  }
};