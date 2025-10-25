/// <reference types="node" />
import { createNode, getNodeByName } from "./src/server/crud";
import { buildTree } from "./src/server/tree";
import { nodes } from "./src/server/data";
import { createInterface } from "readline/promises";
import { resolveCname } from "dns";
import { build } from "vite";

const cmd = process.argv[2];
const rl = createInterface({
    input: process.stdin,
    output: process.stdout
});

if (cmd === "list") {
    console.log("\n\nBuilding tree: ")
    printTree(buildTree());

} else if (cmd === "add") {
    // prompt for folder or recipe
    rl.question("Add [F]older or [R]ecipe? ").then((res) => {
        const typeInput = res.trim().toLowerCase();
        let type: "folder" | "recipe" = (typeInput === "f" || typeInput === "folder") ? "folder" : "recipe";

        // prompt for name
        rl.question(`Enter ${type} name: `).then((res) => {
            const name = res.trim();

            //prompt for parent dir
            rl.question(`Enter parent folder (leave blank for root): `).then((res) => {
                let parentNode = getNodeByName(res.trim());
                if (parentNode?.type !== "folder") {
                    parentNode = undefined;
                }

                const parent = parentNode?.id || "root";
                rl.close();

                const nodes = buildTree();

                printTree(nodes);
                createNode(name, type, parent, "# Example");
                console.log(`Added: ${name}`);
            });
        });
    });
} else {
    console.log("Usage: npm run cli <list|add> [name]");
}


function printTree(nodes: any, depth = 0, folderIndex = 0) {
    nodes.forEach((node: { name: string; type: "folder" | "recipe"; children: any; }) => {
        let end = "";
        if (node.type === "folder") {
            end = "* " + node.name
        }
        else {
            end = "- " + node.name;
        }

        console.log("  ".repeat(depth) + end);
        printTree(node.children, depth + 1, folderIndex);
    });
}