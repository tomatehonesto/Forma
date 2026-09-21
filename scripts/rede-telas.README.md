# A rede das telas

`congelar.ts` não abre tela nenhuma. Esta rede abre.

```
npm run web            # com o servidor de pé, em http://localhost:8081
```

No console do navegador:

```js
eval(await (await fetch('/rede-telas.js?v=' + Math.random())).text());
await redeDeTelas();
copy(JSON.stringify(window.__NET));
```

O arquivo vive em dois lugares de propósito: `scripts/rede-telas.js` é a
fonte, e `public/rede-telas.js` é a cópia que o Metro serve — é o único
jeito de o navegador carregá-lo sem colar seis mil caracteres no console.
Depois de mexer na fonte:

```
cp scripts/rede-telas.js public/rede-telas.js
```
