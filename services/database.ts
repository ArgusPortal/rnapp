import SQLite from 'react-native-sqlite-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configuração do SQLite
const db = SQLite.openDatabase(
  { name: 'academic_db', location: 'default' },
  () => console.log('Database conectado'),
  error => console.error('Database error:', error)
);

export const initDatabase = () => {
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS users 
      (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT);`
    );
  });
};

// Funções do AsyncStorage
export const storeData = async (key: string, value: any) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Erro ao salvar:', e);
  }
};

export const getData = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch (e) {
    console.error('Erro ao ler:', e);
    return null;
  }
};
