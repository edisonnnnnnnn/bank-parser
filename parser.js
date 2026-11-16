function parseStatement(text) {
  // 偵測係邊間銀行
  let bank = 'UNKNOWN';
  if (/HSBC|香港上海滙豐/i.test(text)) bank = 'HSBC';
  else if (/HANG SENG|恒生銀行/i.test(text)) bank = 'HANG SENG';
  else if (/BOC|中國銀行|中銀/i.test(text)) bank = 'BOC';

  // 抽出所有似交易記錄嘅行
  const lines = text.split('\n');
  const transactions = [];

  // 通用 regex：日期 + 描述 + 金額
  const datePatterns = [
    /(\d{2}\/\d{2}\/\d{4})/,
    /(\d{2}\s+[A-Z]{3}\s+\d{4})/,
    /(\d{4}-\d{2}-\d{2})/
  ];
  const amountPattern = /(-?[\d,]+\.\d{2})/;

  for (const line of lines) {
    let date = null;
    for (const p of datePatterns) {
      const m = line.match(p);
      if (m) { date = m[1]; break; }
    }
    const amtMatch = line.match(amountPattern);
    if (date && amtMatch) {
      const amount = parseFloat(amtMatch[1].replace(/,/g, ''));
      const description = line
        .replace(date, '')
        .replace(amtMatch[1], '')
        .trim()
        .replace(/\s+/g, ' ');
      if (description.length > 0) {
        transactions.push({ date, description, amount });
      }
    }
  }

  return { bank, transaction_count: transactions.length, transactions };
}

module.exports = { parseStatement };
