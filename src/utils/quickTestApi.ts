export interface GeneratedTestResult {
  username: string;
  password: string;
  dns: string;
  m3uUrl: string;
  shortUrl?: string;
  expiresAt: string;
  payUrl?: string;
  reply: string;
}

export function normalizeBrPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (!digits) return '';
  return digits.startsWith('55') ? digits : `55${digits}`;
}

function extractM3uFromReply(
  replyText: string,
  dns: string,
  username: string,
  password: string
): string {
  const match = replyText.match(/https?:\/\/[^\s]+get\.php[^\s]*/i);
  if (match?.[0]) return match[0];
  if (dns && username && password) {
    const cleanDns = dns.replace(/\/$/, '');
    return `${cleanDns}/get.php?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}&type=m3u_plus&output=mpegts`;
  }
  return '';
}

export async function generateQuickTestFromApi(
  endpointUrl: string,
  rawPhone: string,
  customerName?: string
): Promise<{ fullNumber: string; result: GeneratedTestResult }> {
  const fullNumber = normalizeBrPhone(rawPhone);
  const payload = {
    whatsapp: fullNumber,
    phone: fullNumber,
    number: fullNumber,
    sender: fullNumber,
    name: customerName?.trim() || 'Cliente Site',
    query: {
      sender: fullNumber,
      message: 'teste',
    },
  };

  let response = await fetch(endpointUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    response = await fetch(
      `${endpointUrl}?phone=${encodeURIComponent(fullNumber)}`,
      {
        method: 'GET',
        headers: { Accept: 'application/json' },
      }
    );
  }

  if (!response.ok) {
    throw new Error(`Erro ao gerar teste (${response.status}).`);
  }

  const json = await response.json();
  const data = json?.data ?? json;

  if (!data || (!data.username && !data.reply)) {
    throw new Error('Não foi possível obter os dados de acesso do servidor.');
  }

  const username = String(data.username ?? data.login ?? data.auth_username ?? '');
  const password = String(data.password ?? data.auth_password ?? '');
  const dns = String(data.dns ?? data.server ?? data.portal ?? '');
  const shortUrl = data.url ? String(data.url) : data.message ? String(data.message) : undefined;
  const expiresAt = String(data.expiresAt ?? data.duration ?? '');
  const payUrl = data.payUrl ? String(data.payUrl) : undefined;
  const rawReply = String(
    data.reply ??
      `Usuário: ${username}\nSenha: ${password}\nServidor: ${dns}\nVencimento: ${expiresAt}`
  );
  const m3uUrl = extractM3uFromReply(rawReply, dns, username, password);

  let completeReply = rawReply
    .split('\n')
    .filter((line) => !/^\s*(?:[^a-zA-Z0-9\n]*\s*)?acesso\s+r[aá]pido\b/i.test(line))
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  if (m3uUrl && !completeReply.includes(m3uUrl)) {
    completeReply += `\nLink M3U: ${m3uUrl}`;
  }
  if (payUrl && !completeReply.includes(payUrl)) {
    completeReply += `\nRenovação: ${payUrl}`;
  }

  return {
    fullNumber,
    result: {
      username,
      password,
      dns,
      m3uUrl,
      shortUrl,
      expiresAt,
      payUrl,
      reply: completeReply,
    },
  };
}
