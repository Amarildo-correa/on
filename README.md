# Read on TV

Notícias da Agência Brasil em uma interface para TV (controle remoto, gamepad, teclado e celular).

No ar: https://amarildo-correa.github.io/on/

- `?intro=0` pula a abertura.

## Controle pelo celular

Mesma estratégia do Read on TV clássico ([tv](https://github.com/Amarildo-correa/tv)), pensada para o navegador Silk do Fire TV Stick:

1. Na TV, abra o menu lateral (← no primeiro card) e escolha Controle. Aparecem um QR code e um código de 5 letras.
2. No celular, escaneie o QR ou abra `amarildo-correa.github.io/on/c` e digite o código.
3. O direcional, o OK, o Voltar e as setas de página do celular controlam a TV.

Como funciona:

- A TV assina `readontv/on/<CÓDIGO>/cmd` em dois brokers MQTT públicos ao mesmo tempo (EMQX e HiveMQ, via WebSocket seguro). O celular usa qualquer um e troca sozinho se um não responder.
- Cada comando vira uma tecla e passa pelo mesmo `onKey` do controle físico, então a navegação espacial, a tela da matéria e o cabeçalho funcionam igual, sem depender do modo cursor do Silk.
- A TV confirma cada comando em `.../ack`; o celular mostra o tempo de resposta.
- "Gerar novo código" revoga o celular pareado.
- Prefixo e chaves de `localStorage` (`readontv-on:*`) são próprios deste app, separados do `tv`, que mora na mesma origem.
- Brokers, prefixo do tópico e opções de conexão ficam em `shared.js`, usado pela TV e pelo celular.

## Faixa Novo Hamburgo

A faixa "Novo Hamburgo" lê `data/novo-hamburgo.json`, servido pelo próprio Pages (sem proxy de CORS). O arquivo é atualizado por uma tarefa agendada do Claude todo dia às 07h15 (America/Sao_Paulo): ela lê as matérias das últimas ~36 h de abc+ (ex-Jornal NH), Portal Martin Behrend, DuduNews, Câmara Municipal e outras fontes, extrai os fatos e redige uma matéria própria (texto original, sem trechos copiados), que o app exibe inteira, com o crédito "Com informações de …". Notícias cujo texto original não pôde ser lido não entram.

Formato de cada item: `title`, `summary`, `body` (lista de parágrafos), `cat`, `source`, `link`, `img` (URL ou vazio), `date` (ISO 8601 com fuso). Máximo de 12 itens, mais recentes primeiro.

## Menu lateral

O palco tem três blocos: `nav.side` (coluna do menu, à esquerda), `header.top` e `main.main` (coluna do conteúdo). Cabeçalho e trilhos começam no mesmo x (`--rail-x`), alinhados com o primeiro card; quando o trilho avança, o card que fica para trás continua aparecendo atrás do menu (peek), com a foto apagada (opacidade .25) e o fundo --card, sumindo antes dos ícones do menu.

Uma barra lateral à esquerda, dentro da margem de segurança. Recolhida, mostra só os ícones (Início, Histórico, Minha lista, Excluir localstorage, Controle, API Fullscreen e, no rodapé, Conta); os cards ficam deslocados para a direita. Com ← no primeiro card (ou o mouse), ela abre: ganha os rótulos ao lado dos ícones, o logo "read on TV" aumentado no topo, empurra os trilhos para a direita (sem sobrepô-los) e cobre a faixa de informações; no cabeçalho, o campo de busca some, surge o item "Buscar notícias" na lista e os links ficam escurecidos. → ou Voltar fecha o menu.

## Limpar dados salvos

O item "Excluir localstorage" do menu lateral apaga, após um segundo OK em até 3 s, os dados deste app: notícias salvas, matérias lidas, clima, preferências (sons, abertura, proxy) e o código do celular pareado. Também limpa o `sessionStorage`, os cookies visíveis ao JavaScript no caminho do app e caches do Cache Storage com nome do app, e recarrega a página. Não usa `localStorage.clear()` porque o `github.io` é uma origem compartilhada com outros apps. O cache HTTP do navegador não pode ser apagado por JavaScript.

## Cores (tokens)

Todas as cores ficam em variáveis CSS no `:root` de cada página, agrupadas por papel (superfícies, linhas, texto, marca e foco, sombras); as regras usam só `var(--…)`. Os principais:

- `--bg` `#2A2D35` (cinza-azulado, matiz 224°): fundo do palco, do cabeçalho, do menu aberto, da matéria e da abertura; também é o `theme-color` do celular.
- `--brand` `#357DED`: azul da marca (logo, seção atual, capitular, barra de progresso, status do pareamento, botões do celular).
- `--focus` `#FFD60A`: superfície amarela do foco.
- `--card` `#121418`, `--thumb` `#1C1F25`, `--control` `#41454E`: superfícies dos cards, miniaturas e botões.
- `--field` `#3C4049`: fundo do campo "Buscar notícias" no cabeçalho.
- Texto, do mais claro ao mais apagado: `--white`, `--text`, `--title`, `--meta`, `--sub`, `--dim`, `--off`.

Harmonia: todos os cinzas (superfícies, linhas, textos e o desenho do direcional no celular) levam o matiz do `--bg` (222°), com mais saturação nos tons escuros e quase nenhuma nos claros; a luminância é a mesma dos cinzas neutros de antes, então os contrastes não mudam. O azul da marca (217°) é análogo ao fundo e o amarelo do foco (50°) é o complementar, o que faz o foco saltar na TV.

`c.html` usa os mesmos nomes e valores quando o token existe nos dois (`--bg`, `--brand`, `--focus`, `--card`, `--control`, `--sub`, `--dim`, `--white`). Só ficam fixas as cores do desenho do direcional no SVG do celular e as máscaras de transparência (`mask-image`).

## Ícones

Os ícones vêm da biblioteca [Lucide](https://lucide.dev) via CDN (`lucide@1.52.0`, jsDelivr), em `index.html` e `c.html`; o desenho é feito por `shared.js`. No HTML, cada ícone é um `<svg data-ico="nome">` que recebe o desenho ao carregar; no JS, `ico('nome')` gera o SVG e `setIco(el, 'nome')` troca o ícone (clima, tela cheia, status do pareamento). Sem foto, a miniatura do card (e a capa da matéria) mostra um ícone da editoria, escolhido por palavra-chave em `CAT_ICO` (ex.: Alerta → `triangle-alert`, Esportes → `trophy`, Justiça → `scale`; padrão `newspaper`). O símbolo do logo continua desenhado no próprio HTML, por ser parte da marca: um único `<symbol id="logo-mark">`, reaproveitado com `<use>` no cabeçalho, no menu, na matéria e na abertura.

## Diagnóstico (/v)

`amarildo-correa.github.io/on/v` lê tudo o que o navegador expõe (userAgent e Client Hints, tela, media queries, WebGL/WebGPU, codecs, DRM, permissões, armazenamento, recursos de JS e CSS, presença de ~250 APIs, IP público etc.), mostra o JSON e tem um botão para enviá-lo por e-mail. O envio passa por um Web App do Google Apps Script (`apps-script/v-email.gs`) publicado na conta Google do dono: sai pelo próprio Gmail (grátis, até 100 por dia), só em texto: um resumo e o JSON completo no corpo, sem anexo. O destinatário é fixo no script. Se o `fetch` falhar (como no Silk), a página reenvia por um formulário num iframe escondido, que não depende de CORS; o e-mail chega com "(modo compatível)" no assunto e o motivo da falha do `fetch` no corpo. Erros de JavaScript aparecem na tela e em `errosJs`.

O primeiro item do JSON, `problemaEnvio`, testa ao abrir cada etapa do caminho até o Apps Script, sem mandar e-mail: GET com CORS, GET sem CORS, primeiro salto do redirecionamento, acesso a `script.googleusercontent.com`, CORS com outro site e, a partir da versão 2 do script, um POST em modo ping. Com isso, aponta a `causaProvavel` e o `comoResolver`; depois de um envio, `ultimoEnvio` diz qual método foi usado. A URL `/exec` da implantação fica em `GAS_URL`, no `v.html`; o passo a passo da implantação está no topo do `.gs`.

O botão "Testar fala" testa a voz nativa (`speechSynthesis`): fala uma frase em pt-BR e registra em `falaTeste` os eventos `start`/`end`/`error`, quantos `boundary` dispararam (e de que tipo), a duração e a voz usada. Como o JavaScript não consegue captar o áudio da voz, a página pergunta se você ouviu e grava a resposta em `ouvidoPeloUsuario`. Página de uso pessoal, sem link no app e com `noindex`.

Arquivos: `index.html` (app da TV), `c.html` (controle no celular), `v.html` (diagnóstico), `shared.js` (código comum aos dois: MQTT e ícones) e `data/novo-hamburgo.json` (faixa local).
