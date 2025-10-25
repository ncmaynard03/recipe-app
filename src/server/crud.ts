import { loadNodes, saveNodes, RecipeNode } from "./data";

export function createNode(name: string, type: "folder" | "recipe", parentId: string | null = "root", content = ""): RecipeNode {
    const node: RecipeNode = {
        id: Date.now().toString(),
        name,
        type,
        parentId,
        content
    };

    const nodes = loadNodes();
    // console.log("\n\nCreating new node:", node);
    // console.log("\nCurrent nodes before addition:", nodes);

    nodes.push(node);
    saveNodes(nodes);

    // console.log("\nNodes after addition:", nodes);
    return node;
}

export function getNode(id: string): RecipeNode | undefined {
    const nodes = loadNodes();
    return nodes.find((node: { id: string; }) => node.id === id);
}

export function getNodeByName(name: string): RecipeNode | undefined {
    const nodes = loadNodes();
    return nodes.find((node: { name: string; }) => node.name.toLowerCase() === name.toLowerCase());
}

export function updateNode(id: string, updates: Partial<RecipeNode>): RecipeNode | undefined {
    const node = getNode(id);
    if (node) {
        Object.assign(node, updates);
    }
    return node;
}

export function deleteNode(id: string): boolean {
    const nodes = loadNodes();
    const index = nodes.findIndex((node: { id: string; }) => node.id === id);
    if (index !== -1) {
        nodes.splice(index, 1);
        return true;
    }
    return false;
}

export function getChildren(parentId: string): RecipeNode[] {
    const nodes = loadNodes();
    return nodes.filter((node: { parentId: string; }) => node.parentId === parentId);
}