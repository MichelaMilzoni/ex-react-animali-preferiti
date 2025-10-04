// ✅ Importo i moduli necessari
const express = require('express'); // Per creare il server
const fs = require('fs');           // Per leggere file locali
const path = require('path');       // Per gestire i percorsi
const cors = require('cors');       // Per abilitare richieste da origini diverse (CORS)

const app = express();              // Inizializzo l'app Express
const PORT = 3333;                  // Imposto la porta su cui il server ascolta

// 📁 Costruisco il percorso assoluto al file animals.json dentro la cartella database
const animalsPath = path.join(__dirname, 'database', 'animals.json');

// 🌍 Abilito CORS per permettere richieste dal frontend (es. da 127.0.0.1:5500)
app.use(cors());


// 🧠 Endpoint principale: /animals
app.get('/animals', (req, res) => {
  // 🔎 Recupero il parametro di ricerca dalla query string (es. ?search=lion)
  const search = req.query.search?.toLowerCase();

  // 📖 Leggo il file animals.json ogni volta che arriva una richiesta
  fs.readFile(animalsPath, 'utf8', (err, data) => {
    if (err) {
      // ❌ Se c'è un errore nella lettura del file, lo segnalo
      console.error("Errore nel caricamento del file:", err.message);
      return res.status(500).json({ error: "Errore nel caricamento del database" });
    }

    let animals;
    try {
      // 🔄 Provo a convertire il contenuto del file da testo a oggetto JSON
      animals = JSON.parse(data);
    } catch (parseError) {
      // ❌ Se il file non è un JSON valido, lo segnalo
      console.error("Errore nel parsing del JSON:", parseError.message);
      return res.status(500).json({ error: "Formato JSON non valido" });
    }

    // 🧪 Se è presente un parametro di ricerca, filtro gli animali per nome
    const result = search
      ? animals.filter(a => a.name.toLowerCase().includes(search))
      : animals; // 🔁 Altrimenti restituisco tutti gli animali

    // 🖨️ Stampo in console per debug
    console.log("Richiesta ricevuta:", search || "tutti");
    console.log("Animali trovati:", result.length);

    // 📤 Invio la risposta al client
    res.json(result);
  });
});

// 🚀 Avvio il server sulla porta indicata
app.listen(PORT, () => {
  console.log(`✅ Server attivo su http://localhost:${PORT}`);
});
