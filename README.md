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

## Menu lateral

O palco tem três blocos: `nav.side` (coluna do menu, à esquerda), `header.top` e `main.main` (coluna do conteúdo). Cabeçalho e trilhos começam no mesmo x (`--rail-x`), alinhados com o primeiro card; quando o trilho avança, o card que fica para trás continua aparecendo atrás do menu (peek), só ele apagado (opacidade .25).

Uma barra lateral à esquerda, dentro da margem de segurança. Recolhida, mostra só os ícones (Início, Histórico, Minha lista, Excluir localstorage, Controle, API Fullscreen e, no rodapé, Conta); os cards ficam deslocados para a direita. Com ← no primeiro card (ou o mouse), ela abre: ganha os rótulos ao lado dos ícones, o logo "read on TV" aumentado no topo, empurra os trilhos para a direita (sem sobrepô-los) e cobre a faixa de informações; no cabeçalho, o campo de busca some, surge o item "Buscar notícias" na lista e os links ficam escurecidos. → ou Voltar fecha o menu.

## Limpar dados salvos

O ícone de lixeira no cabeçalho (à esquerda do celular) apaga, após um segundo OK em até 3 s, os dados deste app: notícias salvas, matérias lidas, clima, preferências (sons, abertura, proxy) e o código do celular pareado. Também limpa o `sessionStorage`, os cookies visíveis ao JavaScript no caminho do app e caches do Cache Storage com nome do app, e recarrega a página. Não usa `localStorage.clear()` porque o `github.io` é uma origem compartilhada com outros apps. O cache HTTP do navegador não pode ser apagado por JavaScript.

## Ícones

Os ícones vêm da biblioteca [Lucide](https://lucide.dev) via CDN (`lucide@1.52.0`, jsDelivr), em `index.html` e `c.html`. No HTML, cada ícone é um `<svg data-ico="nome">` que recebe o desenho ao carregar; no JS, `ico('nome')` gera o SVG e `setIco(el, 'nome')` troca o ícone (clima, tela cheia, status do pareamento). Sem foto, a miniatura do card (e a capa da matéria) mostra um ícone da editoria, escolhido por palavra-chave em `CAT_ICO` (ex.: Alerta → `triangle-alert`, Esportes → `trophy`, Justiça → `scale`; padrão `newspaper`). O símbolo do logo continua desenhado no próprio HTML, por ser parte da marca.

Arquivos: `index.html` (app da TV), `c.html` (controle no celular) e `data/novo-hamburgo.json` (faixa local).
