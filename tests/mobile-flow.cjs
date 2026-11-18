"use strict";
const {chromium}=require("playwright");
const fs=require("node:fs");
const http=require("node:http");
const path=require("node:path");
(async()=>{
 const server=http.createServer((req,res)=>{if(req.url!=="/"&&req.url!=="/index.html"){res.writeHead(404);res.end();return}res.writeHead(200,{"Content-Type":"text/html; charset=utf-8"});res.end(fs.readFileSync(path.resolve("index.html")))});
 await new Promise(resolve=>server.listen(0,"127.0.0.1",resolve));
 let browser;
 try{
  browser=await chromium.launch({headless:true});
  const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  const errors=[];page.on("pageerror",error=>errors.push(error.message));
  await page.goto("http://127.0.0.1:"+server.address().port+"/");
  await page.locator("#academyJobs").click();
  await page.locator("#academyCourses button").first().click();
  await page.locator("#courseSave").click();
  if(!(await page.locator("#courseSaved").innerText()).includes("সংরক্ষিত"))throw Error("Goal save failed");
  await page.locator("#bcsChapterList details").first().locator("summary").click();
  await page.locator("#bcsChapterList button").click();
  await page.locator("#bcsLessonQuiz").click();
  if(await page.locator("#quiz").evaluate(el=>el.classList.contains("hidden")))throw Error("Quiz did not open");
  for(let i=0;i<15;i++){
   await page.locator("#options button").first().click();
   await page.locator("#next").click();
  }
  if(await page.locator("#result").evaluate(el=>el.classList.contains("hidden")))throw Error("Result not shown");
  if(await page.locator("#chapterProgress").evaluate(el=>el.classList.contains("hidden")))throw Error("Chapter progress not shown");
  if(await page.locator("#chapterAssessment").evaluate(el=>el.classList.contains("hidden")))throw Error("Full chapter assessment not shown");
  if(!(await page.locator("#chapterAssessment").innerText()).includes("অফিসিয়াল পাস নম্বর নয়"))throw Error("Unofficial assessment disclaimer missing");
  // Revisit only missed answers; a partial retry must not be a full-chapter assessment.
  const missedCount=await page.locator('#review [data-outcome]:not([data-outcome="correct"])').count();
  if(missedCount>0){
   await page.locator("#retryMistakes").click();
   if(!(await page.locator("#quiz").isVisible()))throw Error("Mistake retry did not open");
   for(let n=0;n<missedCount;n++){
    await page.locator("#options button").first().click();
    await page.locator("#next").click();
   }
   if(!(await page.locator("#result").isVisible()))throw Error("Mistake retry result missing");
   if(await page.locator("#chapterAssessment").isVisible())throw Error("Partial retry incorrectly marked as full chapter");
   if(await page.locator("#chapterProgress").isVisible())throw Error("Partial retry incorrectly saved as full chapter progress");
  }
  await page.locator('a[href="#home"]').last().click();
  if(!(await page.locator("#dashboardLatest").innerText()).includes("15"))throw Error("Dashboard did not update");
  await page.reload();
  if(!(await page.locator("#dashboardGoal").innerText()).includes("BCS"))throw Error("Goal not persistent");
  if(!(await page.locator("#dashboardLatest").innerText()).includes("15"))throw Error("Chapter score not persistent");
  // Switching to an unrelated course must not show BCS chapter scores.
  await page.locator("#academyAdmission").click();
  await page.locator("#academyCourses button").first().click();
  await page.locator("#courseSave").click();
  if(!(await page.locator("#dashboardLatest").innerText()).includes("এই নির্বাচিত কোর্সে"))throw Error("BCS score leaked into admission dashboard");
  await page.reload();
  if(!(await page.locator("#dashboardGoal").innerText()).includes("মেডিকেল ভর্তি"))throw Error("Admission goal not persistent");
  if(errors.length)throw Error("Browser errors: "+errors.join(" | "));
  console.log("PASS: mobile academy → course → save → chapter → quiz → result → dashboard → reload");
 }finally{if(browser)await browser.close();await new Promise(resolve=>server.close(resolve))}
})().catch(err=>{console.error(err);process.exitCode=1});
