// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import weaviate, {WhereFilter} from 'weaviate-ts-client';

const client = weaviate.client({
    scheme: 'https',
    host: process.env.WEAVIATE_URL!,  // Replace with your Weaviate endpoint
    apiKey: new weaviate.ApiKey(process.env.WEAVIATE_API_KEY!),  // Replace with your Weaviate instance API key
    headers: {
        'X-Openai-Api-Key': process.env.OPENAI_API_KEY! // Ensure this header is included
    }
});
type Data = {
    name: string;
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>,
) {
    const { text, field, value, num_results, threshold } = req.query as Record<string, string>;
    let where_obj:  WhereFilter
    console.log(field, value, num_results, threshold)
    if (field == null || value == null || field == '' || value == '') {
        console.log("hello")
        const result = await  client.graphql
            .get()
            .withClassName('NewDocument')
            .withFields(["index", "holder", "production", "episodenumber", "part", "aititle", "aisubtitle", "aikeywords", "bibleverses", "biblecharacters", "bibleconcepts", "famouspeople", "booksmentioned", "lifeissues", "biblicallesson", "questionanswered", "bookofthebible", "aifirstgrader", "aisimple", "aielegant", "aicreative", "aibiblical", "aicasual", "aiformal", "ainewsanchor", "ailoving", "importantphrase", "christiantopics", "biblicalconcepts", "describingwords", "biblereferences", "biblephrases", "aiphdstudent", "booknumber", "episodetitle", "filename", "paragraph", "summary", "productionimage", "publisher", "publisherimage", "testament", "type", "booktitle", "_additional { certainty }"].toString())
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
                return info['data']['Get']['NewDocument'];
            })
        return res.status(200).json(result);

    }
    else {
        const obj = []
        for (let i = 0; i < value.length; i++) {
            obj.push({
                path: field.split(" "),
                operator: 'Equal',
                valueString: value[i]
            })
        }
        const parent_obj = {
            operator: 'Or',
            operands: obj
        }
        if (value.constructor == Array) {
             where_obj = {
                operator: 'And',
                operands: [
                    parent_obj as any,
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
        const result = await client.graphql
            .get()
            .withClassName('NewDocument')
            .withFields(["index", "holder", "production", "episodenumber", "part", "aititle", "aisubtitle", "aikeywords", "bibleverses", "biblecharacters", "bibleconcepts", "famouspeople", "booksmentioned", "lifeissues", "biblicallesson", "questionanswered", "bookofthebible", "aifirstgrader", "aisimple", "aielegant", "aicreative", "aibiblical", "aicasual", "aiformal", "ainewsanchor", "ailoving", "importantphrase", "christiantopics", "biblicalconcepts", "describingwords", "biblereferences", "biblephrases", "aiphdstudent", "booknumber", "episodetitle", "filename", "paragraph", "summary", "productionimage", "publisher", "publisherimage", "testament", "type", "booktitle", "_additional { certainty }"].toString())
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
                return info['data']['Get']['NewDocument'];
            })
        return res.status(200).json(result);
    }
}

