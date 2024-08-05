const express = require('express')
const app = express()
const path = require('path')
const bodyParser = require('body-parser');
//const weaviate = require("weaviate-client");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'views')));
let initial_path = path.join(__dirname, "views");
const dotenv = require("dotenv");
dotenv.config();
const { default: weaviate } = require('weaviate-ts-client');

const client = weaviate.client({
  scheme: 'https',
  host: process.env.WEAVIATE_URL,  // Replace with your Weaviate endpoint
  apiKey: new weaviate.ApiKey(process.env.WEAVIATE_API_KEY),  // Replace with your Weaviate instance API key
  headers: {
    'X-Openai-Api-Key': process.env.OPENAI_API_KEY, // Ensure this header is included
  }
});

//rendering home page
app.get('/', (req, res) => {
  res.render(path.join(initial_path, "search.ejs"), { obj_info: {} });
})

//perform query for seached text
app.post('/', (req, res) => {
  let text = req.body['searched_data'];
  console.log(text)
  client.graphql
    .get()
    .withClassName('NewDocument')
    .withFields(["index", "holder", "production", "episodenumber", "part", "aititle", "aisubtitle", "aikeywords", "bibleverses", "biblecharacters", "bibleconcepts", "famouspeople", "booksmentioned", "lifeissues", "biblicallesson", "questionanswered", "bookofthebible", "aifirstgrader", "aisimple", "aielegant", "aicreative", "aibiblical", "aicasual", "aiformal", "ainewsanchor", "ailoving", "importantphrase", "christiantopics", "biblicalconcepts", "describingwords", "biblereferences", "biblephrases", "aiphdstudent", "booknumber", "episodetitle", "filename", "paragraph", "summary", "productionimage", "publisher", "publisherimage", "testament", "type", "booktitle", "_additional { certainty }"])
    .withNearText({
      concepts: [text]
    })
    .withLimit(20)
    .do()
    .then(info => {
      // console.log(info['data']['Get']['Document'][0]['_additional']['certainty'])
      console.log(info)
      res.render(path.join(initial_path, "search.ejs"), { obj_info: info['data']['Get']['NewDocument'] });
    })
    .catch(err => {
      console.error(err)
    })
})
app.get('/get_data', (req, res) => {
  const { filename, part } = req.query;
  console.log(req.query)
  client.graphql
    .get()
    .withClassName('NewDocument')
    .withFields(["index", "holder", "production", "episodenumber", "part", "aititle", "aisubtitle", "aikeywords", "bibleverses", "biblecharacters", "bibleconcepts", "famouspeople", "booksmentioned", "lifeissues", "biblicallesson", "questionanswered", "bookofthebible", "aifirstgrader", "aisimple", "aielegant", "aicreative", "aibiblical", "aicasual", "aiformal", "ainewsanchor", "ailoving", "importantphrase", "christiantopics", "biblicalconcepts", "describingwords", "biblereferences", "biblephrases", "aiphdstudent", "booknumber", "episodetitle", "filename", "paragraph", "summary", "productionimage", "publisher", "publisherimage", "testament", "type", "booktitle", "_additional { certainty }"])
    .withWhere(
      {
        operator: 'And',
        operands: [
          {
            operator: 'Equal',
            path: ['filename'],
            valueString: filename,
          }, {
            operator: 'Equal',
            path: ['part'],
            valueNumber: parseFloat(part),
          }]
      })
    .withLimit(20)
    .do()
    .then(info => {
      res.send(info['data']['Get']['NewDocument']);
    })
    .catch(err => {
      console.error(err)
    })
})
app.get('/get_filter', (req, res) => {
  const { field, value } = req.query;
  console.log(req.query)
  client.graphql
    .get()
    .withClassName('NewDocument')
    .withFields(["index", "holder", "production", "episodenumber", "part", "aititle", "aisubtitle", "aikeywords", "bibleverses", "biblecharacters", "bibleconcepts", "famouspeople", "booksmentioned", "lifeissues", "biblicallesson", "questionanswered", "bookofthebible", "aifirstgrader", "aisimple", "aielegant", "aicreative", "aibiblical", "aicasual", "aiformal", "ainewsanchor", "ailoving", "importantphrase", "christiantopics", "biblicalconcepts", "describingwords", "biblereferences", "biblephrases", "aiphdstudent", "booknumber", "episodetitle", "filename", "paragraph", "summary", "productionimage", "publisher", "publisherimage", "testament", "type", "booktitle", "_additional { certainty }"])
    .withWhere(
      {
        operator: 'Equal',
        path: [field],
        valueString: value,
      })
    .withLimit(20)
    .do()
    .then(info => {
      res.send(info['data']['Get']['NewDocument']);
    })
    .catch(err => {
      console.error(err)
    })
})
app.get('/all/:text', (req, res) => {
  const { text } = req.params;
  const { field, value, num_results, threshold } = req.query;
  console.log(field, value, num_results, threshold)
  if (field == null || value == null || field == '' || value == '') {
    console.log("hello")
    client.graphql
      .get()
      .withClassName('NewDocument')
      .withFields(["index", "holder", "production", "episodenumber", "part", "aititle", "aisubtitle", "aikeywords", "bibleverses", "biblecharacters", "bibleconcepts", "famouspeople", "booksmentioned", "lifeissues", "biblicallesson", "questionanswered", "bookofthebible", "aifirstgrader", "aisimple", "aielegant", "aicreative", "aibiblical", "aicasual", "aiformal", "ainewsanchor", "ailoving", "importantphrase", "christiantopics", "biblicalconcepts", "describingwords", "biblereferences", "biblephrases", "aiphdstudent", "booknumber", "episodetitle", "filename", "paragraph", "summary", "productionimage", "publisher", "publisherimage", "testament", "type", "booktitle", "_additional { certainty }"])
      .withWhere({
        "operator":"And",
        operands:[{
        "operator": "Or",
        "operands": [{
          operator: 'LessThan',
          path: ['index'],
          valueNumber: 139443,
        },
        {
          operator: 'GreaterThan',
          path: ['index'],
          valueNumber: 220574,
        }]},
        {
          operator: 'LessThan',
          path: ['index'],
          valueNumber: 99999900,
        }
      ]
      })
      .withNearText({
        concepts: [text],
        certainty: 0.7
      })
      .withLimit(20)
      .do()
      .then(info => {
        res.send(info['data']['Get']['NewDocument']);
      })
      .catch(err => {
        console.error(err)
      })
  }
  else {
    obj = []
    for (let i = 0; i < value.length; i++) {
      obj.push({
        path: field.split(" "),
        operator: 'Equal',
        valueString: value[i]
      })
    }
    parent_obj = {
      operator: 'Or',
      operands: obj
    }
    if (value.constructor == Array) {
      where_obj = {
        operator: 'And',
        operands: [
          parent_obj,
          {
            "operator":"And",
            operands:[{
            "operator": "Or",
            "operands": [{
              operator: 'LessThan',
              path: ['index'],
              valueNumber: 139443,
            },
            {
              operator: 'GreaterThan',
              path: ['index'],
              valueNumber: 220574,
            }]},
            {
              operator: 'LessThan',
              path: ['index'],
              valueNumber: 99999900,
            }
          ]
          }
        ]
      }
    }
    else {
      where_obj = {
        operator: 'And',
        operands: [
          {
            path: field.split(" "),
            operator: 'Equal',
            valueString: value
          },
          {
            operator: 'LessThan',
            path: ['index'],
            valueNumber: 99999900,
          },
          {
            "operator":"And",
            operands:[{
            "operator": "Or",
            "operands": [{
              operator: 'LessThan',
              path: ['index'],
              valueNumber: 139443,
            },
            {
              operator: 'GreaterThan',
              path: ['index'],
              valueNumber: 220574,
            }]},
            {
              operator: 'LessThan',
              path: ['index'],
              valueNumber: 99999900,
            }
          ]
          }
        ]
      }
    }
    console.log(parent_obj)
    client.graphql
      .get()
      .withClassName('NewDocument')
      .withFields(["index", "holder", "production", "episodenumber", "part", "aititle", "aisubtitle", "aikeywords", "bibleverses", "biblecharacters", "bibleconcepts", "famouspeople", "booksmentioned", "lifeissues", "biblicallesson", "questionanswered", "bookofthebible", "aifirstgrader", "aisimple", "aielegant", "aicreative", "aibiblical", "aicasual", "aiformal", "ainewsanchor", "ailoving", "importantphrase", "christiantopics", "biblicalconcepts", "describingwords", "biblereferences", "biblephrases", "aiphdstudent", "booknumber", "episodetitle", "filename", "paragraph", "summary", "productionimage", "publisher", "publisherimage", "testament", "type", "booktitle", "_additional { certainty }"])
      .withWhere(
        where_obj
      )
      .withNearText({
        concepts: [text],
        certainty: parseFloat(threshold)
      })
      .withLimit(parseInt(num_results))
      .do()
      .then(info => {
        res.send(info['data']['Get']['NewDocument']);
      })
      .catch(err => {
        console.error(err)
      })
  }
})
app.get('/:idx', (req, res) => {
  const { idx } = req.params;
  console.log(idx)
  client.graphql
    .get()
    .withClassName('NewDocument')
    .withFields(["_additional{id}"])
    .withWhere({
      operator: 'Equal',
      path: ['index'],
      valueNumber: parseInt(idx),
    })
    .withLimit(1)
    .do()
    .then(info => {
      id = info['data']['Get']['NewDocument'][0]['_additional']['id']
      client.graphql
        .get()
        .withClassName('NewDocument')
        .withFields(["index", "holder", "production", "episodenumber", "part", "aititle", "aisubtitle", "aikeywords", "bibleverses", "biblecharacters", "bibleconcepts", "famouspeople", "booksmentioned", "lifeissues", "biblicallesson", "questionanswered", "bookofthebible", "aifirstgrader", "aisimple", "aielegant", "aicreative", "aibiblical", "aicasual", "aiformal", "ainewsanchor", "ailoving", "importantphrase", "christiantopics", "biblicalconcepts", "describingwords", "biblereferences", "biblephrases", "aiphdstudent", "booknumber", "episodetitle", "filename", "paragraph", "summary", "productionimage", "publisher", "publisherimage", "testament", "type", "booktitle", "_additional { certainty }"])
        .withNearObject({ id: id })
        .do()
        .then(info2 => {
          info2['data']['Get']['NewDocument'].shift()
          res.render(path.join(initial_path, "search.ejs"), { obj_info: info2['data']['Get']['NewDocument'] });
        })
        .catch(err => {
          console.error(err)
        });
    })
    .catch(err => {
      console.error(err)
    })
})

