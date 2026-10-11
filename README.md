# Virágbolt Beosztás

Műszakbeosztó egy virágbolt számára: napi létszám, igazságos óra- és hétvége-elosztás, szabadság- és szabadnapkérelmek, főnöki jóváhagyás.

Az oldal tartalma jelszóval titkosítva van (AES-256-GCM, PBKDF2 600 000 körrel), a forráskódban csak a titkosított adat látszik. Eszközönként egyszer kell megadni a jelszót.

Közzététel: Settings → Pages → Branch: `main`, mappa: `/ (root)`.

## Közös tárolás

Az adatok titkosítva a Netlify Blobs tárolóban vannak (`netlify/functions/data.mjs`, útvonal: `/api/data`). A szerver csak titkosított adatot lát. A függvény a `WRITE_TOKEN` környezeti változóval ellenőrzi a kéréseket, ami a jelszóból származik.
