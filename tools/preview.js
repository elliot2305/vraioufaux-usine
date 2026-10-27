const {chromium}=require('playwright');
(async()=>{
 const b=await chromium.launch({args:['--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
 const p=await b.newPage({viewport:{width:1080,height:1920}});await p.addInitScript(()=>{window.PR=0.7});
 p.on('console',m=>console.log('C:',m.text()));p.on('pageerror',e=>console.log('ERR',e.message));
 await p.goto('http://localhost:8770/'+(process.env.PAGE||'pire_v10.html')+'');await p.waitForFunction('window.READY',null,{timeout:60000});
 const out=process.env.OUT;const ts=process.argv.slice(2).map(Number);const t0=Date.now();
 for(const t of ts){await p.evaluate(t=>render(t),t);await p.screenshot({path:`${out}/f_${t.toFixed(2).padStart(6,'0')}.jpg`,type:'jpeg',quality:80})}
 console.log('ms/frame',(Date.now()-t0)/ts.length);await b.close();
})();