app.get('/bible/:idx', (req, res) => {
  const { idx } = req.params;
  console.log(idx)
  client.graphql
    .get()
    .withClassName('NewDocument')
    .withFields(["_additional{id}"])
    .withWhere({
      operator: 'Equal',
      path: ['index'],
      valueNumber: parseInt(idx),
    })
    .withLimit(1)
    .do()
    .then(info => {
      id = info['data']['Get']['NewDocument'][0]['_additional']['id']
      client.graphql
        .get()
        .withClassName('NewDocument')
        .withFields(["index", "holder", "production", "episodenumber", "part", "aititle", "aisubtitle", "aikeywords", "bibleverses", "biblecharacters", "bibleconcepts", "famouspeople", "booksmentioned", "lifeissues", "biblicallesson", "questionanswered", "bookofthebible", "aifirstgrader", "aisimple", "aielegant", "aicreative", "aibiblical", "aicasual", "aiformal", "ainewsanchor", "ailoving", "importantphrase", "christiantopics", "biblicalconcepts", "describingwords", "biblereferences", "biblephrases", "aiphdstudent", "booknumber", "episodetitle", "filename", "paragraph", "summary", "productionimage", "publisher", "publisherimage", "testament", "type", "booktitle", "_additional { certainty }"])
        .withWhere({
          operator: 'GreaterThan',
          path: ['index'],
          valueNumber: 99999900,
        })
        .withNearObject({ id: id })
        .do()
        .then(info2 => {
          info2['data']['Get']['NewDocument'].shift()
          res.render(path.join(initial_path, "bible_results.ejs"), { obj_info: info2['data']['Get']['NewDocument'] });
        })
        .catch(err => {
          console.error(err)
        });
    })
    .catch(err => {
      console.error(err)
    })
})

