// Gameplay abstractions, not quantitative claims about Buddhist attainment.
const ORIGINS = [
 {id:'walker',name:'行脚者',line:'路远，行囊轻。你想找一个安顿心的地方。',gift:'定学稍熟 · 资粮较少',stats:{food:38,fatigue:20,focus:28,wisdom:16,grasp:22,conduct:44}},
 {id:'householder',name:'在家人',line:'灯火与牵挂都在身后。你为自己留出一段时间。',gift:'资粮充足 · 行持较稳',stats:{food:64,fatigue:24,focus:14,wisdom:12,grasp:28,conduct:58}},
 {id:'scholar',name:'问学者',line:'你读过许多关于寂静的句子，尚未亲自走进去。',gift:'慧解较高 · 定学初起',stats:{food:43,fatigue:16,focus:16,wisdom:36,grasp:24,conduct:42}}
];
const STAT_NAMES={food:'资粮',fatigue:'疲劳',focus:'定学',wisdom:'慧解',grasp:'牵著',conduct:'行持'};
const ACTIONS=[
 {id:'work',name:'入村劳作',icon:'田',type:'生活',desc:'补充资粮，也承受奔忙。',effect:{food:18,fatigue:10,focus:-3}},
 {id:'rest',name:'歇息调身',icon:'月',type:'生活',desc:'让绷紧的弦松下来。',effect:{fatigue:-22,focus:-2,food:-1}},
 {id:'guard',name:'守护行持',icon:'戒',type:'基础',desc:'检点言行，减少修习的扰动。',effect:{conduct:10,focus:2,fatigue:3,food:-1}},
 {id:'give',name:'分粮济人',icon:'灯',type:'生活',desc:'分出所持，让攫取稍缓。',effect:{food:-8,conduct:7,grasp:-6,wisdom:1,fatigue:2}},
 {id:'study',name:'听闻思择',icon:'卷',type:'慧学',desc:'从师友处听闻，再自行审察。',effect:{wisdom:10,focus:2,fatigue:7,food:-2}},
 {id:'observe',name:'观照所缘',icon:'观',type:'慧学',desc:'辨认此刻依着什么，想留住什么。',effect:{wisdom:6,grasp:-8,focus:3,fatigue:7},needWisdom:20},
 {id:'calm',name:'林间修止',icon:'息',type:'定学',desc:'护持所缘，修习心的稳定。',effect:{focus:12,fatigue:9,food:-1}},
 {id:'enter',name:'进修初定',icon:'定',type:'等至',desc:'条件具备时，展开本章的定境演示。',effect:{focus:4,fatigue:6},cost:2}
];
const EVENTS=[
 {id:'misread',title:'山下的误解',scene:'village',tag:'人与人之间',text:'你替人搬了一下午的柴。归还绳子时，主人摸了摸空口袋，看了你一眼。\n\n“你刚才，一直在这儿？”\n\n没有人明确指责你。你却已经在心里把争辩说完了。',choices:[
  {name:'把经过说明白，再离开',desc:'让事实得到说明，也容许对方暂时不信。',effect:{wisdom:4,conduct:3,fatigue:2},result:'你说完，把绳子放下。走了一段路，你发现自己仍在复述刚才的话。你看见了这个重复。'},
  {name:'一定要他当面道歉',desc:'名誉得以维护，争执也会留下回声。',effect:{grasp:10,food:5,fatigue:6},result:'他终于说了对不住。一路上，你又想出了三句当时该说的话。'},
  {name:'留下些粮食，省得再有纠缠',desc:'暂时避开冲突，代价由自己承担。',effect:{food:-7,grasp:4,fatigue:-3},result:'事情过去得很快。晚上你仍想问：为什么是我留下东西？'}]},
 {id:'rain',title:'雨落三日',scene:'rain',tag:'身与环境',text:'屋檐漏水。干柴见底。你原本安排好的修习，被一盆一盆的雨声打断。\n\n隔壁的老者说：“先把床挪一挪吧。”',choices:[
  {name:'修屋、晒柴，重新安排',desc:'花些资粮，让日常重新可以承受。',effect:{food:-7,fatigue:-12,conduct:4},result:'屋顶没有完全补好，床终于干了。你把明日的安排减去了一项。'},
  {name:'按原定强度坚持',desc:'定学有所积累，身体也承受额外负担。',effect:{focus:9,fatigue:17},result:'你坚持到了夜里。雨声仍在，只是第二天坐下时，背比平时更沉。'},
  {name:'入村借宿，听人闲谈',desc:'暂缓独修，接触新的见闻。',effect:{wisdom:5,focus:-4,fatigue:-6},result:'你听了半夜庄稼、家人和债务的故事。天亮后，雨已经小了。'}]},
 {id:'praise',title:'有人开始称赞你',scene:'village',tag:'成功的回声',text:'有人说，你比刚来时沉静了。第二天又有人前来，带着粮食，想听你讲几句。\n\n你还没有想好讲什么，已经开始期待他们再来。',choices:[
  {name:'只谈自己确实知道的部分',desc:'接受供给，守住表达的边界。',effect:{food:8,conduct:5,wisdom:3},result:'你说到不确定的地方便停住。对方没有失望，问你明日是否还在。'},
  {name:'把零碎体验讲成完整境界',desc:'能获得更多资粮，也更难放下这个身份。',effect:{food:17,grasp:14,conduct:-6},result:'众人点头。此后每次坐下，你都希望出现配得上那些话的体验。'},
  {name:'暂不讲说，回到日常',desc:'减少外缘，仍须处理内心对评价的回顾。',effect:{focus:5,grasp:-4,food:-2},result:'人散以后，你先是轻松，又有一点失落。两种感觉挨得很近。'}]},
 {id:'method',title:'另一位修行人',scene:'forest',tag:'方法与选择',text:'山路上，一位修行人告诉你：他曾经只追求安乐，后来开始分辨，自己为何那么怕失去安乐。\n\n“同一个地方，”他说，“可以有不同的去法。”',choices:[
  {name:'请他谈谈如何观察',desc:'以听闻支持观照。',effect:{wisdom:11,grasp:-3,fatigue:3},result:'他说得很具体，都是心如何又转回去。你记下了几个自己能够观察的问题。',codex:'定与慧'},
  {name:'询问更快入定的方法',desc:'专注定学训练。',effect:{focus:11,fatigue:5},result:'他也认真回答。临别时，你发现自己只记住了其中关于速度的部分。'},
  {name:'把食物分给他，继续赶路',desc:'一场短暂而友善的相逢。',effect:{food:-5,conduct:7,grasp:-5},result:'你们没有互通姓名。再过一道山弯，那句话又想了起来。'}]},
 {id:'memory',title:'旧日的一封信',scene:'room',tag:'牵挂',text:'信里只是些平常事。街口的树被砍了，家里换了屋瓦，一个人顺便问候了你。\n\n你却读了好几遍最后那一行。',choices:[
  {name:'认真回信，再继续今日修习',desc:'照料关系，也照料未完的事情。',effect:{conduct:4,grasp:-3,fatigue:-4},result:'你把想说的话写下。投信回来，坐垫还在原处。'},
  {name:'设想对方每句话的言外之意',desc:'投入思索，心也更难收束。',effect:{grasp:12,focus:-6,fatigue:5},result:'你想出了好几种意思。每一种都还需要另一封信才能确定。'},
  {name:'先搁置，不许自己再想',desc:'保住安排，未必已经理解牵挂。',effect:{focus:5,grasp:3,fatigue:4},result:'你把信藏到书底。坐下以后，信末的几个字又出现了。'}]},
 {id:'comparison',title:'比你更早的人',scene:'forest',tag:'比较',text:'同行的人说起自己的进境。你听完，先替他高兴，随即想到：他明明比自己晚开始。\n\n那天，平时还算安稳的修习变得急迫起来。',choices:[
  {name:'观察刚刚发生的比较',desc:'看清推动自己加速的是什么。',effect:{wisdom:8,grasp:-6,focus:2},result:'你仍希望自己进步。只是这一刻，你分辨出其中多了一位看不见的对手。'},
  {name:'加倍用功，尽快追上',desc:'短期定学增长，疲劳与牵著增加。',effect:{focus:13,fatigue:15,grasp:8},result:'你多坐了一次。结束时，第一件事是想问他今日又到了哪里。'},
  {name:'请教他的安排与困难',desc:'获得实际经验，减少想象。',effect:{wisdom:6,focus:5,conduct:2},result:'他谈了自己的反复与退失。那段看起来笔直的路，原来有许多折返。'}]},
 {id:'donor',title:'一座更好的屋子',scene:'room',tag:'资具与依赖',text:'一位施主愿意为你修一间静室。屋子安静、干燥，有人送饭。\n\n他只有一个请求：“有人来访时，请你偶尔露面。”',choices:[
  {name:'接受，并把讲说范围说清',desc:'改善生活条件，承担一些事务。',effect:{food:14,fatigue:4,conduct:3},result:'新屋很安静。你也确实多了一些要见的人。'},
  {name:'欣然接受，答应所有安排',desc:'资粮更多，外界期待也更重。',effect:{food:23,grasp:10,focus:-4},result:'他很高兴。很快，别人替你安排好了下一个月。'},
  {name:'谢过好意，保留现有安排',desc:'减少事务，继续承担简朴生活。',effect:{grasp:-5,focus:4,food:-3},result:'旧屋仍会漏风。你需要自己记得，当时为何作出这个决定。'}]},
 {id:'stagnation',title:'今日没有进步',scene:'rain',tag:'反复',text:'同样的时辰，同样的坐垫。今日比昨日更散乱。\n\n你开始怀疑，那些已经走过的路是否真的走过。',choices:[
  {name:'记录条件，调整强度',desc:'把反复放回具体条件中。',effect:{wisdom:6,fatigue:-7,grasp:-3},result:'你在记录里添上睡眠、天气与奔忙。这个坏日子终于有了边界。'},
  {name:'用更长的修习补回来',desc:'定学略增，疲劳明显上升。',effect:{focus:8,fatigue:16},result:'时辰到了，你仍不愿停。天黑时，今日的安排终于被完成了。'},
  {name:'去做一件具体的小事',desc:'暂缓比较，修补生活。',effect:{food:5,conduct:5,fatigue:-3},result:'你把门口的路铺平了。晚上回来，鞋底没有再沾上那块泥。'}]}
];
const AFTER_JHANA={id:'after-jhana',title:'初禅之后',scene:'dawn',tag:'出定之后 · 新的分岔',text:'你已经从定中出来。林间仍是那片林间。\n\n刚才的安乐，现在成为可以回想的过去。你发现：心开始朝着那段过去转去。',choices:[
 {name:'记取它，再观察此刻的心',desc:'分别定的获得与此后的反应。',effect:{wisdom:9,grasp:-5},result:'你记下刚才的体验，也记下现在想留住它的冲动。它们发生在不同的时候。',flag:'reflect',codex:'味、净、无漏'},
 {name:'反复回味，想让它永不消失',desc:'过去的净定，成为此后味著的对象。',effect:{grasp:20,focus:4},result:'安乐已经过去，对安乐的爱开始现前。本章用前后两个阶段，表示净等至之后生起的味著。',flag:'taste',codex:'味、净、无漏'},
 {name:'下山告诉众人，接受他们的赞叹',desc:'获得资粮，也更依赖被认可的修行身份。',effect:{food:12,grasp:14},result:'众人静静听着。你说完后，希望他们再多问几句。',flag:'tell',codex:'定与生'}]};
