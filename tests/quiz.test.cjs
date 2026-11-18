"use strict";
const fs=require("node:fs");
const vm=require("node:vm");
const assert=require("node:assert/strict");
const html=fs.readFileSync("index.html","utf8");
const script=html.match(/<script>([\s\S]*?)<\/script>/);
assert.ok(script,"Inline quiz script exists");
new vm.Script(script[1]);
const prefix=script[1].split('if(!validateBank())console.error')[0];
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
assert.match(html,/beforeunload/,"Active exam navigation warning exists");
assert.match(html,/const missed=active\.filter\(/,"Retry only missed questions");
assert.match(html,/\$\("retryMistakes"\)\.disabled=wrong\+skipped===0/,"Disable retry for perfect results");
console.log("PASS: syntax, 45 unique questions, subject counts, 4500 answer shuffles, controls");