app.get('/only_bible/:text', (req, res) => {
  const { text } = req.params;
  const { field, value } = req.query;
  if (field == null || value == null || field == '' || value == '') {
    client.graphql
      .get()
      .withClassName('NewDocument')
      .withFields(["index", "holder", "production", "episodenumber", "part", "aititle", "aisubtitle", "aikeywords", "bibleverses", "biblecharacters", "bibleconcepts", "famouspeople", "booksmentioned", "lifeissues", "biblicallesson", "questionanswered", "bookofthebible", "aifirstgrader", "aisimple", "aielegant", "aicreative", "aibiblical", "aicasual", "aiformal", "ainewsanchor", "ailoving", "importantphrase", "christiantopics", "biblicalconcepts", "describingwords", "biblereferences", "biblephrases", "aiphdstudent", "booknumber", "episodetitle", "filename", "paragraph", "summary", "productionimage", "publisher", "publisherimage", "testament", "type", "booktitle", "_additional { certainty }"])
      .withWhere({
        operator: 'GreaterThan',
        path: ['index'],
        valueNumber: 99999900,
      })
      .withNearText({
        concepts: [text],
        certainty: 0.7
      })
      .withLimit(20)
      .do()
      .then(info => {
        // console.log(info['data']['Get']['NewDocument'][0]['_additional']['certainty'])
        res.send(info['data']['Get']['NewDocument']);
      })
      .catch(err => {
        console.error(err)
      })
  }
  else {
    client.graphql
      .get()
      .withClassName('NewDocument')
      .withFields(["index", "holder", "production", "episodenumber", "part", "aititle", "aisubtitle", "aikeywords", "bibleverses", "biblecharacters", "bibleconcepts", "famouspeople", "booksmentioned", "lifeissues", "biblicallesson", "questionanswered", "bookofthebible", "aifirstgrader", "aisimple", "aielegant", "aicreative", "aibiblical", "aicasual", "aiformal", "ainewsanchor", "ailoving", "importantphrase", "christiantopics", "biblicalconcepts", "describingwords", "biblereferences", "biblephrases", "aiphdstudent", "booknumber", "episodetitle", "filename", "paragraph", "summary", "productionimage", "publisher", "publisherimage", "testament", "type", "booktitle", "_additional { certainty }"])
      .withWhere(
        {
          operator: 'And',
          operands: [
            {
              operator: 'GreaterThan',
              path: ['index'],
              valueNumber: 99999900,
            }, {
              operator: 'Equal',
              path: [field],
              valueString: value,
            }]
        }
      )
      .withNearText({
        concepts: [text],
        certainty: 0.7
      })
      .withLimit(20)
      .do()
      .then(info => {
        // console.log(info['data']['Get']['NewDocument'][0]['_additional']['certainty'])
        res.send(info['data']['Get']['NewDocument']);
      })
      .catch(err => {
        console.error(err)
      })
  }
})
app.get('/get_recommendation/:idx', (req, res) => {
  const { idx } = req.params;
  console.log(idx)
  client.graphql
    .get()
    .withClassName('NewDocument')
    .withFields(["_additional{id}"])
    .withWhere({
      operator: 'Equal',
      path: ['index'],
      valueNumber: parseInt(idx),
    })
    .withLimit(1)
    .do()
    .then(info => {
      id = info['data']['Get']['NewDocument'][0]['_additional']['id']
      console.log(id)
      client.graphql
        .get()
        .withClassName('NewDocument')
        .withFields(["index", "holder", "production", "episodenumber", "part", "aititle", "aisubtitle", "aikeywords", "bibleverses", "biblecharacters", "bibleconcepts", "famouspeople", "booksmentioned", "lifeissues", "biblicallesson", "questionanswered", "bookofthebible", "aifirstgrader", "aisimple", "aielegant", "aicreative", "aibiblical", "aicasual", "aiformal", "ainewsanchor", "ailoving", "importantphrase", "christiantopics", "biblicalconcepts", "describingwords", "biblereferences", "biblephrases", "aiphdstudent", "booknumber", "episodetitle", "filename", "paragraph", "summary", "productionimage", "publisher", "publisherimage", "testament", "type", "booktitle", "_additional { certainty }"])
        .withNearObject({ id: id })
        .do()
        .then(info2 => {
          info2['data']['Get']['NewDocument'].shift()
          res.send(info2['data']['Get']['NewDocument']);
        })
        .catch(err => {
          console.error(err)
        });
    })
    .catch(err => {
      console.error(err)
    })
})

