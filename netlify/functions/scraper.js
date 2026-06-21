const axios = require("axios");
const cheerio = require("cheerio");

exports.handler = async function(event, context) {
  try {
    const { data } = await axios.get("https://www.nse.co.ke/market-statistics/equity-board.html");
    const $ = cheerio.load(data);

    const results = [];
    $("table tbody tr").each((i, el) => {
      const ticker = $(el).find("td").eq(0).text().trim();
      const company = $(el).find("td").eq(1).text().trim();
      if (ticker && company) {
        results.push({ ticker, company });
      }
    });

    await axios.post("https://sheetdb.io/api/v1/ryq6j7fbhinf0", { data: results });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "SheetDB updated", count: results.length })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
