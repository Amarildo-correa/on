/**
 * Envio por e-mail da página /v (diagnóstico do navegador).
 * Roda como Web App do Google Apps Script na conta do dono e manda pelo próprio Gmail (grátis, até 100 e-mails/dia).
 * O destinatário é fixo: o Web App não consegue mandar para nenhum outro endereço.
 * O e-mail é só texto (resumo + JSON completo no corpo), sem anexo.
 *
 * Implantação (uma vez):
 *   1. script.google.com → Novo projeto → cole este arquivo no lugar do Code.gs → salve.
 *   2. Implantar → Nova implantação → tipo "App da Web".
 *      Executar como: Eu. Quem pode acessar: Qualquer pessoa.
 *   3. Autorize o acesso ao Gmail quando pedir.
 *   4. Copie a URL que termina em /exec e cole em GAS_URL, no v.html.
 * Para atualizar sem mudar a URL: Implantar → Gerenciar implantações → editar (lápis) → Versão: Nova versão → Implantar.
 */
var TO = 'amarildonovohamburgo@gmail.com';
var VERSAO = 2; /* a /v só testa o POST (modo ping) a partir da versão 2 */

function doPost(e) {
  try {
    var d = JSON.parse(e.postData.contents);
    /* teste do caminho feito pela /v ao abrir: responde sem mandar e-mail */
    if (d.ping) return out({ ok: true, pong: true, versao: VERSAO });
    MailApp.sendEmail({
      to: TO,
      subject: String(d.subject || 'Diagnóstico /v').slice(0, 200),
      body: String(d.resumo || '') + '\n\n----- JSON completo -----\n\n' + String(d.json || '')
    });
    return out({ ok: true, versao: VERSAO, restantesHoje: MailApp.getRemainingDailyQuota() });
  } catch (err) {
    return out({ ok: false, versao: VERSAO, error: String(err && err.message || err) });
  }
}

/* abrir a URL /exec no navegador mostra se o Web App está no ar; a /v também usa no diagnóstico (nunca envia e-mail) */
function doGet() { return out({ ok: true, info: 'Web App do /v no ar', versao: VERSAO, restantesHoje: MailApp.getRemainingDailyQuota() }); }

function out(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
