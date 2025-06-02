import { redirect } from "next/navigation";
import { isValidRedirectUrl } from "./validation";

/**
 * Redirects to a specified path with an encoded message as a query parameter.
 * If the path is not valid, redirects to home page with an error message.
 * @param {('error' | 'success')} type - The type of message, either 'error' or 'success'.
 * @param {string} path - The path to redirect to. Must be a valid internal path.
 * @param {string} message - The message to be encoded and added as a query parameter.
 * @returns {never} This function doesn't return as it triggers a redirect.
 */
export function encodedRedirect(
  type: "error" | "success",
  path: string,
  message: string,
): never {
  // Si le chemin n'est pas valide, rediriger vers la page d'accueil avec un message d'erreur
  if (!isValidRedirectUrl(path)) {
    console.warn(`Tentative de redirection vers un chemin non autorisé: ${path}`);
    return redirect(`/?error=${encodeURIComponent("Redirection non autorisée")}`);
  }
  
  return redirect(`${path}?${type}=${encodeURIComponent(message)}`);
}
