import path from 'path';

export const PORT = process.env.PORT || 5001;
export const JWT_SECRET = process.env.JWT_SECRET || 'uno-secret-key-super-secure-change-it-9988';
export const DB_FILE_PATH = path.join(__dirname, '..', 'database.json');
