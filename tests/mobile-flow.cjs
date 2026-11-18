"use strict";
const {chromium}=require("playwright");
const fs=require("node:fs");
const http=require("node:http");
const path=require("node:path");
(async()=>{
 const server=http.createServer((req,res)=>{if(req.url!=="/"&&req.url!=="/index.html"){res.writeHead(404);res.end();return}res.writeHead(200,{"Content-Type":"text/html; charset=utf-8"});res.end(fs.readFileSync(path.resolve("index.html")))});
 await new Promise(resolve=>server.listen(0,"127.0.0.1",resolve));
 let browser;
 let page;
 try{
  browser=await chromium.launch({headless:true});
  page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  const errors=[];page.on("pageerror",error=>errors.push(error.message));
  await page.goto("http://127.0.0.1:"+server.address().port+"/");
  if(!(await page.locator("#portalHub").isVisible()))throw Error("Category hub hidden on initial homepage");
  if(await page.locator("#academy").isVisible())throw Error("Academy leaked into initial homepage");
  await page.locator('[data-portal="academy"]').click();
  if(!(await page.locator("#academy").isVisible()))throw Error("Academy screen not visible");
  // Verify isolated sections and return navigation before entering a course.
  if(await page.locator("#studyAbroad").isVisible())throw Error("Unrelated study-abroad section visible in Academy");
  await page.locator("#portalBack").click();
  if(!(await page.locator("#portalHub").isVisible()))throw Error("Category hub did not return");
  if(await page.locator("#academy").isVisible())throw Error("Academy leaked into homepage after Back");
  await page.locator('[data-portal="academy"]').click();
  await page.reload();
  if(!(await page.locator("#academy").isVisible()))throw Error("Focused Academy screen was lost on refresh");
  if(await page.locator("#portalHub").isVisible())throw Error("Category hub unexpectedly visible after focused refresh");
  await page.locator("#academyJobs").click();
  await page.locator("#academyCourses button").first().click();
  if(!(await page.locator("#bcsRoadmap").isVisible()))throw Error("BCS-specific pathway missing");
  if(await page.locator("#officialSyllabus").isVisible())throw Error("Prelim syllabus leaked into BCS rules stage");
  await page.locator('[data-bcs-stage="written"]').click();
  if(!(await page.locator("#bcsRoadmap").getAttribute("data-stage")==="written"))throw Error("Written stage did not activate");
  if(await page.locator("#officialSyllabus").isVisible())throw Error("Prelim syllabus leaked into written stage");
  await page.locator('[data-bcs-stage="viva"]').click();
  if(!(await page.locator('[data-bcs-stage="viva"]').getAttribute("aria-pressed")==="true"))throw Error("Viva stage not selected");
  await page.locator('[data-bcs-stage="prelim"]').click();
  if(!(await page.locator("#officialSyllabus").isVisible()))throw Error("Prelim syllabus missing when prelim selected");
  if(await page.locator("#academyAdmission").isVisible())throw Error("Admission tab still visible inside BCS course");
  for(const [stage,heading] of [["rules","পরীক্ষা ও বিধিমালা"],["prelim","প্রিলিমিনারি"],["written","লিখিত"],["viva","ভাইভা"]]){await page.locator(`[data-bcs-stage="${stage}"]`).click();if(!(await page.locator("#bcsRoadmap .bcs-stage-grid article:visible").innerText()).includes(heading))throw Error("BCS stage missing: "+heading)}
  await page.locator('[data-bcs-stage="prelim"]').click();

  await page.locator("#courseSave").click();
  if(!(await page.locator("#courseSaved").innerText()).includes("সংরক্ষিত"))throw Error("Goal save failed");
  await page.locator("#bcsChapterList details").first().locator("summary").click();
  await page.locator("#bcsChapterList button").click();
  if(!(await page.locator("#bcsLesson").isVisible()))throw Error("Nested BCS lesson is hidden by category navigation");
  if(!(await page.locator("#bcsLesson").innerText()).includes("পাঠ প্রস্তুতকারক"))throw Error("Textbook attribution missing");
  await page.locator("#bcsLessonQuiz").click();
  if(await page.locator("#quiz").evaluate(el=>el.classList.contains("hidden")))throw Error("Quiz did not open");
  page.once("dialog",dialog=>dialog.dismiss());
  await page.locator('.mobile-nav a[href="#home"]').click();
  if(!(await page.locator("#quiz").isVisible()))throw Error("Cancelled Home navigation interrupted active quiz");
  page.once("dialog",dialog=>dialog.dismiss());
  await page.locator('.mobile-nav a[href="#academy"]').click();
  if(!(await page.locator("#quiz").isVisible()))throw Error("Cancelled Academy navigation interrupted active quiz");
  page.once("dialog",dialog=>dialog.dismiss());
  await page.locator("#portalBack").click();
  if(!(await page.locator("#quiz").isVisible()))throw Error("Cancelled Back navigation interrupted active quiz");
  if(!(await page.locator("#progress").innerText()).includes("1 / 15"))throw Error("Cancelled navigation reset question progress");
  for(let i=0;i<15;i++){
   if(i===14){await page.locator("#skip").click();continue}
   await page.locator("#options button").first().click();
   await page.locator("#next").click();
  }
  if(await page.locator("#result").evaluate(el=>el.classList.contains("hidden")))throw Error("Result not shown");
  if(await page.locator("#chapterProgress").evaluate(el=>el.classList.contains("hidden")))throw Error("Chapter progress not shown");
  if(await page.locator("#chapterAssessment").evaluate(el=>el.classList.contains("hidden")))throw Error("Full chapter assessment not shown");
  if(!(await page.locator("#chapterAssessment").innerText()).includes("অফিসিয়াল পাস নম্বর নয়"))throw Error("Unofficial assessment disclaimer missing");
  // Revisit only missed answers; a partial retry must not be a full-chapter assessment.
  const missedCount=await page.locator('#review [data-outcome]:not([data-outcome="correct"])').count();
  if(missedCount<1)throw Error("Skipped question was not marked for retry");
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
  await page.locator("#portalBack").click();
  if(!(await page.locator("#bcsLesson").isVisible()))throw Error("Back from result did not restore BCS lesson");
  if(await page.locator("#result").isVisible())throw Error("Result remains visible after returning to lesson");
  await page.locator('a[href="#home"]').last().click();
  if(!(await page.locator("#dashboardLatest").innerText()).includes("15"))throw Error("Dashboard did not update");
  await page.reload();
  if(!(await page.locator("#dashboardGoal").innerText()).includes("BCS"))throw Error("Goal not persistent");
  if(!(await page.locator("#dashboardLatest").innerText()).includes("15"))throw Error("Chapter score not persistent");
  const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem("examarena_chapter_progress_v1")||"[]"));
  if(saved.length!==1||saved[0].chapterId!=="bcs-bangla-grammar-01"||saved[0].total!==15)throw Error("Full chapter history missing or partial retry was persisted");
  if(!Number.isInteger(saved[0].score)||saved[0].score<0||saved[0].score>15)throw Error("Invalid saved chapter score");
  // Switching to an unrelated course must not show BCS chapter scores.
  await page.locator('.mobile-nav a[href="#academy"]').click();
  if(!(await page.locator("#academy").isVisible()))throw Error("Academy navigation from results failed");
  await page.locator("#academyAdmission").click();
  await page.locator("#academyCourses button").first().click();
  await page.locator("#courseSave").click();
  if(!(await page.locator("#dashboardLatest").innerText()).includes("এই নির্বাচিত কোর্সে"))throw Error("BCS score leaked into admission dashboard");
  await page.reload();
  if(!(await page.locator("#dashboardGoal").innerText()).includes("মেডিকেল ভর্তি"))throw Error("Admission goal not persistent");
  if(errors.length)throw Error("Browser errors: "+errors.join(" | "));
  console.log("PASS: mobile academy → course → save → chapter → quiz → result → dashboard → reload");
 }catch(error){
  if(page){
   try{const output=path.resolve("test-artifacts");fs.mkdirSync(output,{recursive:true});await page.screenshot({path:path.join(output,"mobile-failure.png"),fullPage:true,timeout:10000});fs.writeFileSync(path.join(output,"mobile-failure.txt"),String(error.stack||error)+"\\nURL: "+page.url()+"\\n");console.error("Browser failure screenshot and details saved in test-artifacts/")}catch(captureError){console.error("Could not capture failure:",captureError.message)}
  }
  throw error;
 }finally{if(browser)await browser.close();await new Promise(resolve=>server.close(resolve))}
})().catch(err=>{console.error(err);process.exitCode=1});
