# AluIA Test 5

## Avvio rapido con gTab / localhost

1. **Clona il progetto** su gTab o sul tuo computer.
2. Imposta la variabile d'ambiente `OPENAI_API_KEY` con una chiave valida.
3. Avvia un server statico dalla cartella del progetto, ad esempio:
   ```bash
   npx serve .
   ```
   oppure
   ```bash
   vercel dev
   ```
4. Apri la pagina servita in **HTTPS** (oppure su `http://localhost`) per poter concedere il microfono.
5. Consenti l'accesso al microfono dal browser e ricarica la scheda se richiesto.

## Configurazione dell'assistente

1. **Sblocca il pannello amministratore**: fai doppio clic sullo sfondo della pagina e inserisci il codice `ALUIA2025`.
2. Premi l'icona ⚙️ che compare in basso a destra.
3. Verifica che il campo **Prompt ID** contenga già `pmpt_68b5876fea1081908e6b472c85d6489a042e34dea2f3df83` (il prompt del terapeuta richiesto).
4. Inserisci l'eventuale **Endpoint API personalizzato** se stai usando un backend diverso (ad esempio l'URL di Vercel con `/api`).
5. Inserisci l'eventuale **Assistant ID** `asst_...` fornito da OpenAI (opzionale).
6. Scegli la voce TTS che preferisci e premi **Salva configurazione**.

Da questo momento puoi parlare con Alu: premi il grande pulsante 🎤 oppure scrivi nella chat testuale.

## Anteprima pronta su Vercel

L'ultima versione pubblica dell'app è disponibile all'indirizzo <https://aluia-test5.vercel.app/>.

- Accertati che nel progetto Vercel sia configurata la variabile `OPENAI_API_KEY`, altrimenti l'interfaccia rimarrà in modalità demo.
- L'interfaccia è identica a quella servita localmente: lo script `edv.js` è ora caricato dalla radice del progetto, quindi non è necessario alcun percorso personalizzato.
- Una volta aperta la pagina in gTab (o in un browser con HTTPS), sblocca il pannello ⚙️ e verifica che il Prompt ID sia `pmpt_68b5876fea1081908e6b472c85d6489a042e34dea2f3df83`.

## Perché su GitHub vedo solo il codice?

GitHub mostra i file del progetto così come sono salvati nel repository, quindi cliccando su `index.html` viene visualizzato il codice sorgente invece dell'interfaccia. Per usare davvero l'app devi **clonare il progetto** (ad esempio con gTab) e avviarlo tramite un piccolo server web, come indicato nella guida rapida (`npx serve .` oppure `vercel dev`). In questo modo il browser caricherà gli script, potrai sbloccare il pannello ⚙️ e parlare con l'assistente usando il prompt del terapeuta `pmpt_68b5876fea1081908e6b472c85d6489a042e34dea2f3df83`.
