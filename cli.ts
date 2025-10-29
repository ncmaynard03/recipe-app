/// <reference types="node" />
import { changeParent, createNode, deleteNode, getNodeByName } from "./src/server/crud";
import { buildTree } from "./src/server/tree";
import { nodes } from "./src/server/data";
import { createInterface } from "readline/promises";
import { resolveCname } from "dns";
import { build } from "vite";
// import blessed from " blessed";

const rl = createInterface({
    input: process.stdin,
    output: process.stdout
});


async function main() {
    while (true) {
        const cmd = (await rl.question("\n\nEnter command (list, add, move, edit, delete, exit): \n> ")).trim().toLowerCase();

        if (cmd === "exit") {
            rl.close();
            process.exit(0);

        } else if (cmd === "list") {
            console.log("\n\nBuilding tree: ")
            printTree(buildTree());

        } else if (cmd === "add") {
            // prompt for folder or recipe
            const typeInput = (await rl.question("Add [F]older or [R]ecipe? ")).trim().toLowerCase();
            let type: "folder" | "recipe" = (typeInput === "f" || typeInput === "folder") ? "folder" : "recipe";

            // prompt for name
            const nameInput = (await rl.question(`Enter ${type} name: `)).trim();
            const name = nameInput || (type === "folder" ? "New Folder" : "New Recipe");

            //display to show current tree
            let nodes = buildTree();
            printTree(nodes);

            //prompt for parent dir
            const parentInput = (await rl.question(`Enter parent folder (leave blank for root): `)).trim();
            let parentNode = getNodeByName(parentInput);
            if (parentNode?.type !== "folder") {
                parentNode = undefined;
            }

            const parent = parentNode?.id || "root";


            createNode(name, type, parent, "# Example");
            console.log(`Added: ${name}`);

            //display to show new tree
            nodes = buildTree();
            printTree(nodes);
        } else if (cmd === "move") {
            // prompt for node to move
            const nameInput = (await rl.question(`Enter name of folder/recipe to move: `)).trim();
            const nodeToMove = getNodeByName(nameInput);

            if (!nodeToMove) {
                console.log("Node not found:", nameInput);
                continue;
            }

            //display to show current tree
            let nodes = buildTree();
            printTree(nodes);

            //prompt for new parent dir
            const parentInput = (await rl.question(`Enter new parent folder (leave blank for root): `)).trim();
            let parentNode = getNodeByName(parentInput);
            if (parentNode?.type !== "folder") {
                parentNode = undefined;
            }
            const newParent = parentNode?.id || "root";

            const movedNode = changeParent(nodeToMove.id, newParent);
            if (movedNode) {
                console.log(`Moved: ${movedNode.name} to new parent.`);
            } else {
                console.log("Failed to move node:", nameInput);
            }
        } else if (cmd === "edit") {
            let nodes = buildTree();
            printTree(nodes);

            const nameInput = (await rl.question(`Enter name of folder/recipe to edit: `)).trim();
            const nodeToEdit = getNodeByName(nameInput);
            if (!nodeToEdit) {
                console.log("Node not found:", nameInput);
                continue;
            }


            const cards = nodeToEdit.recipeCards || [];
            console.log(`Current recipe cards in "${nodeToEdit.name}":`);
            cards.forEach((card) => {
                console.log(card.title);
            });


        } else if (cmd === "delete") {

            //display to show current tree
            let nodes = buildTree();
            printTree(nodes);

            // prompt for node to delete
            const nameInput = (await rl.question(`Enter name of folder/recipe to delete: `)).trim();
            const nodeToDelete = getNodeByName(nameInput);

            if (!nodeToDelete) {
                console.log("Node not found:", nameInput);
                continue;
            }

            // Confirm deletion
            const confirm = (await rl.question(`Are you sure you want to delete "${nodeToDelete.name}"? (y/n): `)).trim().toLowerCase();
            if (confirm === "y" || confirm === "yes") {
                // TODO: Implement deleteNode function in CRUD
                deleteNode(nodeToDelete.id);
                console.log(`Deleted: ${nodeToDelete.name}`);
            } else {
                console.log("Deletion cancelled.");
            }
        } else {
            console.log("Unknown command:", cmd);
        }
    }
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

main();