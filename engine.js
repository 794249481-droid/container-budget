(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.BudgetEngine = factory();
})(typeof globalThis === 'object' ? globalThis : this, function () {
  const MAX_ITEMS = 5000;
  function validate(c, goods, costs) {
    for (const [key, label] of [['l','内长'],['w','内宽'],['h','内高'],['maxWeight','最大载重']]) {
      if (!Number.isFinite(c[key]) || c[key] <= 0 || c[key] > 1e9) throw Error(label + '须为大于 0 的有效数字');
    }
    let total = 0;
    goods.forEach((g, i) => {
      for (const [key, label] of [['l','长'],['w','宽'],['h','高']]) {
        if (!Number.isFinite(g[key]) || g[key] <= 0 || g[key] > 1e9) throw Error(`第 ${i+1} 行货物的${label}须为大于 0 的有效数字`);
      }
      for (const [key, label] of [['weight','单重'],['price','单价']]) {
        if (!Number.isFinite(g[key]) || g[key] < 0 || g[key] > 1e9) throw Error(`第 ${i+1} 行货物的${label}须为非负有效数字`);
      }
      if (!Number.isSafeInteger(g.qty) || g.qty < 0) throw Error(`第 ${i+1} 行货物的数量须为非负整数`);
      total += g.qty;
    });
    if (total > MAX_ITEMS) throw Error(`货物总数量不能超过 ${MAX_ITEMS} 件`);
    for (const [key, value] of Object.entries(costs)) {
      if (value !== null && (!Number.isFinite(value) || value < 0 || value > 1e12)) throw Error('费用和货值须为非负有效数字');
    }
  }
  function pack(c, goods) {
    const items = [];
    goods.forEach((g, type) => { for (let id = 0; id < g.qty; id++) items.push({...g, type, id}); });
    items.sort((a,b) => b.l*b.w*b.h-a.l*a.w*a.h);
    let x=0,z=0,rowDepth=0,layerH=0,y=0,totalW=0,totalV=0;
    const placed=[],counts=goods.map(()=>0);
    for (const it of items) {
      let a=it.l,b=it.w;
      if (a>c.l || b>c.w) [a,b]=[b,a];
      if (a>c.l || b>c.w || it.h>c.h || totalW+it.weight>c.maxWeight) continue;
      if (x+a>c.l) { x=0; z+=rowDepth; rowDepth=0; }
      if (z+b>c.w) { x=0; z=0; y+=layerH; layerH=0; }
      if (y+it.h>c.h) continue;
      placed.push({...it,x,z,y,a,b}); x+=a; rowDepth=Math.max(rowDepth,b); layerH=Math.max(layerH,it.h);
      totalW+=it.weight; totalV+=it.l*it.w*it.h; counts[it.type]++;
    }
    return {c,placed,counts,totalW,totalV};
  }
  function calculateCosts(goods, result, costs) {
    const cargoValue=goods.reduce((sum,g,i)=>sum+g.price*result.counts[i],0);
    const declaredValue=costs.goodsValue === null ? cargoValue : costs.goodsValue;
    const insurance=declaredValue*costs.insurance/100;
    const total=costs.freight+costs.originFee+costs.destFee+costs.otherFee+insurance;
    return {cargoValue,declaredValue,insurance,total,perPiece:result.placed.length ? total/result.placed.length : null};
  }
  function csvCell(value) {
    let s=String(value);
    if (/^[\s\u0000-\u001f]*[=+\-@]/.test(s)) s="'"+s;
    return '"'+s.replace(/"/g,'""')+'"';
  }
  function csv(rows) { return '\ufeff'+rows.map(row=>row.map(csvCell).join(',')).join('\r\n'); }
  return {MAX_ITEMS,validate,pack,calculateCosts,csv};
});
