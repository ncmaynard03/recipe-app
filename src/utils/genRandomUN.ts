import * as fs from 'fs';

function generateRandomUsername(): string {

    const adjFilePath: string = "../assets/names/cooking-adj.txt"
    const nounFilePath: string = "../assets/names/cooking-noun.txt"

    const adjFileContent: string = fs.readFileSync(adjFilePath, 'utf-8');
    const nounFileContent: string = fs.readFileSync(nounFilePath, 'utf-8');

    const cookingAdjs: string[] = adjFileContent.split('\n');
    const cookingNouns: string[] = nounFileContent.split('\n');

    const adj: string = cookingAdjs[Math.floor(Math.random() * cookingAdjs.length)];
    const noun: string = cookingNouns[Math.floor(Math.random() * cookingNouns.length)];
    const unNum: number = Math.floor(Math.random() * 1000);

    const username = `${adj}${noun}${unNum}`;

    return username;
}

let username = generateRandomUsername();
console.log(username);