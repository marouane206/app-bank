import React, { useState } from "react";
import { EyeIcon, EyeOffIcon } from "@heroicons/react/solid"; // Import des icônes

const Dashboard = () => {
  const [balance, setBalance] = useState(0);
  const [totalEntry, setTotalEntry] = useState(0);
  const [totalExit, setTotalExit] = useState(0);
  const [history, setHistory] = useState([]);
  const [amount, setAmount] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [recipientSurname, setRecipientSurname] = useState("");
  const [rib, setRib] = useState("");
  const [sendingAmount, setSendingAmount] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showTransferForm, setShowTransferForm] = useState(false);
  const [isBalanceVisible, setIsBalanceVisible] = useState(true); // Contrôler la visibilité du solde
  const [withdrawReason, setWithdrawReason] = useState(""); // Nouvelle variable pour la raison
  const [showReasonInput, setShowReasonInput] = useState(false); // Afficher le champ pour la raison

  const clearErrorMessage = () => {
    setTimeout(() => {
      setErrorMessage("");
    }, 3000);
  };

  // Fonction pour dépôt
  const handleDeposit = () => {
    const parsedAmount = parseFloat(amount);
    if (!isNaN(parsedAmount) && parsedAmount > 0) {
      setBalance((prev) => prev + parsedAmount);
      setTotalEntry((prev) => prev + parsedAmount);
      setHistory((prev) => [
        ...prev,
        `Dépôt de ${parsedAmount.toFixed(2)} MAD`,
      ]);
      setAmount("");
      setErrorMessage("");
    } else {
      setErrorMessage("Veuillez entrer un montant valide pour le dépôt.");
      clearErrorMessage();
    }
  };

  // Fonction pour retrait
  const handleWithdraw = () => {
    const parsedAmount = parseFloat(amount);
    if (!isNaN(parsedAmount) && parsedAmount > 0) {
      if (parsedAmount > balance) {
        setErrorMessage(
          "Votre solde est insuffisant pour effectuer cette transaction."
        );
        clearErrorMessage();
      } else {
        setShowReasonInput(true); // Afficher le champ pour la raison
      }
    } else {
      setErrorMessage("Veuillez entrer un montant valide pour le retrait.");
      clearErrorMessage();
    }
  };

  // Confirmer le retrait avec une raison
  const confirmWithdraw = () => {
    const parsedAmount = parseFloat(amount);
    if (withdrawReason.trim() !== "") {
      setBalance((prev) => prev - parsedAmount);
      setTotalExit((prev) => prev + parsedAmount);
      setHistory((prev) => [
        ...prev,
        `Retrait de ${parsedAmount.toFixed(2)} MAD (Raison : ${withdrawReason})`,
      ]);
      setAmount("");
      setWithdrawReason(""); // Réinitialiser la raison
      setShowReasonInput(false); // Masquer le champ
      setErrorMessage("");
    } else {
      setErrorMessage("Veuillez entrer une raison pour le retrait.");
      clearErrorMessage();
    }
  };

  // Fonction pour envoyer de l'argent
  const handleSendMoney = () => {
    const parsedAmount = parseFloat(sendingAmount);
    if (!isNaN(parsedAmount) && parsedAmount > 0 && parsedAmount <= balance) {
      if (rib.length === 16 && !isNaN(rib)) {
        setBalance((prev) => prev - parsedAmount); // Réduire le solde
        setTotalExit((prev) => prev + parsedAmount); // Ajouter à la sortie
        setHistory((prev) => [
          ...prev,
          `Envoi de ${parsedAmount.toFixed(2)} MAD à ${recipientName} ${recipientSurname} (RIB: ${rib})`,
        ]);
        setRecipientName("");
        setRecipientSurname("");
        setRib("");
        setSendingAmount("");
        setShowTransferForm(false);
        setErrorMessage(""); // Réinitialiser les erreurs
      } else {
        setErrorMessage("Le RIB doit contenir 16 chiffres.");
        clearErrorMessage();
      }
    } else {
      setErrorMessage("Montant insuffisant ou invalide.");
      clearErrorMessage();
    }
  };

  const renderHistoryItem = (item) => {
    if (item.startsWith("Dépôt")) {
      return <li className="text-sm text-green-500">{item}</li>; // Dépôt en vert
    } else if (item.startsWith("Retrait") || item.startsWith("Envoi")) {
      return <li className="text-sm text-red-500">{item}</li>; // Retrait ou Envoi en rouge
    }
    return <li className="text-sm text-gray-700">{item}</li>; // Par défaut
  };

  return (
    <div className="p-8">
      <div className="bg-gray-100 rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold mb-4">Tableau de Bord - MIF Bank</h1>

        {/* Affichage du solde */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
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
        </div>

        {/* Entrées et Sorties */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-green-100 p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold">Total Entrée :</h3>
            <p className="text-xl font-bold text-green-500">{totalEntry.toFixed(2)} MAD</p>
          </div>
          <div className="bg-red-100 p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold">Total Sortie :</h3>
            <p className="text-xl font-bold text-red-500">{totalExit.toFixed(2)} MAD</p>
          </div>
        </div>

        {/* Section pour dépôt et retrait */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <h3 className="text-lg font-semibold mb-2">Effectuer une Transaction :</h3>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Entrez le montant"
            className="w-full p-2 border rounded mb-4 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <div className="flex gap-4">
            <button
              onClick={handleDeposit}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Dépôt
            </button>
            <button
              onClick={handleWithdraw}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Retrait
            </button>
            <button
              onClick={() => setShowTransferForm(!showTransferForm)}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Envoyer de l'argent
            </button>
          </div>
        </div>

        {/* Champ pour la raison du retrait */}
        {showReasonInput && (
          <div className="bg-white p-4 rounded-lg shadow-md mb-6">
            <h3 className="text-lg font-semibold mb-2">Raison du Retrait :</h3>
            <input
              type="text"
              value={withdrawReason}
              onChange={(e) => setWithdrawReason(e.target.value)}
              placeholder="Entrez la raison"
              className="w-full p-2 border rounded mb-4 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <button
              onClick={confirmWithdraw}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Confirmer le Retrait
            </button>
          </div>
        )}

        {/* Formulaire d'envoi d'argent */}
        {showTransferForm && (
          <div className="bg-white p-4 rounded-lg shadow-md mb-6">
            <h3 className="text-lg font-semibold mb-2">Envoyer de l'argent :</h3>
            <input
              type="text"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              placeholder="Nom du destinataire"
              className="w-full p-2 border rounded mb-4 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <input
              type="text"
              value={recipientSurname}
              onChange={(e) => setRecipientSurname(e.target.value)}
              placeholder="Prénom du destinataire"
              className="w-full p-2 border rounded mb-4 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <input
              type="text"
              value={rib}
              onChange={(e) => setRib(e.target.value)}
              placeholder="RIB du destinataire (16 chiffres)"
              className="w-full p-2 border rounded mb-4 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <input
              type="number"
              value={sendingAmount}
              onChange={(e) => setSendingAmount(e.target.value)}
              placeholder="Montant à envoyer"
              className="w-full p-2 border rounded mb-4 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <button
              onClick={handleSendMoney}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Envoyer
            </button>
          </div>
        )}

        {/* Message d'erreur */}
        {errorMessage && (
          <div className="bg-red-200 text-red-800 p-3 rounded mb-4">
            {errorMessage}
          </div>
        )}

        {/* Historique des transactions */}
        <div className="bg-gray-50 p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Historique des Transactions :</h3>
          {history.length > 0 ? (
            <ul className="list-disc pl-5">
              {history.map((item, index) => (
                <React.Fragment key={index}>
                  {renderHistoryItem(item)}
                </React.Fragment>
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
