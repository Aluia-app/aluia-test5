# AluIA Test 5

## Anteprima pronta su Vercel

L'ultima versione pubblica dell'app è disponibile all'indirizzo <https://aluia-test5.vercel.app/>.

- Accertati che nel progetto Vercel sia configurata la variabile `OPENAI_API_KEY`, altrimenti l'interfaccia rimarrà in modalità demo.
- L'interfaccia è identica a quella servita localmente: lo script `edv.js` è ora caricato dalla radice del progetto, quindi non è necessario alcun percorso personalizzato.
- Una volta aperta la pagina in gTab (o in un browser con HTTPS), sblocca il pannello ⚙️ e verifica che il Prompt ID sia `pmpt_68b5876fea1081908e6b472c85d6489a042e34dea2f3df83`.

## Perché su GitHub vedo solo il codice?

GitHub mostra i file del progetto così come sono salvati nel repository, quindi cliccando su `index.html` viene visualizzato il codice sorgente invece dell'interfaccia. Per usare davvero l'app devi **clonare il progetto** (ad esempio con gTab) e avviarlo tramite un piccolo server web (`npx serve .` oppure `vercel dev`). In questo modo il browser caricherà gli script, potrai sbloccare il pannello ⚙️ e parlare con l'assistente usando il prompt del terapeuta `pmpt_68b5876fea1081908e6b472c85d6489a042e34dea2f3df83`.
