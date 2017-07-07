const fs = require('fs');
const path = require('path');
const iconv = require('iconv-lite');

const pattern = /\d+_.+/;

// var commitDirectory = process.argv[5].split('\\').pop();

fs.writeFileSync(path.join(__dirname,'./out.txt'),JSON.stringify(process.argv));

fs.readFile(process.argv[2] /*path.join(__dirname,'./svn98EE.tmp')*/,function(err, data){
 if (err) throw err;
  var commitedList = data.toString('UTF-8');
 // var buf    = new Buffer(data, 'binary');     //バイナリバッファを一時的に作成する
 // var commitedList = iconv.decode(buf, "Shift_JIS"); //作成したバッファを使い、iconv-liteでShift-jisからutf8に変換
 // fs.writeFileSync(path.join(__dirname,'./out.txt'),`${commitedList}のフォルダがコミットされました。`);
 var tickets = [];
 commitedList.split('\n').forEach(commited=>{
   console.log(commited);
   if(!fs.existsSync(commited.trim())){
     return;
   }
   var directoryCandidate = commited.split('\/').pop().trim();
   if(!fs.statSync(commited.trim()).isDirectory()){
     directoryCandidate = commited.split('\/').slice(-2)[0].trim();
   }
   var ticket = tickets.find(t=>t.id==directoryCandidate);
   if(!ticket){
     ticket = {id:directoryCandidate,phases:[]};
     tickets.push(ticket);
   }
   var phaseNow = commited.split('\/').find(t=>pattern.test(t));
   var phase = ticket.phases.find(p=>p.phase == phaseNow);
   if(!phase){
     phase = {phase:phaseNow,files:[]};
     ticket.phases.push(phase);
   }
  phase.files.push(commited);
 });

 var log = [];
 tickets.forEach(ticket=>{
   log.push(`チケット#${ticket.id}について以下のコミットがありました。`);
   ticket.phases.forEach(phase=>{
     log.push(`${phase.phase}のコミットです。`);
     phase.files.forEach(file=>{
       log.push(`${file}がコミットされました。`);
     });
   });
 });
 fs.writeFileSync(path.join(__dirname,'./out.log'),log.join(' '));
});
