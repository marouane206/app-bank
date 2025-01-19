import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { deposit, withdraw, sendMoney } from "../counterSlice.js";
import { EyeIcon, EyeOffIcon } from "@heroicons/react/solid";
import axios from "axios";
import { useParams } from "react-router-dom";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { balance, totalEntry, totalExit, history } = useSelector(
    (state) => state.transactions
  );

  const [amount, setAmount] = useState("");
  const [withdrawReason, setWithdrawReason] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [recipientSurname, setRecipientSurname] = useState("");
  const [rib, setRib] = useState("");
  const [sendingAmount, setSendingAmount] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showTransferForm, setShowTransferForm] = useState(false);
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const { username } = useParams();

  // Conversion de devise
  const [convertedBalance, setConvertedBalance] = useState(null);
  const [selectedCurrency, setSelectedCurrency] = useState("EUR");
  const [conversionRates, setConversionRates] = useState({});
  const API_URL = "https://api.exchangerate-api.com/v4/latest/MAD";

  useEffect(() => {
    const fetchConversionRates = async () => {
      try {
        const response = await axios.get(API_URL);
        setConversionRates(response.data.rates);
      } catch (error) {
        console.error("Erreur lors de la récupération des taux de conversion :", error);
      }
    };

    fetchConversionRates();
  }, []);

  useEffect(() => {
    if (conversionRates[selectedCurrency]) {
      setConvertedBalance((balance * conversionRates[selectedCurrency]).toFixed(2));
    }
  }, [selectedCurrency, balance, conversionRates]);

  const handleCurrencyChange = (e) => {
    const currency = e.target.value;
    setSelectedCurrency(currency);
  };

  const handleDeposit = () => {
    const parsedAmount = parseFloat(amount);
    if (!isNaN(parsedAmount) && parsedAmount > 0) {
      dispatch(deposit(parsedAmount));
      setAmount("");
    } else {
      setErrorMessage("Veuillez entrer un montant valide pour le dépôt.");
    }
  };

  const handleWithdraw = () => {
    const parsedAmount = parseFloat(amount);
    if (!isNaN(parsedAmount) && parsedAmount > 0 && withdrawReason.trim() !== "") {
      if (parsedAmount <= balance) {
        dispatch(withdraw({ amount: parsedAmount, reason: withdrawReason }));
        setAmount("");
        setWithdrawReason("");
      } else {
        setErrorMessage("Solde insuffisant pour effectuer ce retrait.");
      }
    } else {
      setErrorMessage("Montant ou raison invalide.");
    }
  };

  const handleSendMoney = () => {
    const parsedAmount = parseFloat(sendingAmount);
    if (parsedAmount > 0 && parsedAmount <= balance && /^\d{16}$/.test(rib)) {
      dispatch(sendMoney({ amount: parsedAmount, recipientName, recipientSurname, rib }));
      setRecipientName("");
      setRecipientSurname("");
      setRib("");
      setSendingAmount("");
      setShowTransferForm(false);
    } else {
      setErrorMessage(
        parsedAmount > balance
          ? "Montant insuffisant pour effectuer le transfert."
          : "Le RIB doit contenir 16 chiffres."
      );
    }
  };

  const renderHistoryItem = (item) => {
    if (item.startsWith("Dépôt")) {
      return <li className="text-sm text-green-500">{item}</li>;
    } else if (item.startsWith("Retrait") || item.startsWith("Envoi")) {
      return <li className="text-sm text-red-500">{item}</li>;
    }
    return <li className="text-sm text-gray-700">{item}</li>;
  };

  // États pour afficher les formulaires de dépôt et retrait
  const [showDepositForm, setShowDepositForm] = useState(false);
  const [showWithdrawForm, setShowWithdrawForm] = useState(false);

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-xl sm:text-3xl font-bold text-blue-700 mb-6 text-center">
          Bienvenue {username} à MIF Bank
        </h1>

        {/* Solde */}
        <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-6">
          <h2 className="text-lg font-semibold mb-2">Votre Solde :</h2>
          {isBalanceVisible ? (
            <p className="text-2xl font-bold text-green-500">{balance.toFixed(2)} MAD</p>
          ) : (
            <p className="text-2xl font-bold text-green-500">**********</p>
          )}
          <button
            onClick={() => setIsBalanceVisible(!isBalanceVisible)}
            className="mt-2 text-blue-500 hover:text-blue-700 flex items-center"
          >
            {isBalanceVisible ? (
              <EyeOffIcon className="h-6 w-6" />
            ) : (
              <EyeIcon className="h-6 w-6" />
            )}
          </button>
          {/* Sélecteur de devise */}
          <div className="flex justify-between items-center mt-2">
    {/* Sélecteur de devise */}
    <select
      value={selectedCurrency}
      onChange={handleCurrencyChange}
      className="p-2 border rounded bg-white text-gray-700"
    >
      {Object.keys(conversionRates).map((currency) => (
        <option key={currency} value={currency}>
          {currency}
        </option>
      ))}
    </select>

    {/* Solde Converti */}
{convertedBalance && (
  <div className="text-lg text-gray-500">
    {selectedCurrency}: <span className="text-2xl font-bold text-gray-700">{convertedBalance}</span>
  </div>
)}

  </div>
        </div>

        {/* Totaux des entrées et sorties */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-green-100 p-4 rounded-lg shadow-md">
            <h3 className="text-sm sm:text-lg font-semibold text-green-800">Total Entrée :</h3>
            <p className="text-lg sm:text-xl font-bold text-green-600">{totalEntry.toFixed(2)} MAD</p>
          </div>
          <div className="bg-red-100 p-4 rounded-lg shadow-md">
            <h3 className="text-sm sm:text-lg font-semibold text-red-800">Total Sortie :</h3>
            <p className="text-lg sm:text-xl font-bold text-red-600">{totalExit.toFixed(2)} MAD</p>
          </div>
        </div>

        {/* Transactions */}
        <div className="bg-blue-50 p-4 rounded-lg shadow-md mb-6">
          <h3 className="text-sm sm:text-lg font-semibold mb-2 text-blue-800">Effectuer une Transaction :</h3>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => setShowDepositForm(!showDepositForm)}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
            >
              Déposer
            </button>
            <button
              onClick={() => setShowWithdrawForm(!showWithdrawForm)}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
            >
              Retirer
            </button>
            <button
              onClick={() => setShowTransferForm(!showTransferForm)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            >
              Envoyer de l'argent
            </button>
          </div>
        </div>

        {/* Formulaire Dépôt */}
        {showDepositForm && (
          <div className="mb-6">
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Montant"
              className="p-2 border rounded w-full mb-2"
            />
            <button
              onClick={handleDeposit}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Déposer
            </button>
          </div>
        )}

        {/* Formulaire Retrait */}
        {showWithdrawForm && (
          <div className="mb-6">
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Montant"
              className="p-2 border rounded w-full mb-2"
            />
            <input
              type="text"
              value={withdrawReason}
              onChange={(e) => setWithdrawReason(e.target.value)}
              placeholder="Raison du retrait"
              className="p-2 border rounded w-full mb-2"
            />
            <button
              onClick={handleWithdraw}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Retirer
            </button>
          </div>
        )}

        {/* Formulaire Envoi d'argent */}
        {showTransferForm && (
          <div className="bg-white p-4 rounded-lg shadow-md mb-6">
            <input
              type="text"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              placeholder="Nom du destinataire"
              className="p-2 border rounded w-full mb-2"
            />
            <input
              type="text"
              value={recipientSurname}
              onChange={(e) => setRecipientSurname(e.target.value)}
              placeholder="Prénom du destinataire"
              className="p-2 border rounded w-full mb-2"
            />
            <input
              type="text"
              value={rib}
              onChange={(e) => setRib(e.target.value)}
              placeholder="RIB (16 chiffres)"
              className="p-2 border rounded w-full mb-2"
            />
            <input
              type="text"
              value={sendingAmount}
              onChange={(e) => setSendingAmount(e.target.value)}
              placeholder="Montant"
              className="p-2 border rounded w-full mb-2"
            />
            <button
              onClick={handleSendMoney}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            >
              Envoyer
            </button>
          </div>
        )}

        {/* Historique */}
        <div className="bg-gray-50 p-4 rounded-lg shadow-md mt-6">
          <h3 className="text-lg font-semibold mb-2">Historique des Transactions :</h3>
          {history.length > 0 ? (
            <ul className="list-disc pl-5">
              {history.map((item, index) => (
                <React.Fragment key={index}>{renderHistoryItem(item)}</React.Fragment>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">Aucune transaction pour le moment.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
