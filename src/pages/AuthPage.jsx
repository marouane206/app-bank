import React, { useState } from 'react';

const AuthPage = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '', accountNumber: '' });
  const [showAccountNumber, setShowAccountNumber] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    window.location.href = `/dashboard/${credentials.username}`;
  };

  const toggleAccountNumberVisibility = () => {
    setShowAccountNumber(!showAccountNumber);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-indigo-600">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-4 sm:p-5">
          <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">
            Bienvenue à MIF Bank
          </h1>
          <p className="text-center text-blue-500 mb-8">
            Connectez-vous pour accéder à votre compte.
          </p>
          <form onSubmit={handleLogin}>
            <div className="mb-5">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-600 mb-2"
              >
                Nom d'utilisateur
              </label>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Votre nom d'utilisateur"
                value={credentials.username}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-700"
                required
              />
            </div>
            <div className="mb-5">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-600 mb-2"
              >
                Mot de passe
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Votre mot de passe"
                value={credentials.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-700"
                required
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="accountNumber"
                className="block text-sm font-medium text-gray-600 mb-2"
              >
                Numéro de compte
              </label>
              <div className="flex items-center">
                <input
                  type={showAccountNumber ? 'text' : 'password'}
                  id="accountNumber"
                  name="accountNumber"
                  placeholder="Votre numéro de compte"
                  value={credentials.accountNumber}
                  onChange={handleChange}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-700"
                  required
                />
                <button
                  type="button"
                  onClick={toggleAccountNumberVisibility}
                  className="px-3 py-2 hover:bg-gray-200 rounded-r-lg focus:outline-none"
                >
                  {showAccountNumber ? '👁️' : '👁️'}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              Se connecter
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
