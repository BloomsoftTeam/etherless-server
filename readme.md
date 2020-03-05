# Proof of Concept del gruppo BloomSoft
Questa repo contiene il codice relativo al modulo server del progetto Etherless.

## Operazioni preliminari
Prima di eseguire i comandi che verranno descritti successivamente, le seguenti operazioni devono essere svolte oltre al clone della repo per garantirne il corretto funzionamento:
- eseguire il comando `npm install -g serverless` e `npm install ethers`.

## Comandi disponibili
- `sls invoke local -f hello` : serve per far eseguire la funzione lambda in locale. Tale funzione si occupa prima di istanziare il contratto e poi di ascoltarne gli eventi che sono inviati dal modulo etherless-cli tramite la richiesta di esecuzione di una funzione.
Quando l'evento viene ricevuto (assieme al nome della funzione da eseguire e i parametri) verrà eseguita la funzione e il risultato prodotto sarà rimandato al modulo etherless-cli tramite evento.