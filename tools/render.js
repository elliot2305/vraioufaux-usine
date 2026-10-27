const {chromium}=require('playwright');const fs=require('fs');
(async()=>{
 const b=await chromium.launch({args:['--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
 const p=await b.newPage({viewport:{width:1080,height:1920}});await p.addInitScript(()=>{window.PR=0.75});
 p.on('pageerror',e=>console.log('ERR',e.message));
 await p.goto('http://localhost:8770/'+process.env.PAGE);await p.waitForFunction('window.READY',null,{timeout:60000});
 const dur=JSON.parse(fs.readFileSync(process.env.TL)).duration;const N=Math.ceil(dur*30);fs.mkdirSync(process.env.FR,{recursive:true});
 const NW=+(process.env.NW||1),WK=+(process.env.WK||0);for(let i=WK;i<N;i+=NW){const f=`${process.env.FR}/${String(i).padStart(5,'0')}.jpg`;if(fs.existsSync(f))continue;await p.evaluate(t=>render(t),i/30);await p.screenshot({path:f,type:'jpeg',quality:92});if(i%150==0)console.log(i,'/',N)}
 console.log('DONE');await b.close();
})();