const CODEX={
 '定与生':{title:'定与生：同名而所指不同',text:'《俱舍论》卷二十八分静虑为定与生。此章角色所生仍为欲界人趣；入初静虑表示定境演示，不表示已经命终生到梵天。',vol:28},
 '五支':{title:'初静虑五支',text:'依有部，净、无漏初静虑立寻、伺、喜、乐、等持五支。其中乐支是轻安，喜支为喜受。此表列显著支分，并非全部相应心所。',vol:28},
 '味、净、无漏':{title:'净定之后，仍可能生起味著',text:'依《俱舍论》，味等至与爱相应，净为世间善，无漏为出世。可缘过去净等至生味著，不能把善净定与此后的贪混画为同时相应。本章只演示净定及定后反应，不模拟无漏证得。',vol:28},
 '定与慧':{title:'定学与断惑，分别观察',text:'得定不直接等同断尽烦恼。依地、所起道及先已离染等条件，须另作分别。本章“慧解”是学习与辨认的玩法指标，不是见道、圣果或无漏慧的等价数值。',vol:23},
 '九地':{title:'九地不是九级人物等级',text:'欲界一地，色界四静虑地，无色界四地。受生、等至及断惑的分类有关联，却不能用一条人物等级条替代。四无色没有空间方所。',vol:8}
};
function clamp(v){return Math.max(0,Math.min(100,Math.round(v)));}
function rng(g){g.seed=(Math.imul(g.seed,1664525)+1013904223)>>>0;return g.seed/4294967296;}
function newGame(origin='walker',seed=Date.now()>>>0){const o=ORIGINS.find(x=>x.id===origin)||ORIGINS[0];const g={version:1,origin:o.id,seed,turn:1,ap:2,maxTurns:18,stats:{...o.stats},phase:'play',event:null,seen:[],highest:0,entries:0,post:[],codex:['定与生','九地'],log:[],last:'',lastChange:{},totalActions:0};g.queue=EVENTS.map(e=>e.id);for(let i=g.queue.length-1;i>1;i--){const j=1+Math.floor(rng(g)*i);[g.queue[i],g.queue[j]]=[g.queue[j],g.queue[i]];}addLog(g,'山门之外',o.line);return g;}
function addLog(g,title,text){g.log.unshift({turn:g.turn,title,text});g.log=g.log.slice(0,60);g.last=text;}
function apply(g,effect){g.lastChange={};for(const [k,v]of Object.entries(effect||{})){const old=g.stats[k];g.stats[k]=clamp(old+v);g.lastChange[k]=g.stats[k]-old;}}
function actionEffect(g,a){const e={...a.effect};if(a.id==='calm'&&g.stats.conduct>=55)e.focus+=3;if((a.id==='calm'||a.id==='study'||a.id==='observe')&&g.stats.fatigue>=65){if(e.focus>0)e.focus=Math.max(1,Math.floor(e.focus/2));if(e.wisdom>0)e.wisdom=Math.max(1,Math.floor(e.wisdom/2));}return e;}
function enterRequirements(g){return [{name:'定学',current:g.stats.focus,need:62,ok:g.stats.focus>=62},{name:'行持',current:g.stats.conduct,need:55,ok:g.stats.conduct>=55},{name:'疲劳',current:g.stats.fatigue,need:42,ok:g.stats.fatigue<=42,less:true},{name:'牵著',current:g.stats.grasp,need:48,ok:g.stats.grasp<=48,less:true}];}
function disabledReason(g,a){if(g.phase!=='play')return '先完成眼前的事件';if(g.ap<(a.cost||1))return `需要${a.cost||1}次行动`;if(a.needWisdom&&g.stats.wisdom<a.needWisdom)return `慧解需达${a.needWisdom}`;if(a.id==='give'&&g.stats.food<8)return '资粮不足8';if(a.id==='enter'&&enterRequirements(g).some(r=>!r.ok))return '尚需准备：查看定境条件';return '';}
function act(g,id){const a=ACTIONS.find(x=>x.id===id);if(!a||disabledReason(g,a))return false;g.ap-=a.cost||1;g.totalActions++;const ef=actionEffect(g,a);apply(g,ef);let messages={work:'你把一天交给了村里的活计。粮袋重了些，心里也带回几段人声。',rest:'你没有添新的功课。清晨醒来，身体比昨日轻了一点。',guard:'你重新检点言行。几件原本会纠缠的事，停在了最初的地方。',give:'粮袋轻了些。走开时，你留意到自己是否还在等一句感谢。',study:'你把听来的话放在自己的经验旁，辨认其中还不明白的部分。',observe:'你观察一个反复出现的念头：它依着什么，又想要什么。',calm:g.stats.fatigue>=65?'你护持所缘，但疲劳削弱了本次修习的效果。':'林间没有比昨日更安静。你只是比昨日更能安住。'};if(id==='study'&&!g.codex.includes('定与慧'))g.codex.push('定与慧');
 if(id==='enter'){g.highest=1;g.entries++;g.phase='meditation';if(!g.codex.includes('五支'))g.codex.push('五支');addLog(g,'初静虑 · 定境演示','寻、伺、喜、轻安乐、等持五支显现。所生之地仍为欲界人趣。');}else addLog(g,a.name,messages[id]);return true;}
