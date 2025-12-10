import { onMount } from "solid-js";
import { useNavigate } from "@solidjs/router";

export default function DashboardRedirect() {
  const navigate = useNavigate();
  onMount(() => navigate("/"));
  return null;
}

export const prerender = true;
