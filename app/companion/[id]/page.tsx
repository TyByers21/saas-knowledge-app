import { redirect } from 'next/navigation';

interface CompanionRedirectProps {
  params: { id: string };
}

export default function CompanionRedirect({ params }: CompanionRedirectProps) {
  const { id } = params;
  
  // Redirect to the correct URL format
  redirect(`/companions/${id}`);
  
  // This won't be reached due to the redirect, but is needed for TypeScript
  return null;
}