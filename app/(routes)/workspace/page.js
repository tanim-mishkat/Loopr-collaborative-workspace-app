import { redirect } from "next/navigation";

export default function WorkspaceHomePage() {
    // Redirect to the first available workspace and document, or a fallback
    redirect("/dashboard"); // Change to your actual default or fallback
}