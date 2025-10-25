import { loadNodes, RecipeNode } from "./data";

export function buildTree(parentId: string | null = "root"): RecipeNode[] {
    console.log("Building tree for parentId:", parentId);

    const nodes = loadNodes();
    // console.log("Current nodes:", nodes);
    return nodes
        .filter((n: { parentId: string | null; }) => n.parentId === parentId)
        .map((n: { id: string | null | undefined; name: any; type: string; }) => ({
            id: n.id,
            parentId: parentId,
            name: n.name,
            type: n.type,
            children: n.type === "folder" ? buildTree(n.id) : [],
        }));
}