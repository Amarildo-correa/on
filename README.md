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

Arquivos: `index.html` (app da TV) e `c.html` (controle no celular).
