import { unified } from "unified";
import remarkParse from "remark-parse";
import {readFileSync, write} from "fs";
import { inspect } from "util";

import rehypeStringify from "rehype-stringify";
import remarkRehype from "remark-rehype";
import { type } from "os";

import { writeFileSync } from "fs";

function getTextContent(node){
    let text = '';
    if(node.children){
        for(const child of node.children){
            if(child.type === 'text'){
                text += child.value;
            }
        }
    }
    return text;
}

function transformNode(node){
    switch(node.type){
        case 'heading':
            return{
                type:'heading',
                level: node.depth,
                content: getTextContent(node)
            };
        case 'paragraph':
            
                return{
                    type:'paragraph',
                    content: getTextContent(node)
                };
            
        case 'list':
            return{
                type:'list',
                ordered: node.ordered || false,
                items: node.children.map(listItem => getTextContent(listItem.children[0]))
            };
        case 'code':
            return{
                type:'code',
                language: node.lang || null,
                content: node.value
            };
        case 'blockquote':
            return{
                type:'quote',
                content: getTextContent(node)
            };
        default:
            return null;
    }
}


const inputFile = 'input/sample.md';

const fileContent = readFileSync(inputFile, 'utf-8');

const ast = await unified().use(remarkParse).parse(fileContent);



const cards = [];
let currentCard = [];
for (const node of ast.children) {
  console.log(`Processing node of type: ${node.type}`);
  const isDelimiter = 
    node.type ==='heading' &&
    node.children.length === 1 &&
    node.children[0].type === 'text' &&
    node.children[0].value.trim() === 'c-a-r-d';
  if (isDelimiter) {
    if (currentCard.length > 0) {
        cards.push(currentCard);
        console.log(`Card delimiter found. Current card pushed. Total cards: ${cards.length}`);
    }
    currentCard = [];
  } else {
    currentCard.push(node);
  }
}


if (currentCard.length > 0) {
    cards.push(currentCard);
}



//  console.log(
//      inspect(cards, { depth: null, colors: true })
// );
console.log(`Found ${cards.length} cards.`);
console.log('cards:',inspect(cards[0], { depth: null, colors: true }));


const finalJson = {
    cards: cards.map((nodes,index) => ({
        id: `card-${index + 1}`,
        blocks: nodes.map(transformNode).filter(n => n !== null)
    }))
};

writeFileSync('output/cards.json', JSON.stringify(finalJson, null, 2), 'utf-8');
console.log('Transformed cards written to output/cards.json');

console.log(JSON.stringify(finalJson, null, 2));