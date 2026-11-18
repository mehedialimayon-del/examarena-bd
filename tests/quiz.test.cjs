"use strict";
const fs=require("node:fs");
const vm=require("node:vm");
const assert=require("node:assert/strict");
const html=fs.readFileSync("index.html","utf8");
const script=html.match(/<script>([\s\S]*?)<\/script>/);
assert.ok(script,"Inline quiz script exists");
new vm.Script(script[1]);
const bankStart=script[1].indexOf('const questions=');
const bankEnd=script[1].indexOf('if(!validateBank())console.error',bankStart);
assert.ok(bankStart>=0&&bankEnd>bankStart,'Standalone question bank found');
const prefix=script[1].slice(bankStart,bankEnd);
const context=vm.createContext({Math,console});
const checks=vm.runInContext(prefix+';({valid:validateBank(),base,extra,randomizeAnswers})',context);
assert.equal(checks.valid,true,"Question bank valid");
const all=[...checks.base,...Object.values(checks.extra).flat()];
assert.equal(all.length,45,"Expected question count");
assert.equal(new Set(all.map(q=>q.q)).size,all.length,"No duplicate questions");
for(const [key,items] of Object.entries(checks.extra))assert.equal(items.length,10,key+" count");
for(const q of all)for(let n=0;n<100;n++){
  const randomized=checks.randomizeAnswers([q])[0];
  assert.equal(randomized.o[randomized.a],q.o[q.a],"Correct answer survives shuffle");
  assert.equal(new Set(randomized.o).size,4,"Four distinct choices");
}
for(const id of ["start","mock","next","skip","quit","again","copy","clear","export","reviewAll","reviewMistakes","retryMistakes","historyToggle","mockCount"]){
 assert.match(html,new RegExp('id="'+id+'"'),id+" button exists");
}
assert.match(html,/JSON\.stringify\(h\.slice\(0,50\)\)/,"Keep up to 50 local results");
assert.match(html,/Number\(x\.score\)<=Number\(x\.total\)/,"Reject invalid stored scores");
assert.match(html,/historyExpanded\?h:h\.slice\(0,10\)/,"Expandable result history");
assert.match(html,/!Array\.isArray\(nextQuestions\)\|\|nextQuestions\.length===0/,"Reject empty quizzes");
assert.match(html,/deadline=0;const s=read\(\)/,"Reset deadline on finish");
assert.match(html,/mockDuration=count\*30/,"Mock duration scales with question count");
assert.match(html,/\[10,20,30\]\.includes\(count\)/,"Only supported mock sizes");
const ids=[...html.matchAll(/id="([^"]+)"/g)].map(x=>x[1]);
assert.equal(new Set(ids).size,ids.length,"HTML IDs must be unique");
const referenced=[...script[1].matchAll(/\\$\\("([^"]+)"\\)/g)].map(x=>x[1]);
for(const id of referenced)assert.ok(ids.includes(id),"Script references existing #"+id);
for(const anchor of ["home","academy","examTracks","subjects","mockArea","historyArea"])assert.ok(ids.includes(anchor),"Navigation anchor "+anchor);
for(const track of ["bcs","bank","university","teacher","ielts","skills"])assert.match(html,new RegExp('data-track="'+track+'"'),track+" preparation card");
assert.match(html,/ভিত্তিমূলক অনুশীলন/,"Foundation practice clearly labeled");
assert.match(html,/IELTS Mock Test-এর বিকল্প নয়/,"IELTS limitations disclosed");
assert.match(html,/beforeunload/,"Active exam navigation warning exists");
assert.match(html,/const missed=active\.filter\(/,"Retry only missed questions");
assert.match(html,/\$\("retryMistakes"\)\.disabled=wrong\+skipped===0/,"Disable retry for perfect results");
console.log("PASS: syntax, 45 unique questions, subject counts, 4500 answer shuffles, controls");

assert.match(html,/id="academyJobs"/,"job academy tab");
assert.match(html,/id="academyAdmission"/,"admission academy tab");
assert.match(html,/class="mobile-nav"/,"mobile bottom navigation");
assert.match(html,/পূর্ণ কোর্স প্রস্তুত হচ্ছে/,"unavailable courses clearly labeled");

// Startup regression: Academy handlers must not run before the DOM lookup helper exists.
const initScript=script[1];
const lookupPosition=initScript.indexOf('const $=id=>document.getElementById(id);');
const firstAcademyHandler=initScript.indexOf('$("academyJobs").onclick');
assert.ok(lookupPosition>=0&&firstAcademyHandler>lookupPosition,"DOM helper is initialized before Academy handlers");
assert.ok(initScript.includes('showStats();renderDashboard();'),"Dashboard initializes on page load");
for(const id of ["myDashboard","dashboardGoal","dashboardLatest","dashboardAdvice","dashboardTasks","dashboardContinue","academyCourses","courseDetail","bcsLessonQuiz","chapterProgress"]){
 assert.match(html,new RegExp('id="'+id+'"'),id+" exists");
}
console.log("PASS: startup order and learner dashboard regression checks");

// Study-abroad content is informational and never promises universal requirements.
for(const id of ["studyAbroad","myDashboard","academy","bcsLesson"]){assert.match(html,new RegExp('id="'+id+'"'),id+" section present")}
assert.match(html,/A&amp;N Overseas Education &amp; Consultancy/, "Optional consultancy pathway disclosed");
assert.match(html,/ExamArena-তে পড়তে এই সেবা নেওয়া বাধ্যতামূলক নয়/, "Consultancy is optional");
assert.match(html,/দেশ, বিশ্ববিদ্যালয়, ডিগ্রি ও প্রোগ্রামভেদে শর্ত আলাদা/, "Country requirements qualified");
console.log("PASS: study abroad section content and independence checks");

assert.match(html,/function showAcademy\(group\)\{\$\("academyCourses"\)\.classList\.remove\("hidden"\)/,"Switching academy tabs restores course list");
assert.match(html,/goal&&goal\.group==="jobs"&&goal\.name==="BCS"\?history\[history\.length-1\]:null/,"BCS result is not shown for other courses");
console.log("PASS: academy tab visibility and course-scoped dashboard assertions");

// First BCS lesson must include guided practice, worked examples and editorial transparency.
for(const phrase of ["শেখার লক্ষ্য","শব্দ ও পদ: পার্থক্য","চারটি মৌলিক পদ চেনার কৌশল","বাক্য বিশ্লেষণ: ধাপে ধাপে","নিজে চেষ্টা করুন","অনুশীলনের উত্তর ও ব্যাখ্যা দেখুন","সম্পাদকীয় যাচাই এখনো বাকি"]){
 assert.ok(html.includes(phrase),"Missing lesson content: "+phrase);
}
console.log("PASS: BCS Bangla lesson structure and review disclaimer");

// Execute the chapter question bank and its validator independently of the browser.
const chapterSource=script[1];
const chapterStart=chapterSource.indexOf("const bcsLessonQuestions=");
const chapterEnd=chapterSource.indexOf("function openBCSLesson()",chapterStart);
assert.ok(chapterStart>=0&&chapterEnd>chapterStart,"Chapter bank block found");
const chapterChecks=vm.runInNewContext(chapterSource.slice(chapterStart,chapterEnd)+";({valid:validateBCSLessonBank(),items:bcsLessonQuestions})");
assert.equal(chapterChecks.valid,true,"15 chapter questions pass structural checks");
assert.equal(chapterChecks.items.length,15,"Exactly 15 chapter questions");
for(const item of chapterChecks.items){
 assert.equal(item.sourceType,"original","Chapter question is original, not claimed past paper");
 assert.equal(item.reviewStatus,"editorial-pending","No unverified editorial approval claim");
 assert.ok(item.e.length>=12,"Every answer has explanation");
}
console.log("PASS: BCS chapter bank runtime validation and provenance checks");

// The chapter explanations must identify the grammatical role in context.
for(const [questionPart,explanationPart] of [
 ["দ্রুতগামী' কোন পদ","বিশেষ্যের গতি-সংক্রান্ত বৈশিষ্ট্য"],
 ["তিনি' কোন পদ","ব্যক্তিনামের পরিবর্তে"],
 ["লিখছে' কোন পদ","বর্তমানে লেখার কাজ"],
 ["পাখি' কোন পদ","প্রাণীশ্রেণির নাম"]
]){
 const item=chapterChecks.items.find(q=>q.q.includes(questionPart));
 assert.ok(item,"Question exists: "+questionPart);
 assert.ok(item.e.includes(explanationPart),"Contextual explanation exists: "+questionPart);
}
console.log("PASS: contextual answer explanations");

assert.match(html,/id="chapterAssessment"/,"Chapter assessment status element exists");
assert.match(html,/fullChapter=topic===chapterPracticeTopic&&active\.length===bcsLessonQuestions\.length/,"Assessment only for full chapter quiz");
assert.match(html,/BCS-এর অফিসিয়াল পাস নম্বর নয়/,"No official pass threshold claim");
console.log("PASS: full-chapter assessment safeguards");
