// Checklist
const boxes=[...document.querySelectorAll('#checklist input')];
const bar=document.getElementById('bar'),verdict=document.getElementById('verdict'),advice=document.getElementById('advice');
function score(){
  const n=boxes.filter(b=>b.checked).length,p=Math.round(n/boxes.length*100);
  bar.style.width=p+'%';
  let c='var(--bad)',v='Alto risco de desinformação',a='Não compartilhe. Procure a informação em fontes oficiais e agências de checagem.';
  if(p>=85){c='var(--ok)';v='Provavelmente confiável';a='Os sinais são bons. Mesmo assim, compartilhe com responsabilidade.';}
  else if(p>=50){c='var(--warn)';v='Atenção: verifique mais';a='Alguns pontos não foram confirmados. Pesquise antes de repassar.';}
  if(n===0){v='Marque os itens ao lado';a='Quanto mais itens confirmados, maior a confiança no conteúdo.';}
  bar.style.background=c;verdict.textContent=v+(n?` (${n}/${boxes.length})`:'');advice.textContent=a;
}
boxes.forEach(b=>b.addEventListener('change',score));

// Link check (análise local + atalhos para serviços gratuitos)
document.getElementById('linkform').addEventListener('submit',e=>{
  e.preventDefault();
  const out=document.getElementById('linkres');out.innerHTML='';
  let u;try{u=new URL(document.getElementById('url').value.trim())}catch{out.textContent='Link inválido.';return}
  const h=u.hostname.toLowerCase(),alerts=[];
  if(u.protocol!=='https:')alerts.push('não usa HTTPS');
  if(/^\d+\.\d+\.\d+\.\d+$/.test(h))alerts.push('usa um número IP no lugar do nome do site');
  if(h.startsWith('xn--')||h.includes('.xn--'))alerts.push('usa caracteres disfarçados (punycode)');
  if((h.match(/-/g)||[]).length>=3)alerts.push('tem muitos hífens no domínio');
  if(/(bit\.ly|tinyurl|cutt\.ly|is\.gd|t\.co|encurtador)/.test(h))alerts.push('é um link encurtado (o destino real fica oculto)');
  if(/\.(zip|top|xyz|click|gq|tk|ml)$/.test(h))alerts.push('usa uma terminação de domínio comum em golpes');
  if(/(login|senha|verifica|premio|gratis|pix|bonus)/.test(u.href.toLowerCase()))alerts.push('contém palavras usadas em golpes (login, prêmio, pix...)');
  const p=document.createElement('p');
  p.textContent=alerts.length?`⚠️ Atenção em ${h}: ${alerts.join('; ')}.`:`✅ Nenhum sinal óbvio de risco em ${h}. Isso não garante que o site é seguro.`;
  const vt=document.createElement('a');vt.href='https://www.virustotal.com/gui/search/'+encodeURIComponent(encodeURIComponent(u.href));vt.target='_blank';vt.rel='noopener';vt.textContent='Analisar no VirusTotal';
  const nv=document.createElement('a');nv.href='https://nordvpn.com/pt-br/link-checker/';nv.target='_blank';nv.rel='noopener';nv.textContent='Abrir NordVPN Link Checker';
  out.append(p,vt,' · ',nv);
});

// Quiz
const Q=[
  {q:'Uma mensagem no WhatsApp diz: "URGENTE! Compartilhe antes que apaguem!". O que fazer?',a:false,e:'Pedidos de urgência são uma tática clássica para você repassar sem verificar.'},
  {q:'Se vários veículos de imprensa conhecidos publicaram a mesma notícia, é sinal de maior confiabilidade.',a:true,e:'A confirmação por fontes independentes é um dos melhores indicadores.'},
  {q:'Existe ferramenta capaz de dizer com 100% de certeza se uma imagem foi criada por IA.',a:false,e:'Não existe. Combine sinais visuais, busca reversa e checadores.'},
  {q:'O endereço "gov-br-beneficio.xyz" é um site oficial do governo.',a:false,e:'Sites oficiais terminam em .gov.br. Domínios parecidos são usados em golpes.'},
  {q:'Uma foto verdadeira pode ser usada para espalhar mentira, se estiver fora de contexto.',a:true,e:'Imagens antigas ou de outro lugar são reaproveitadas com legendas falsas.'}
];
let i=0,pts=0;const box=document.getElementById('quizbox');
function render(){
  if(i>=Q.length){box.innerHTML=`<h3>Você acertou ${pts} de ${Q.length}!</h3><p class="small">${pts===Q.length?'Excelente! Você é um verificador de fatos.':'Revise as dicas acima e tente novamente.'}</p><button class="btn" id="again">Refazer</button>`;document.getElementById('again').onclick=()=>{i=0;pts=0;render()};return}
  const it=Q[i];
  box.innerHTML=`<p class="small">Pergunta ${i+1} de ${Q.length}</p><h3 style="margin-top:0">${it.q}</h3><div class="opts">${it.q.includes('O que fazer')?'<button class="btn" data-v="1">Compartilhar</button><button class="btn ghost" style="color:var(--navy);border-color:var(--navy)" data-v="0">Verificar antes</button>':'<button class="btn" data-v="1">Verdadeiro</button><button class="btn ghost" style="color:var(--navy);border-color:var(--navy)" data-v="0">Falso</button>'}</div>`;
  box.querySelectorAll('button').forEach(b=>b.onclick=()=>{
    const ok=(b.dataset.v==='1')===it.a;if(ok)pts++;
    box.querySelector('.opts').innerHTML=`<div class="fb"><b>${ok?'✅ Correto!':'❌ Não foi dessa vez.'}</b> ${it.e}</div><button class="btn" id="next">Próxima</button>`;
    document.getElementById('next').onclick=()=>{i++;render()};
  });
}
render();