app.get('/get_by_idx/:idx', (req, res) => {
  const { idx } = req.params;
  console.log(idx)
  client.graphql
    .get()
    .withClassName('NewDocument')
    .withFields(["index", "holder", "production", "episodenumber", "part", "aititle", "aisubtitle", "aikeywords", "bibleverses", "biblecharacters", "bibleconcepts", "famouspeople", "booksmentioned", "lifeissues", "biblicallesson", "questionanswered", "bookofthebible", "aifirstgrader", "aisimple", "aielegant", "aicreative", "aibiblical", "aicasual", "aiformal", "ainewsanchor", "ailoving", "importantphrase", "christiantopics", "biblicalconcepts", "describingwords", "biblereferences", "biblephrases", "aiphdstudent", "booknumber", "episodetitle", "filename", "paragraph", "summary", "productionimage", "publisher", "publisherimage", "testament", "type", "booktitle", "_additional { certainty }"])
    .withWhere({
      operator: 'Equal',
      path: ['index'],
      valueNumber: parseInt(idx),
    })
    .withLimit(1)
    .do()
    .then(info => {
      res.send(info['data']['Get']['NewDocument']);
    })
    .catch(err => {
      console.error(err)
    })
})

app.get('/get_data/', (req, res) => {
  const { filename, part } = req.params;
  console.log(filename, part)
  client.graphql
    .get()
    .withClassName('NewDocument')
    .withFields(["index", "holder", "production", "episodenumber", "part", "aititle", "aisubtitle", "aikeywords", "bibleverses", "biblecharacters", "bibleconcepts", "famouspeople", "booksmentioned", "lifeissues", "biblicallesson", "questionanswered", "bookofthebible", "aifirstgrader", "aisimple", "aielegant", "aicreative", "aibiblical", "aicasual", "aiformal", "ainewsanchor", "ailoving", "importantphrase", "christiantopics", "biblicalconcepts", "describingwords", "biblereferences", "biblephrases", "aiphdstudent", "booknumber", "episodetitle", "filename", "paragraph", "summary", "productionimage", "publisher", "publisherimage", "testament", "type", "booktitle", "_additional { certainty }"])
    .withWhere({
      operator: 'EqualTo',
      path: ['filename'],
      valueString: filename,
    })
    .withLimit(20)
    .do()
    .then(info => {
      res.send(info['data']['Get']['NewDocument']);
    })
    .catch(err => {
      console.error(err)
    })
})
app.listen(process.env.PORT || 3000,
  () => console.log(`The app is running on: http://localhost:${process.env.PORT || 3000}`)
) 