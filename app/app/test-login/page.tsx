
'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';

export default function TestLoginPage() {
  const [email, setEmail] = useState('john@doe.com');
  const [password, setPassword] = useState('password123');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleTestLogin = async () => {
    setIsLoading(true);
    setResult('Testing login...');
    
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setResult(`❌ Login failed: ${result.error}`);
      } else if (result?.ok) {
        setResult('✅ Login successful!');
      } else {
        setResult(`❓ Unexpected result: ${JSON.stringify(result)}`);
      }
    } catch (error) {
      setResult(`❌ Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestSession = async () => {
    setIsLoading(true);
    setResult('Checking session...');
    
    try {
      const response = await fetch('/api/auth/session');
      const session = await response.json();
      
      if (Object.keys(session).length === 0) {
        setResult('❌ No active session');
      } else {
        setResult(`✅ Session found: ${JSON.stringify(session, null, 2)}`);
      }
    } catch (error) {
      setResult(`❌ Session check error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestAPI = async () => {
    setIsLoading(true);
    setResult('Testing auth API...');
    
    try {
      const response = await fetch('/api/auth/providers');
      const providers = await response.json();
      setResult(`✅ Auth providers: ${JSON.stringify(providers, null, 2)}`);
    } catch (error) {
      setResult(`❌ API test error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">Login Debug Test</h1>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={handleTestLogin}
              disabled={isLoading}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              Test Login
            </button>
            <button
              onClick={handleTestSession}
              disabled={isLoading}
              className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              Check Session
            </button>
          </div>
          
          <button
            onClick={handleTestAPI}
            disabled={isLoading}
            className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 disabled:opacity-50"
          >
            Test Auth API
          </button>
          
          {result && (
            <div className="mt-6 p-4 bg-gray-50 border rounded-md">
              <pre className="whitespace-pre-wrap text-sm">{result}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
