import React, { useState } from 'react';
import { EyeIcon, EyeOffIcon } from "@heroicons/react/solid";

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
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-gray-800 to-black">
      {/* Arrière-plan décoratif */}
      <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{ backgroundImage: 'url("https://source.unsplash.com/1600x900/?finance,bank")' }}></div>

      {/* Conteneur principal */}
      <div className="relative bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl p-8 w-full max-w-md">
        {/* Logo ou titre */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white">
            <span className="text-blue-500">MIF Bank</span>
          </h1>
          <p className="text-gray-300 mt-2">Connectez-vous pour accéder à vos services bancaires.</p>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-300"
            >
              Nom d'utilisateur
            </label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Entrez votre nom d'utilisateur"
              value={credentials.username}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-900 bg-opacity-50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-200 placeholder-gray-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300"
            >
              Mot de passe
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Entrez votre mot de passe"
              value={credentials.password}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-900 bg-opacity-50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-200 placeholder-gray-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="accountNumber"
              className="block text-sm font-medium text-gray-300"
            >
              Numéro de compte
            </label>
            <div className="flex items-center">
              <input
                type={showAccountNumber ? 'text' : 'password'}
                id="accountNumber"
                name="accountNumber"
                placeholder="Entrez votre numéro de compte"
                value={credentials.accountNumber}
                onChange={handleChange}
                className="flex-1 px-4 py-2 bg-gray-900 bg-opacity-50 border border-gray-600 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-200 placeholder-gray-500"
                required
              />
              <button
                type="button"
                onClick={toggleAccountNumberVisibility}
                className="px-3 py-2 bg-gray-800 border-l border-gray-600 hover:bg-gray-700 rounded-r-lg focus:outline-none text-gray-400"
              >
                {showAccountNumber ? (
                  <EyeOffIcon className="h-5 w-5 text-gray-400" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
          >
            Se connecter
          </button>
        </form>

        {/* Pied de page */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-400">
            Besoin d'aide ? <a href="#" className="text-blue-500 hover:underline">Contactez-nous</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
