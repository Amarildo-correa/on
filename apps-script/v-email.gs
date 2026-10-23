/**
 * Envio por e-mail da página /v (diagnóstico do navegador).
 * Roda como Web App do Google Apps Script na conta do dono e manda pelo próprio Gmail (grátis, até 100 e-mails/dia).
 * O destinatário é fixo: o Web App não consegue mandar para nenhum outro endereço.
 *
 * Implantação (uma vez):
 *   1. script.google.com → Novo projeto → cole este arquivo no lugar do Code.gs → salve.
 *   2. Implantar → Nova implantação → tipo "App da Web".
 *      Executar como: Eu. Quem pode acessar: Qualquer pessoa.
 *   3. Autorize o acesso ao Gmail quando pedir.
 *   4. Copie a URL que termina em /exec e cole em GAS_URL, no v.html.
 */
var TO = 'amarildonovohamburgo@gmail.com';

function doPost(e) {
  try {
    var d = JSON.parse(e.postData.contents);
    var json = String(d.json || '');
    MailApp.sendEmail({
      to: TO,
      subject: String(d.subject || 'Diagnóstico /v').slice(0, 200),
      body: String(d.resumo || '') + '\n\n----- JSON completo -----\n\n' + json,
      attachments: [Utilities.newBlob(json, 'application/json', 'diagnostico.json')]
    });
    return out({ ok: true, restantesHoje: MailApp.getRemainingDailyQuota() });
  } catch (err) {
    return out({ ok: false, error: String(err && err.message || err) });
  }
}

/* abrir a URL /exec no navegador mostra se o Web App está no ar */
function doGet() { return out({ ok: true, info: 'Web App do /v no ar', restantesHoje: MailApp.getRemainingDailyQuota() }); }

function out(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
