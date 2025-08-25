/**
 * Validates a redirect URL to prevent open redirect attacks
 * @param url The URL to validate
 * @returns boolean indicating if the URL is safe
 */
export function isValidRedirectUrl(url: string): boolean {
  if (!url.startsWith('/')) return false;
  
  if (url.includes('//')) return false;
  
  // Whitelist
  const allowedPaths = ['/protected', '/teams', '/news', '/calendar', '/about', '/contact', '/sign-up', '/sign-in'];
  return allowedPaths.some(path => url.startsWith(path));
}
