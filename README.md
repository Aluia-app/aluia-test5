# AluIA Test 5

## Avvio rapido con gTab / localhost

1. **Clona il progetto** su gTab o sul tuo computer.
2. Crea un file `.env.local` (oppure esporta la variabile d'ambiente nel tuo terminale) con la riga:
   ```bash
   OPENAI_API_KEY=sk-...
   ```
   > Senza una chiave valida l'app funziona solo in modalità demo.
3. Installa le dipendenze del progetto (serve anche per poter usare `npm run dev` senza login Vercel):
   ```bash
   npm install
   ```
4. Avvia un server che monti gli endpoint `/api/*`. Hai due opzioni equivalenti:
   - **Vercel CLI** (richiede il login Vercel):
     ```bash
     npm install --global vercel   # una tantum
     vercel dev                    # oppure: npx vercel dev
     ```
   - **Server Node locale** (nessun login richiesto):
     ```bash
     npm run dev                   # avvia index.js con Express
     ```
   Entrambe le modalità montano `/api/chat` e `/api/tts`. Evita server statici (`npx serve .`, `python -m http.server`, ecc.), perché lasciano gli endpoint API scollegati e producono **404**.
5. Apri la pagina servita in **HTTPS** (oppure su `http://localhost`) per poter concedere il microfono.
6. Consenti l'accesso al microfono dal browser e ricarica la scheda se richiesto.

### Verifica rapida del backend

Con `vercel dev` **oppure** `npm run dev` in esecuzione apri la console del browser (tab Network) e controlla che le richieste `POST` a `http://localhost:3000/api/chat` e `http://localhost:3000/api/tts` rispondano con **200**. Un **404** indica che il server non sta montando le funzioni API corrette.

## Configurazione dell'assistente

1. **Sblocca il pannello amministratore**: fai doppio clic sullo sfondo della pagina e inserisci il codice `ALUIA2025`.
2. Premi l'icona ⚙️ che compare in basso a destra.
3. Verifica che il campo **Prompt ID** contenga già `pmpt_68b5876fea1081908e6b472c85d6489a042e34dea2f3df83` (il prompt del terapeuta richiesto).
4. Inserisci l'eventuale **Assistant ID** `asst_...` fornito da OpenAI (opzionale).
5. Scegli la voce TTS che preferisci e premi **Salva configurazione**.

Da questo momento puoi parlare con Alu: premi il grande pulsante 🎤 oppure scrivi nella chat testuale.

## Anteprima pronta su Vercel

L'ultima versione pubblica dell'app è disponibile all'indirizzo <https://aluia-test5.vercel.app/>.

- Accertati che nel progetto Vercel sia configurata la variabile `OPENAI_API_KEY`, altrimenti l'interfaccia rimarrà in modalità demo.
- L'interfaccia è identica a quella servita localmente: lo script `edv.js` è ora caricato dalla radice del progetto, quindi non è necessario alcun percorso personalizzato.
- Una volta aperta la pagina in gTab (o in un browser con HTTPS), sblocca il pannello ⚙️ e verifica che il Prompt ID sia `pmpt_68b5876fea1081908e6b472c85d6489a042e34dea2f3df83`.

## Perché su GitHub vedo solo il codice?

GitHub mostra i file del progetto così come sono salvati nel repository, quindi cliccando su `index.html` viene visualizzato il codice sorgente invece dell'interfaccia. Per usare davvero l'app devi **clonare il progetto** (ad esempio con gTab) e avviarlo tramite `vercel dev` o `npm run dev` (qualunque server che monti `/api/*`). Solo in questo modo il browser carica gli script, puoi sbloccare il pannello ⚙️ e parlare con l'assistente usando il prompt del terapeuta `pmpt_68b5876fea1081908e6b472c85d6489a042e34dea2f3df83`.
