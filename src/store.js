// redux/store.js
import { configureStore } from '@reduxjs/toolkit';

// Exemple : Ajoutez vos slices ici (remplacez "counterSlice" par le vôtre si nécessaire)
import counterReducer from './counterSlice'; // Exemple d'un reducer

const store = configureStore({
  reducer: {
    counter: counterReducer, // Ajoutez tous vos reducers ici
  },
});

export default store;
