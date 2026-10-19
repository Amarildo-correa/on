# Read on TV

Notícias da Agência Brasil em uma interface para TV (controle remoto, gamepad, teclado e celular).

No ar: https://amarildo-correa.github.io/on/

- `?intro=0` pula a abertura.

## Controle pelo celular

Mesma estratégia do Read on TV clássico ([tv](https://github.com/Amarildo-correa/tv)), pensada para o navegador Silk do Fire TV Stick:

1. Na TV, suba até o cabeçalho e abra o ícone de celular. Aparecem um QR code e um código de 5 letras.
2. No celular, escaneie o QR ou abra `amarildo-correa.github.io/on/c` e digite o código.
3. O direcional, o OK, o Voltar e as setas de página do celular controlam a TV.

Como funciona:

- A TV assina `readontv/on/<CÓDIGO>/cmd` em dois brokers MQTT públicos ao mesmo tempo (EMQX e HiveMQ, via WebSocket seguro). O celular usa qualquer um e troca sozinho se um não responder.
- Cada comando vira uma tecla e passa pelo mesmo `onKey` do controle físico, então a navegação espacial, a tela da matéria e o cabeçalho funcionam igual, sem depender do modo cursor do Silk.
- A TV confirma cada comando em `.../ack`; o celular mostra o tempo de resposta.
- "Gerar novo código" revoga o celular pareado.
- Prefixo e chaves de `localStorage` (`readontv-on:*`) são próprios deste app, separados do `tv`, que mora na mesma origem.

## Faixa Novo Hamburgo

A faixa "Novo Hamburgo" lê `data/novo-hamburgo.json`, servido pelo próprio Pages (sem proxy de CORS). O arquivo é atualizado por uma tarefa agendada do Claude todo dia às 07h15 (America/Sao_Paulo): ela lê as matérias das últimas ~36 h de abc+ (ex-Jornal NH), Portal Martin Behrend, DuduNews, Câmara Municipal e outras fontes, extrai os fatos e redige uma matéria própria (texto original, sem trechos copiados), que o app exibe inteira, com o crédito "Com informações de …". Notícias cujo texto original não pôde ser lido não entram.

Formato de cada item: `title`, `summary`, `body` (lista de parágrafos), `cat`, `source`, `link`, `img` (URL ou vazio), `date` (ISO 8601 com fuso). Máximo de 12 itens, mais recentes primeiro.

Arquivos: `index.html` (app da TV), `c.html` (controle no celular) e `data/novo-hamburgo.json` (faixa local).
