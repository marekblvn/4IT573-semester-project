# 4IT573-semester-project
Semestrální projekt k předmětu 4IT573 - Základy Node.js

## Cíl projektu
Cílem je vytvořit hru pomocí websockets, kde PC monitor slouží jako displej a mobilní zařízení jako ovladač.

## Nápady
- Mohlo by jít o karetní hru - na mobilním zařízení by hráči viděli svoje karty, na PC hrací stůl, odhozené karty a skryté karty ostatních hráčů.
- Je potřeba, aby součástí byla správa hráčů (registrace / přihlášení) a místností (vytvoření, připojení).

## To start
1. Run Prisma migration
   - `npx prisma migrate dev --name <name>`
2. Generate Prisma files
   - `npx prisma generate`
3. Run docker compose
   - `docker-compose up --build`
