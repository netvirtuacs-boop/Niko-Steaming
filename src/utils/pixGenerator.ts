export const NIKO_PIX_KEY = '76a885d7-086a-4793-a0db-b309b4b97e7b';

function formatTlv(id: string, value: string): string {
  const len = String(value.length).padStart(2, '0');
  return `${id}${len}${value}`;
}

function sanitizeAscii(text: string, maxLength: number): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toUpperCase()
    .slice(0, maxLength);
}

function crc16Ccitt(payload: string): string {
  let crc = 0xffff;
  for (let i = 0; i < payload.length; i += 1) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let bit = 0; bit < 8; bit += 1) {
      if ((crc & 0x8000) !== 0) {
        crc = ((crc << 1) ^ 0x1021) & 0xffff;
      } else {
        crc = (crc << 1) & 0xffff;
      }
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

export function buildPixCopyPastePayload(options: {
  pixKey?: string;
  merchantName?: string;
  merchantCity?: string;
  amount?: number;
  description?: string;
}): string {
  const pixKey = options.pixKey || NIKO_PIX_KEY;
  const merchantName = sanitizeAscii(options.merchantName || 'NIKO STREAMING REVENDA', 25) || 'NIKO STREAMING';
  const merchantCity = sanitizeAscii(options.merchantCity || 'SAO PAULO', 15) || 'SAO PAULO';

  const gui = formatTlv('00', 'br.gov.bcb.pix');
  const keyField = formatTlv('01', pixKey);
  const descField = options.description
    ? formatTlv('02', sanitizeAscii(options.description, 32))
    : '';
  const merchantAccountInfo = formatTlv('26', `${gui}${keyField}${descField}`);

  const parts = [
    formatTlv('00', '01'),
    merchantAccountInfo,
    formatTlv('52', '0000'),
    formatTlv('53', '986'),
  ];

  if (options.amount && options.amount > 0) {
    parts.push(formatTlv('54', options.amount.toFixed(2)));
  }

  parts.push(formatTlv('58', 'BR'));
  parts.push(formatTlv('59', merchantName));
  parts.push(formatTlv('60', merchantCity));
  parts.push(formatTlv('62', formatTlv('05', '***')));

  const payloadWithoutCrc = `${parts.join('')}6304`;
  return `${payloadWithoutCrc}${crc16Ccitt(payloadWithoutCrc)}`;
}
