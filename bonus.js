// Importo useState da React per gestire lo stato locale
const { useState } = React;

// Componente Modal: lo uso per mostrare una finestra interattiva sopra la pagina
function Modal({ title, content, show = false, onClose = () => {}, onConfirm = () => {} }) {
  // Uso ReactDOM.createPortal per "teletrasportare" la modale fuori dal flusso normale del DOM
  return show && ReactDOM.createPortal(
    <div className="modal-container">
      <div className="modal">
        <h2>{title}</h2>
        {/* Qui inserisco il contenuto dinamico, come un input */}
        {content}
        {/* Bottoni per chiudere o confermare l’azione */}
        <div className="modalButtons">
          <button onClick={onClose}>Annulla</button>
          <button onClick={onConfirm}>Conferma</button>
        </div>
      </div>
    </div>,
    document.body // Inserisco la modale direttamente nel body
  );
}

// Componente principale per la Milestone Bonus
function ListaAnimaliConAPI() {
  // Stato per la lista di animali
  const [animali, setAnimali] = useState([]);

  // Stato per mostrare/nascondere la modale
  const [showModal, setShowModal] = useState(false);

  // Stato per il valore dell’input
  const [inputValue, setInputValue] = useState("");

  // Stato per gestire il caricamento dell’API
  const [loading, setLoading] = useState(false);

  // Stato per gestire eventuali errori
  const [error, setError] = useState("");

  // Funzione chiamata quando l’utente conferma l’aggiunta dell’animale
  async function confermaAnimale() {
    if (!inputValue.trim()) return; // Ignoro input vuoti

    setLoading(true);     // Mostro "Caricamento..."
    setError("");         // Resetto eventuali errori precedenti

    try {
      // Chiamo l’API locale con il nome dell’animale
      const response = await fetch(`http://localhost:3333/animals?search=${inputValue.trim()}`);
      const data = await response.json();

      //piccolo ritardo per vedere meglio lo spinner del caricamento
      await new Promise((resolve) => setTimeout(resolve, 800));


      // Se non trovo risultati, mostro un messaggio
      if (data.length === 0) {
        setError("Nessun animale trovato");
      } else {
        // Prendo il primo risultato e costruisco una card
        const animale = data[0];
        const card = {
          name: animale.name || inputValue.trim(),
          description: animale.description || "Descrizione non disponibile",
          image: animale.image?.trim() ? animale.image : "https://via.placeholder.com/150"
};

        // Aggiungo la card alla lista
        setAnimali([...animali, card]);
      }
    } catch (err) {
      // Gestisco errori di rete o altri problemi
      setError("Errore durante la ricerca dell'animale");
    }

    // Chiudo la modale e resetto lo stato
    setLoading(false);
    setInputValue("");
    setShowModal(false);
  }

  // Funzione per annullare l’aggiunta
  function annulla() {
    setInputValue("");
    setShowModal(false);
  }

  // Creo l’input da passare alla modale
  const inputContent = (
    <input
      type="text"
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      placeholder="Inserisci un animale"
    />
  );

  // Renderizzo il componente
  return (
    <>
      {/* Bottone per aprire la modale */}
      <button onClick={() => setShowModal(true)}>Aggiungi animale</button>

      {/* Modale con input e bottoni */}
      <Modal
        title="Nuovo animale"
        content={inputContent}
        show={showModal}
        onClose={annulla}
        onConfirm={confermaAnimale}
      />

      {/* Stato di caricamento */}
      {loading && <div className="spinner"></div>}

      {/* Messaggio di errore */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Lista degli animali come card */}
<details open={animali.length > 0}>
  <summary>Animali</summary>
  <div className="cards">
    {animali.map((animale, i) => (
      <div key={i} className="card">
        <h3>{animale.name}</h3>
        <img src={animale.image} alt={animale.name} />
        <p>{animale.description}</p>
      </div>
    ))}
  </div>
</details>
    </>
  );
}

// Montaggio del componente dentro il contenitore .lista-animali-api
const rootBonus = ReactDOM.createRoot(document.querySelector('.lista-animali-api'));
rootBonus.render(<ListaAnimaliConAPI />);