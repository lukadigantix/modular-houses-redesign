const p=require("puppeteer-core");
(async()=>{
  const b=await p.launch({executablePath:"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",headless:"new",defaultViewport:{width:1440,height:900},args:["--no-sandbox","--hide-scrollbars"]});
  const pg=await b.newPage();
  await pg.goto(process.argv[2],{waitUntil:"networkidle2"});
  await pg.evaluate(()=>document.fonts.ready); await new Promise(r=>setTimeout(r,2000));
  const h=await pg.evaluate(()=>document.body.scrollHeight);
  const fs=await pg.evaluate(()=>getComputedStyle(document.querySelector(".wordmark")).fontSize);
  const bg=await pg.evaluate(()=>getComputedStyle(document.body).backgroundColor);
  console.log("scrollHeight=",h,"wordmark fontSize=",fs,"body bg=",bg);
  await pg.screenshot({path:process.argv[3],fullPage:true});
  await b.close();
})();
