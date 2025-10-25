import { createNode, updateNode, deleteNode, getChildren } from "~/server/crud";
import { buildTree } from "~/server/tree";
import { APIEvent } from "@solidjs/start/server";

export async function GET({ request }: APIEvent) {
    const url = new URL(request.url)

    return new Response(
        JSON.stringify({
            message: "Testing testing testing"
        }), {
        headers: { "Content-Type": "application/json" },
    });
}   