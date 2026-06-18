const p=require("puppeteer-core");const fs=require("fs");
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
  const dir="shots/hero-fix";fs.mkdirSync(dir,{recursive:true});
  const b=await p.launch({executablePath:"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",headless:"new",defaultViewport:{width:1440,height:900},args:["--no-sandbox","--disable-gpu","--hide-scrollbars"]});
  const pg=await b.newPage();
  await pg.goto("http://localhost:3000/",{waitUntil:"domcontentloaded"});
  const stamps=[200,1000,2000,3500,3950,4350,4800,5300,5900,6500];
  let prev=0;
  for(const t of stamps){await sleep(t-prev);prev=t;await pg.screenshot({path:`${dir}/t${String(t).padStart(4,"0")}.png`});}
  await b.close();console.log("done");
})();