function leaveMeditation(g){if(g.phase!=='meditation')return false;g.event='after-jhana';g.phase='event';return true;}
function currentEvent(g){return g.event==='after-jhana'?AFTER_JHANA:EVENTS.find(e=>e.id===g.event);}
function resolveChoice(g,index){if(g.phase!=='event')return false;const e=currentEvent(g),c=e?.choices[index];if(!c)return false;apply(g,c.effect);if(c.flag)g.post.push(c.flag);if(c.codex&&!g.codex.includes(c.codex))g.codex.push(c.codex);addLog(g,e.title,c.result);g.event=null;g.phase='play';return true;}
function endPeriod(g){if(g.phase!=='play'||g.needsAdvance)return false;if(g.ap>0)return false;if(g.turn>=g.maxTurns){g.phase='ending';g.ending=getEnding(g);return true;}if(g.turn%2===1){const id=g.queue.find(x=>!g.seen.includes(x));if(id){g.seen.push(id);g.event=id;g.phase='event';g.needsAdvance=true;return true;}}advancePeriod(g);return true;}
function advancePeriod(g){g.turn++;g.ap=2;g.needsAdvance=false;g.lastChange={};const old=g.stats.food;g.stats.food=clamp(old-3);if(old<3){g.stats.fatigue=clamp(g.stats.fatigue+9);g.stats.focus=clamp(g.stats.focus-4);addLog(g,'资粮见底','供给不足，疲劳上升。入村劳作或接受适当资具，可以让修习继续。');}}
function continueAfterEvent(g){if(g.phase==='play'&&g.needsAdvance){advancePeriod(g);return true;}return false;}
function getEnding(g){const s=g.stats;if(g.highest&&g.post.includes('reflect')&&s.wisdom>=60&&s.grasp<=28&&s.conduct>=50)return {id:'clear',title:'定后观照',line:'你记得寂静，也看见想占有寂静的心。',text:'十八旬过去，你没有为自己添上一个果位。那段安乐仍值得记取；它如何过去、心如何追随它，也成为了观察的一部分。',color:'#b6d6b8'};if(g.highest&&s.grasp>=55)return {id:'taste',title:'想把寂静带走',line:'曾经让你松开的东西，成了新的牵挂。',text:'你确实走进过那片寂静。后来，每次坐下，你都等它回来。你拥有了一段经历，也开始围着这段经历生活。',color:'#d2ae7c'};if(s.fatigue>=80)return {id:'string',title:'弦太紧了',line:'你一直向前，直到身体替你停下。',text:'功课完成了许多，休息被一次次推迟。你把下一程的第一件事写成了“歇一歇”。山路还在那里。',color:'#c59383'};if(g.highest)return {id:'forest',title:'林间一境',line:'你学会走入安稳，也开始学习离开。',text:'你获得了本章的初定体验。这份成就改变了修习的可能，往后的牵著与取舍仍需要另外面对。',color:'#a3c9b4'};if(s.wisdom>=65&&s.grasp<=30)return {id:'turn',title:'尚未入定，已经转身',line:'你未抵达那片寂静，辨认却比从前清楚。',text:'你开始分辨听懂、亲见、期待与确信。此章没有授予你圣果；它为下一程留下了更具体的问题。',color:'#b8c4db'};if(s.food>=50&&s.conduct>=65)return {id:'lamp',title:'灯火相续',line:'你照料了眼前的生活，也照料了别人。',text:'屋里有粮，门前的路有人修，彼此说话比从前可信。这段行旅的收获，落在了继续生活的条件里。',color:'#d8bf8e'};if(s.grasp>=65)return {id:'echo',title:'回声里的名字',line:'你走了很远，仍在听别人怎样称呼你。',text:'你记得赞许，也记得误解。那些人已经散了，他们的话仍替你安排着下一件事。',color:'#c59d87'};return {id:'road',title:'山路未尽',line:'没有一个称号，能替你概括这段路。',text:'你经历了用功、奔忙、理解与迟疑。回看行旅，有些选择值得保留，有些可以在下一次尝试中改变。',color:'#adc1b7'};}
function validSave(g){return !!(g&&g.version===1&&ORIGINS.some(o=>o.id===g.origin)&&Number.isInteger(g.turn)&&g.turn>=1&&g.turn<=18&&Number.isInteger(g.ap)&&g.ap>=0&&g.ap<=2&&['play','event','meditation','ending'].includes(g.phase)&&g.stats&&Object.keys(STAT_NAMES).every(k=>Number.isFinite(g.stats[k])&&g.stats[k]>=0&&g.stats[k]<=100)&&Array.isArray(g.codex)&&g.codex.every(k=>typeof k==='string'&&!!CODEX[k])&&Array.isArray(g.log)&&g.log.every(e=>Number.isInteger(e.turn)&&typeof e.title==='string'&&typeof e.text==='string')&&Array.isArray(g.post)&&g.post.every(x=>['reflect','taste','tell'].includes(x))&&Array.isArray(g.seen)&&g.seen.every(x=>EVENTS.some(e=>e.id===x))&&Array.isArray(g.queue)&&g.queue.every(x=>EVENTS.some(e=>e.id===x))&&['after-jhana',null,...EVENTS.map(e=>e.id)].includes(g.event))}
