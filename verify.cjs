const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
const c=vm.createContext({});
vm.runInContext(fs.readFileSync(__dirname+'/src/engine.js','utf8')+'\nthis.api={ORIGINS,ACTIONS,newGame,act,disabledReason,resolveChoice,endPeriod,continueAfterEvent,leaveMeditation,getEnding,validSave};',c);
const a=c.api;
function settle(g){let guard=0;while(guard++<8){if(g.phase==='event'){a.resolveChoice(g,0);continue;}if(g.needsAdvance){a.continueAfterEvent(g);continue;}if(g.phase==='play'&&g.ap===0){a.endPeriod(g);continue;}break;}}
const g=a.newGame('walker',42);assert(a.validSave(g));assert.equal(a.act(g,'enter'),false);
for(const id of ['guard','guard','calm','calm','rest','calm']){settle(g);assert(a.act(g,id));}
settle(g);assert(a.act(g,'enter'));assert.equal(g.phase,'meditation');assert.equal(g.highest,1);assert(a.leaveMeditation(g));assert.equal(g.phase,'event');assert.equal(g.event,'after-jhana');
const reflect=JSON.parse(JSON.stringify(g)),taste=JSON.parse(JSON.stringify(g));assert(a.resolveChoice(reflect,0));assert(a.resolveChoice(taste,1));assert(reflect.stats.grasp<taste.stats.grasp);assert(reflect.stats.wisdom>taste.stats.wisdom);assert.equal(reflect.highest,taste.highest);
const seedA=a.newGame('scholar',100),seedB=a.newGame('scholar',100);assert.equal(JSON.stringify(seedA),JSON.stringify(seedB));
const endings=new Set();
for(let seed=1;seed<=2000;seed++){
 const x=a.newGame(a.ORIGINS[seed%3].id,seed);let counter=0;
 while(x.phase!=='ending'&&counter++<180){
  if(x.phase==='meditation'){a.leaveMeditation(x);continue;}
  if(x.phase==='event'){a.resolveChoice(x,(seed+counter)%3);continue;}
  if(x.needsAdvance){a.continueAfterEvent(x);continue;}
  if(!x.ap){a.endPeriod(x);continue;}
  const options=a.ACTIONS.filter(k=>!a.disabledReason(x,k));assert(options.length>0);
  const index=((seed*17+counter*31)^(seed>>>2)^counter*seed)>>>0;a.act(x,options[index%options.length].id);assert(a.validSave(x));
 }
 assert.equal(x.phase,'ending');assert.equal(x.turn,18);endings.add(a.getEnding(x).id);
}
const echo=a.newGame('walker',99);let ct=0;
while(echo.phase!=='ending'&&ct++<180){
 if(echo.phase==='event'){a.resolveChoice(echo,1);continue;}
 if(echo.needsAdvance){a.continueAfterEvent(echo);continue;}
 if(!echo.ap){a.endPeriod(echo);continue;}
 a.act(echo,echo.stats.fatigue>25?'rest':'work');
}
assert.equal(a.getEnding(echo).id,'echo');endings.add('echo');
assert.equal(endings.size,8);
console.log('PASS: entry gates, separate post-meditation branches, deterministic saves, 2,001 complete runs, all eight endings reachable.');
