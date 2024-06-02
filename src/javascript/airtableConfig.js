var Airtable = require("airtable");

/*const apiKey =
  "patVOUGe3M7mOGXqb.77344cd25a712c80163cb56a3fc6070c196da3eeb4f372c2c1d96663f7b6574a";*/

Airtable.configure({
  endpointUrl: "https://api.airtable.com",
  apiKey:
    "patVOUGe3M7mOGXqb.77344cd25a712c80163cb56a3fc6070c196da3eeb4f372c2c1d96663f7b6574a",
});

/**
 *
 * Тестирую AIRTABLE   */
var Airtable = require("airtable");
var base = new Airtable({
  apiKey:
    "patVOUGe3M7mOGXqb.77344cd25a712c80163cb56a3fc6070c196da3eeb4f372c2c1d96663f7b6574a",
}).base("appvmFlls89ylXD9W");

const cardDecks = ["Познакомимся"];

export const getCardPair = (tId, dId) => {
  return new Promise((resolve, reject) => {
    const truths = [];
    const dares = [];

    base("Познакомимся?")
      .select({
        maxRecords: 80,
      })
      .firstPage()
      .then((result) => {
        result.forEach(function (record) {
          record.get("Type") === "Truth"
            ? truths.push(record.get("Card"))
            : dares.push(record.get("Card"));
        });
        const cards = { truth: truths[tId], dare: dares[dId] };
        resolve(cards);
      });
  });
};
