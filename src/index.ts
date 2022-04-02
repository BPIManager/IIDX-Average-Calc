import fs from "fs";
const fss = fs.promises;
let diff:"11"|"12" = "11";
const songRegExp = /\?|\:|\"|\*|\!|\'|\\|\//g;

const nameReplacer = (songName:string,decode:boolean = false)=>{
  if(decode === false){
    return songName.replace(/\?/g,"_q_").replace(/\:/g,"_c_").replace(/\"/g,"_d_").replace(/\*/g,"_a_").replace(/\!/g,"_e_").replace(/\'/g,"_qo_").replace(/\\/g,"_y_").replace(/\//g,"_s_");
  }
  return songName.replace(/_q_/g,"?").replace(/_c_/g,":").replace(/_d_/g,"\"").replace(/_a_/g,"*").replace(/_e_/g,"!").replace(/_qo_/g,"'").replace(/_y_/g,"\\").replace(/_s_/g,"/");
}

var folder = "C:\\Users\\koro1\\Documents\\GitHub\\IIDX-ScoresRepo\\" + diff + "\\";
var outputDir = "..\\res\\" + diff + "\\"

const openFile = async(path:string)=>{
  try{
    const buff = await fss.readFile(path, "utf-8");
    return buff;
  }
  catch(e:any){
    return "";
  }
}

const parser = async ()=>{
  let path = "";
  try{
    const songs:{[key:string]:number[]} = {};
    const files = fs.readdirSync(folder);
    for(let i =0;i < files.length; ++i){
      path = folder + files[i];
      const f = await openFile(path);
      if(typeof f !== "string") continue;
      const m = JSON.parse(f);
      Object.keys(m).map((item:string)=>{
        if(!songs[item]){
          songs[item] = [m[item]];
        }else{
          songs[item].push(m[item]);
        }
      })
    }
    return songs;
  }catch(e:any){
    console.log(e,path);
    return {};
  }
}

const write = async(fileName:string,output:string)=> await fss.writeFile(fileName, output);

const init = async()=>{
  const res = await parser();
  Object.keys(res).map(async(song:string)=>{
    const rank = res[song];
    let songName = song;
    if(songName === "Idola [A]") songName = "Idola[A]";
    if(songName === "Blind Justice ～Torn souls, Hurt Faiths ～[A]") songName = "Blind Justice ～Torn souls， Hurt Faiths ～[A]";
    if(songName === "COLOSSEUM [A]") songName = "COLOSSEUM[A]";
    if(songName === "Erosion Mark  [A]") songName = "Erosion Mark[A]";
    if(songName === "ROCK女 feat. 大山愛未, Ken[A]") songName = "ROCK女 feat. 大山愛未， Ken[A]";

    console.log(song);
    let finalSongName = nameReplacer(songName);
    await write(outputDir + finalSongName + ".json",JSON.stringify(rank.sort((a,b)=>b -a)));
  })
}

const readWR = async()=>{
  const r = await openFile("..\\inputs\\" + diff +".json");
  try{
    const m = JSON.parse(r);
    return m.reduce((group:any,item:any)=>{
      if(!group) group = {};
      if(!item) return group;
      const d = item.difficulty === "3" ? "[H]" : item.difficulty === "4" ? "[A]" : "[L]";
      group[nameReplacer(item.title) + d] = Number(item.wr);
      return group;
    },{});
  }catch(e){
    console.log(e);
  }
}

const readMax = async()=>{
  const r = await openFile("..\\inputs\\" + diff +".json");
  const m = JSON.parse(r);
  return m.reduce((group:any,item:any)=>{
    if(!group) group = {};
    if(!item) return group;
    const d = item.difficulty === "3" ? "[H]" : item.difficulty === "4" ? "[A]" : "[L]";
    group[nameReplacer(item.title) + d] = Number(item.notes) * 2;
    return group;
  },{});
}

const rs = async ()=>{
  await init();
  const files = fs.readdirSync(outputDir);
  const wrs = await readWR();
  const maxes = await readMax();
  console.log(files);
  let res:{
    title:string,difficulty:number,wr:number,avg:number,playerSum:number,
    BPI100?:number,BPI90?:number,BPI80?:number,BPI70?:number,BPI60?:number,BPI50?:number,
    BPI40?:number,BPI30?:number,BPI20?:number,BPI10?:number,max?:number
  }[] = [];

  for(let i =0; i < files.length; ++i){
    const f = files[i];
    let songName = f.replace(".json","");
    const fullPath = outputDir + f;
    const r = await openFile(fullPath);
    const wr = wrs[songName];
    const max = maxes[songName] || 0;
    if(!wr){
      console.log(songName + ": WR Not found");
    }
    const m = JSON.parse(r);
    const sum = m.reduce((sum:number,item:number)=>sum += Number(item),0);
    const wrLogic = ()=>{
      if(m.length > 0){
        return wr > m[0] ? wr : m[0];
      }else{
        return wr || 0;
      }
    }
    const mGet = (rank:number)=>{
      if(m.length > rank){
        return m[rank];
      }
      return 0;
    }
    const indexOf = (T:string)=>songName.indexOf(`[${T}]`) > -1;
    const _diff = indexOf("H") ? 3 : indexOf("A") ? 4 : 10;
    res.push({title:nameReplacer(songName,true),difficulty:_diff,wr:wrLogic(),
      avg:Math.floor(sum / m.length),
      BPI100:mGet(1),BPI90:mGet(2),BPI80:mGet(5),BPI70:mGet(11),BPI60:mGet(23),BPI50:mGet(51),
      BPI40:mGet(113),BPI30:mGet(249),BPI20:mGet(547),BPI10:mGet(1203),
      max:max,playerSum:m.length});
    }
    await write("..\\release\\" + "release"+ diff +".json",JSON.stringify(res));
    //console.log(files);

  }

  rs();
