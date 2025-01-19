import { createSlice } from "@reduxjs/toolkit";

const transactionsSlice = createSlice({
  name: "transactions",
  initialState: {
    balance: 0,
    totalEntry: 0,
    totalExit: 0,
    history: [],
  },
  reducers: {
    deposit: (state, action) => {
      const amount = action.payload;
      state.balance += amount;
      state.totalEntry += amount;
      state.history.push(`Dépôt de ${amount.toFixed(2)} MAD`);
    },
    withdraw: (state, action) => {
      const { amount, reason } = action.payload;
      state.balance -= amount;
      state.totalExit += amount;
      state.history.push(
        `Retrait de ${amount.toFixed(2)} MAD (Raison : ${reason})`
      );
    },
    sendMoney: (state, action) => {
      const { amount, recipientName, recipientSurname, rib } = action.payload;
      state.balance -= amount;
      state.totalExit += amount;
      state.history.push(
        `Envoi de ${amount.toFixed(2)} MAD à ${recipientName} ${recipientSurname} (RIB: ${rib})`
      );
    },
  },
});

export const { deposit, withdraw, sendMoney } = transactionsSlice.actions;
export default transactionsSlice.reducer;
