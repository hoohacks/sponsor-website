window.HH={
 tiers:[
  {n:'Bronze',p:1000,c:'#4E9F5B'},{n:'Silver',p:3000,c:'#9AA3B8'},{n:'Gold',p:5000,c:'#E0A82E'},
  {n:'Platinum',p:10000,c:'#6E8FE0'},{n:'Diamond',p:15000,c:'#E57200'}],
 // [label, firstTier | perTierText[], when, hourOfEvent (0-24, for timeline)]
 perks:[
  ['Logo on the website',['Logo','Logo','Logo','Large logo','Large logo'],'before'],
  ['Logo on HooHacks T-shirts',[null,'Logo','Logo','Large logo','Large logo'],'before'],
  ['Social media shoutout',[null,null,'Before','Before + after','Before, during + after'],'before'],
  ['Newsletter feature (3,500+ readers)',3,'before'],
  ['Send mentors and judges',0,'during',22],
  ['Sponsorship fair',1,'during',2],
  ['Sponsor lounge',1,'during',1],
  ['Network with students',1,'during',6],
  ['Display and hand out merch',1,'during',3],
  ['Host a workshop',3,'during',5],
  ['Custom slides on venue TVs',3,'during',10],
  ['Sponsor a prize',3,'during',23.5],
  ['Keynote speech',4,'during',0.25],
  ['Coffee chats',4,'during',8],
  ['Sponsor a competition track',4,'during',22.5],
  ['Resume book',[null,null,'After event','Early access','Early access'],'after'],
  ['Post-hackathon email to attendees',3,'after'],
  ['Participant listserv access',4,'after'],
 ],
 addons:[['Sponsor a snack','Bronze',1000],['Sponsor a meal','Bronze','from 2000'],['Non-technical activity','Silver',1000],['Coffee chat','Gold',2000],['Technical workshop','Gold',2500]],
 stats:[['760+','participants'],['46','schools'],['18','states'],['29%','women+'],['220+','projects demoed'],['22+','sponsors and partners']],
 logos:{"capitalone":2.778,"deloitte":5.238,"googlecloud":6.204,"ibm":2.492,"intel":2.543,"janestreet":3.728,"perplexity":4.138,"costar":5.714,"leidos":4.088,"fanniemae":5.1,"appian":2.6,"wolfram":4.333,"roboflow":4.447,"nordvpn":4.613,"cci":0.9,"mlh":2.362},
 money:n=>typeof n==='number'?'$'+n.toLocaleString():'from $'+(+n.split(' ')[1]).toLocaleString(),
 has:(perk,i)=>Array.isArray(perk[1])?perk[1][i]:(i>=perk[1]?true:null),
 // equal-visual-area logo sizing: returns {w,h} in px for a target area
 logoSize:(r,area=3400,maxH=56,maxW=170)=>{let h=Math.sqrt(area/r),w=h*r;if(h>maxH){h=maxH;w=h*r}if(w>maxW){w=maxW;h=w/r}return{w:Math.round(w),h:Math.round(h)}},
};
Object.assign(window.HH,{
 highlights:[
  ['Send mentors and judges','Logo on the website','Add a snack or meal'],
  ['Logo on the T-shirts','Sponsorship fair and sponsor lounge','Network with students','Display and hand out merch'],
  ['Resume book after the event','Social media shoutout before the event','Add coffee chats or a workshop'],
  ['Large logo on the website and shirts','Early resume book access','Host a workshop','Sponsor a prize','Newsletter feature and post-event email'],
  ['Sponsor a competition track','Keynote speech','Coffee chats','Participant listserv access','Shoutouts before, during, and after'],
 ],
 groups:[['At the event',['Send mentors and judges','Network with students','Sponsorship fair','Sponsor lounge','Display and hand out merch','Host a workshop','Custom slides on venue TVs','Sponsor a prize','Sponsor a competition track','Keynote speech','Coffee chats']],
         ['Brand',['Logo on the website','Logo on HooHacks T-shirts','Social media shoutout','Newsletter feature (3,500+ readers)']],
         ['Recruiting',['Resume book','Post-hackathon email to attendees','Participant listserv access']]],
 projects:[
  ['sheriffs','Shaded Sheriffs','Smart glasses that describe the world out loud for people with low vision.','Hardware'],
  ['sun','Memory of the Sun','Solar panels that track the sun with shape-memory alloys instead of motors.','Hardware'],
  ['scamshield','ScamShield','Listens for scam calls in real time and alerts seniors and their families.','Security'],
  ['heartkey','HeartKey','Two-factor authentication using your heartbeat.','Security'],
  ['mediscribe','MediScribe','Live medical translation for patients who don\'t speak English.','Health'],
  ['surviv','Surviv','An offline mesh network that turns phones into lifelines.','Networking'],
  ['gauntlet','Agent Gauntlet','A stress-test harness for AI browser agents.','AI'],
 ],
 // comparison table rows: returns [{group, rows:[{label, cells:[true|string|null x5]}]}]
 table(){const P=Object.fromEntries(this.perks.map(p=>[p[0],p]));return this.groups.map(([g,ls])=>({group:g,rows:ls.map(l=>({label:l,cells:this.tiers.map((_,i)=>this.has(P[l],i))}))}))},
 bindForm(formId,sentId){const f=document.getElementById(formId);f.onsubmit=e=>{e.preventDefault();f.style.display='none';document.getElementById(sentId).style.display='block'}},
 logoImgs(area,maxH,maxW,wrap=x=>x){return Object.entries(this.logos).map(([k,r])=>{const s=this.logoSize(r,area,maxH,maxW);return wrap(`<img src="logos2/${k}.png" alt="${k}" style="width:${s.w}px;height:${s.h}px">`)}).join('')},
});
