// app/account/error/page.js
'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { signIn } from 'next-auth/react';

function ErrorContent() {
  const params = useSearchParams();
  const error = params.get('error');

  useEffect(() => {
    if (error === 'SessionRequired') {
      signIn();
    }
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="bg-gray-800 p-6 rounded-lg border border-orange-500/20 max-w-md w-full">
        <h1 className="text-2xl font-bold text-white mb-4">Authentication Error</h1>
        <div className="text-gray-300 space-y-2">
          {error === 'Configuration' && (
            <p>Server configuration issue. Please contact support.</p>
          )}
          {error === 'AccessDenied' && (
            <p>You don't have permission to access this resource.</p>
          )}
          {error === 'Verification' && (
            <p>Token verification failed. Please try again.</p>
          )}
          {!error && <p>An unknown error occurred.</p>}
        </div>
        <button
          onClick={() => signIn()}
          className="mt-6 w-full bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded-lg transition-colors"
        >
          Sign In Again
        </button>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white">Loading...</div>
      </div>
    }>
      <ErrorContent />
    </Suspense>
  );
}