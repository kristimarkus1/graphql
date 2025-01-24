export function drawXpGraph(xpTransactions) {
  console.log("XP Transactions for Graph:", xpTransactions);

  let xpData = [];
  xpTransactions.forEach(el => {
    const yyyymm = el.createdAt.substring(0, 7);
    const existing = xpData.find(x => x.period === yyyymm);
    if (!existing) {
      xpData.push({ period: yyyymm, xp: el.amount / 1000 });
    } else {
      existing.xp += el.amount / 1000;
    }
  });

  new Morris.Line({
    element: 'line-chart',
    data: xpData,
    xkey: 'period',
    ykeys: ['xp'],
    labels: ['XP Gained'],
    resize: true,
    lineColors: ['#FFD369'],
    xLabelAngle: window.innerWidth < 600 ? 45 : 0,
  });
}

export function drawAuditGraph(audits) {
  console.log("Audits for Graph:", audits);

  let auditData = [];
  audits.forEach(el => {
    const yyyymm = el.createdAt.substring(0, 7);
    const existing = auditData.find(x => x.period === yyyymm);
    if (!existing) {
      auditData.push({
        period: yyyymm,
        given: el.type === 'up' ? 1 : 0,
        received: el.type === 'down' ? 1 : 0,
      });
    } else {
      if (el.type === 'up') existing.given += 1;
      if (el.type === 'down') existing.received += 1;
    }
  });

  new Morris.Bar({
    element: 'bar-chart',
    data: auditData,
    xkey: 'period',
    ykeys: ['given', 'received'],
    labels: ['Given Audits', 'Received Audits'],
    barColors: ['#FFD369', '#FF6F61'],
    resize: true,
    xLabelAngle: window.innerWidth < 600 ? 45 : 0,
  });
}
