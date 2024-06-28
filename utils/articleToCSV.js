const utils = require("./utils");

// Write javascript to loop through all the files in the content/post directory and create a csv that contains the name of the files in the first column
// and the title of the article in the second column.

const getArticleData = async () => {
  const dir = "./content/post/";
  const files = await utils.getDirectory(dir);
  console.log(files);
  let csv = "title,slug,publishedDate,author,description,tags\n";
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const fileContent = await utils.readFile(dir + file, "utf8");
    // console.log(fileContent);
    let metadata = utils.substringbetween(fileContent, "---", "---").trim();
    try {
      metadata = metadata.replace(/[\n\r]/g, "");
      metadata = metadata.replace(/\s{2,10}/g, " ");
      metadata = metadata.replace(/, }/g, "}");
      metadata = metadata.replace(/},}/g, "}}");
      console.log(metadata);
      const metadataJSON = JSON.parse(metadata);
      const slug = metadataJSON.Slug;
      const title = metadataJSON.title;
      const publishedDate = metadataJSON.date;
      const author = metadataJSON.author.name;
      const description = metadataJSON.description;
      const tags = metadataJSON.tags;
      csv +=
        '"' +
        title +
        '"' +
        "," +
        slug +
        "," +
        publishedDate +
        "," +
        author +
        "," +
        '"' +
        description +
        '"' +
        "," +
        tags +
        "\n";
    } catch (error) {
      csv +=
        file +
        "," +
        "Error Reading" +
        "," +
        "" +
        "," +
        "" +
        "," +
        "" +
        "," +
        "" +
        "\n";
      console.log(file + " " + error);
    }
  }
  await utils.saveFile("./articleData.csv", csv);
};

getArticleData();