// Ferramentas nativas
const enc=encodeURIComponent;
function chip(label,href){const a=document.createElement('a');a.className='chip';a.textContent=label;a.target='_blank';a.rel='noopener';a.href=href;return a}
const FC=[
  ['Aos Fatos',q=>'https://www.aosfatos.org/noticias/?q='+enc(q)],
  ['Agência Lupa',q=>'https://www.google.com/search?q='+enc(q+' site:lupa.uol.com.br')],
  ['Comprova',q=>'https://projetocomprova.com.br/?s='+enc(q)],
  ['Boatos.org',q=>'https://www.boatos.org/?s='+enc(q)],
  ['Google Fact Check',q=>'https://toolbox.google.com/factcheck/explorer/search/'+enc(q)+';hl=pt'],
  ['Google Notícias',q=>'https://news.google.com/search?q='+enc(q)+'&hl=pt-BR&gl=BR&ceid=BR:pt-419']
];
const fq=document.getElementById('fq'),fqb=document.getElementById('fqbtns');
FC.forEach(([l,f])=>{const a=chip(l,'#');a.addEventListener('click',e=>{const q=fq.value.trim();if(!q){e.preventDefault();fq.focus();return}a.href=f(q)});fqb.append(a)});

const IMG=[['Google Lens',u=>'https://lens.google.com/uploadbyurl?url='+enc(u)],['TinEye',u=>'https://tineye.com/search?url='+enc(u)],['Bing Visual',u=>'https://www.bing.com/images/search?view=detailv2&iss=sbi&q=imgurl:'+enc(u)],['Yandex',u=>'https://yandex.com/images/search?rpt=imageview&url='+enc(u)]];
const img=document.getElementById('img'),ib=document.getElementById('imgbtns');
IMG.forEach(([l,f])=>{const a=chip(l,'#');a.addEventListener('click',e=>{const u=img.value.trim();if(!/^https?:\/\//.test(u)){e.preventDefault();img.focus();return}a.href=f(u)});ib.append(a)});

document.getElementById('domgo').addEventListener('click',async()=>{
  const res=document.getElementById('domres');
  let d=document.getElementById('dom').value.trim().toLowerCase().replace(/^https?:\/\//,'').split('/')[0].replace(/^www\./,'');
  if(!/^[a-z0-9.-]+\.[a-z]{2,}$/.test(d)){res.textContent='Digite um domínio válido.';return}
  res.textContent='Consultando…';const out=[];
  try{
    const r=await fetch('https://rdap.org/domain/'+d);if(!r.ok)throw 0;const j=await r.json();
    const ev=(j.events||[]).find(e=>e.eventAction==='registration');
    if(ev){const dt=new Date(ev.eventDate),days=Math.floor((Date.now()-dt)/864e5);
      out.push(`${days<90?'⚠️':'✅'} Registrado em ${dt.toLocaleDateString('pt-BR')} (${days} dias)${days<90?' — site muito novo, desconfie.':'.'}`)}
    else out.push('ℹ️ Data de registro não informada pelo registro.');
  }catch{out.push('ℹ️ Não foi possível consultar o registro deste domínio.')}
  try{
    const r=await fetch('https://archive.org/wayback/available?url='+enc(d)+'&timestamp=19900101');const j=await r.json();const s=j.archived_snapshots&&j.archived_snapshots.closest;
    out.push(s?`📚 Internet Archive guarda cópias desde ${s.timestamp.slice(6,8)}/${s.timestamp.slice(4,6)}/${s.timestamp.slice(0,4)}.`:'📚 Nenhuma cópia antiga no Internet Archive.');
  }catch{}
  res.innerHTML='';out.forEach(t=>{const p=document.createElement('div');p.textContent=t;res.append(p)});
  res.append(chip('VirusTotal','https://www.virustotal.com/gui/domain/'+enc(d)),' ',chip('Registro.br (WHOIS)','https://registro.br/tecnologia/ferramentas/whois/?search='+enc(d)),' ',chip('Wayback Machine','https://web.archive.org/web/*/'+enc(d)));
});

// Fato Carimbado (atalhos)
const POL=[['Buscar tudo',q=>'https://fatocarimbado.com.br/mandato/#/buscar?q='+enc(q).replace(/%20/g,'+')],['Só votações',q=>'https://fatocarimbado.com.br/mandato/#/buscar?q='+enc(q).replace(/%20/g,'+')+'&tipo=votacoes']];
const pol=document.getElementById('pol'),pb=document.getElementById('polbtns');
POL.forEach(([l,f])=>{const a=chip(l,'#');a.addEventListener('click',e=>{const q=pol.value.trim();if(!q){e.preventDefault();pol.focus();return}a.href=f(q)});pb.append(a)});
