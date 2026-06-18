const p=require("puppeteer-core");
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
  const b=await p.launch({executablePath:"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",headless:"new",defaultViewport:{width:1440,height:900},args:["--no-sandbox","--hide-scrollbars"]});
  const pg=await b.newPage();
  const errs=[];pg.on("pageerror",e=>errs.push(e.message));
  await pg.goto("http://localhost:3000/",{waitUntil:"networkidle2"});
  await pg.evaluate(()=>document.fonts.ready);
  await sleep(5200); // wait out intro (scroll unlocks)
  require("fs").mkdirSync("shots/gallery",{recursive:true});
  // scroll down in steps, capture
  let n=0;
  for(let i=0;i<26;i++){
    await pg.mouse.move(720,450);
    await pg.mouse.wheel({deltaY:500});
    await sleep(450);
    const y=await pg.evaluate(()=>Math.round(window.scrollY));
    await pg.screenshot({path:`shots/gallery/s${String(i).padStart(2,"0")}_y${y}.png`});
    n++;
  }
  console.log("captured",n,"frames; errors:",JSON.stringify(errs.slice(0,5)));
  await b.close();
})();
