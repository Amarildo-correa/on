/* Código comum à TV (index.html) e ao controle no celular (c.html).
   ES5 de propósito: roda nos navegadores antigos de TV e de celular.
   Carregar depois do Lucide (CDN). */
var ROTV = (function () {
  /* A TV escuta em todos os brokers ao mesmo tempo; o celular usa um e troca sozinho se ele não responder */
  var BROKERS = ['wss://broker.emqx.io:8084/mqtt', 'wss://broker.hivemq.com:8884/mqtt'];
  /* prefixo próprio deste app: o Read on TV clássico (repositório tv) mora na mesma origem */
  var TOPIC_PREFIX = 'readontv/on/';

  function mqttOptions(role) {
    return {
      clientId: 'rotv-on-' + role + '-' + Math.random().toString(36).slice(2, 10),
      clean: true, connectTimeout: 10000, reconnectPeriod: 3000, keepalive: 30, timerVariant: 'native'
    };
  }

  /* Ícones Lucide: 'chevrons-up' → desenho interno do SVG ('' se a biblioteca não carregou) */
  function iconInner(name) {
    var icons = (window.lucide && window.lucide.icons) || {};
    var node = icons[String(name).replace(/(^|-)([a-z0-9])/g, function (_, a, b) { return b.toUpperCase(); })];
    if (!node) return '';
    return node.map(function (n) {
      return '<' + n[0] + Object.keys(n[1]).map(function (k) {
        return ' ' + k + '="' + String(n[1][k]).replace(/&/g, '&amp;').replace(/"/g, '&quot;') + '"';
      }).join('') + '/>';
    }).join('');
  }

  /* Troca o ícone de um <svg data-ico>; sem nome, redesenha o atual */
  function setIcon(el, name) {
    if (!el) return;
    if (name) el.setAttribute('data-ico', name);
    el.innerHTML = iconInner(el.getAttribute('data-ico'));
  }

  function drawIcons(root) {
    var svgs = (root || document).querySelectorAll('svg[data-ico]');
    for (var i = 0; i < svgs.length; i++) setIcon(svgs[i]);
  }

  return { BROKERS: BROKERS, TOPIC_PREFIX: TOPIC_PREFIX, mqttOptions: mqttOptions, iconInner: iconInner, setIcon: setIcon, drawIcons: drawIcons };
})();
