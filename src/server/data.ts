export type NodeType = "folder" | "recipe";
import fs from "fs";

//temporary save file, delete later for supabase
const file = "data.json";

export interface RecipeNode {
    id: string;
    name: string;
    type: NodeType;
    parentId: string | null;
    content?: string;
}

export const nodes: RecipeNode[] = [
    { id: "root", name: "Root", type: "folder", parentId: null }
];


export function loadNodes() {
    if (fs.existsSync(file)) {
        return JSON.parse(fs.readFileSync(file, "utf8"));
    }
    return [{ id: "root", name: "Root", type: "folder", parentId: null }];
}

export function saveNodes(nodes: any) {
    fs.writeFileSync(file, JSON.stringify(nodes, null, 2));
}