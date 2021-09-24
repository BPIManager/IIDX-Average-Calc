import fs from "fs";
const fss = fs.promises;
let diff:"11"|"12" = "12";
const songRegExp = /\?|\:|\"|\*|\!|\'|\\|\//g;

const nameReplacer = (songName:string,decode:boolean = false)=>{
  if(decode === false){
    return songName.replace(/\?/g,"_q_").replace(/\:/g,"_c_").replace(/\"/g,"_d_").replace(/\*/g,"_a_").replace(/\!/g,"_e_").replace(/\'/g,"_qo_").replace(/\\/g,"_y_").replace(/\//g,"_s_");
  }
  return songName.replace(/_q_/g,"?").replace(/_c_/g,":").replace(/_d_/g,"\"").replace(/_a_/g,"*").replace(/_e_/g,"!").replace(/_qo_/g,"'").replace(/_y_/g,"\\").replace(/_s_/g,"/");
}

var folder = "D:\\bpis\\ScoresRepo\\IIDX-ScoresRepo\\12\\total\\";
var outputDir = ".\\res\\" + diff + "\\"

const openFile = async(path:string)=>{
  try{
    const buff = await fss.readFile(path, "utf-8");
    return buff;
  }
  catch(e){
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
  }catch(e){
    console.log(e,path);
    return {};
  }
}

const write = async(fileName:string,output:string)=> await fss.writeFile(fileName, output);

const init = async()=>{
  const res = await parser();
  Object.keys(res).map(async(song:string)=>{
    const rank = res[song];
    if(songRegExp.test(song)){
      console.log(song);
    }
    await write(outputDir + nameReplacer(song) + ".json",JSON.stringify(rank.sort((a,b)=>b -a)));
  })
}

const readWR = async()=>{
  console.log(diff);
  const r = await openFile(".\\inputs\\" + diff +".json");
  const m = JSON.parse(r);
  return m.reduce((group:any,item:any)=>{
    if(!group) group = {};
    const d = item.difficulty === "3" ? "[H]" : item.difficulty === "4" ? "[A]" : "[L]";
    group[nameReplacer(item.title) + d] = Number(item.wr);
    return group;
  },{});
}

const readMax = async()=>{
  const r = await openFile(".\\inputs\\" + diff +".json");
  const m = JSON.parse(r);
  return m.reduce((group:any,item:any)=>{
    if(!group) group = {};
    const d = item.difficulty === "3" ? "[H]" : item.difficulty === "4" ? "[A]" : "[L]";
    group[nameReplacer(item.title) + d] = Number(item.notes) * 2;
    return group;
  },{});
}

// 曲名認識バグの緊急措置
const songNameRevise12 = (songName:string)=>{
  switch(songName){
    case "snow storm[A]": return "snow storm[L]";
    case "Secrets[A]": return "Secrets[L]";
    case "仮想空間の旅人たち[A]": return "仮想空間の旅人たち[L]";
    case "お米の美味しい炊き方、そしてお米を食べることによるその効果。[A]": return "お米の美味しい炊き方、そしてお米を食べることによるその効果。[L]";
    default: return songName;
  }
}

const songNameRevise11 = (songName:string)=>{
  switch(songName){
    case "Ypsilon[L]": return "Ypsilon[A]";
    case "Amazing Mirage[L]": return "Amazing Mirage[A]";
    case "GuNGNiR[L]": return "GuNGNiR[H]";
    case "Amazing Mirage[L]": return "Amazing Mirage[A]";
    case "SAMURAI-Scramble[L]": return "SAMURAI-Scramble[A]";
    case "STARLIGHT DANCEHALL[L]": return "STARLIGHT DANCEHALL[A]";
    case "Welcome[L]": return "Welcome[A]";
    case "ZEPHYRANTHES[L]": return "ZEPHYRANTHES[A]";
    case "CHRONO DIVER -NORNIR-[L]": return "CHRONO DIVER -NORNIR-[A]";
    case "Cosmic Cat[L]": return "Cosmic Cat[A]";
    case "超青少年ノ為ノ超多幸ナ超古典的超舞曲[L]": return "超青少年ノ為ノ超多幸ナ超古典的超舞曲[A]";
    case "龍と少女とデコヒーレンス[L]": return "龍と少女とデコヒーレンス[A]";
    case "QUANTUM TELEPORTATION[L]": return "QUANTUM TELEPORTATION[A]";
    case "TITANS RETURN[L]": return "TITANS RETURN[A]";
    case "AIR RAID FROM THA UNDAGROUND[L]": return "AIR RAID FROM THA UNDAGROUND[A]";
    case "Arabian Rave Night[L]": return "Arabian Rave Night[A]";
    case "B4U(BEMANI FOR YOU MIX)[L]": return "B4U(BEMANI FOR YOU MIX)[A]";
    case "Kung-fu Empire[L]": return "Kung-fu Empire[A]";
    case "Marie Antoinette[L]": return "Marie Antoinette[A]";
    case "naughty girl@Queen's Palace[L]": return "naughty girl@Queen's Palace[A]";
    case "Anisakis -somatic mutation type\"Forza\"-[L]": return "Anisakis -somatic mutation type\"Forza\"-[A]";
    case "Blue Rain[L]": return "Blue Rain[A]";
    case "STEEL NEEDLE[L]": return "STEEL NEEDLE[A]";
    case "THE DEEP STRIKER[L]": return "THE DEEP STRIKER[A]";
    case "Ubertreffen[L]": return "Ubertreffen[A]";
    case "KAMAITACHI[L]": return "KAMAITACHI[A]";
    case "TRANOID[L]": return "TRANOID[A]";
    case "CONTRACT[L]": return "CONTRACT[A]";
    case "Ganymede[L]": return "Ganymede[A]";
    case "waxing and wanding[L]": return "waxing and wanding[A]";
    case "Little Little Princess[L]": return "Little Little Princess[A]";
    case "Be quiet[L]": return "Be quiet[A]";
    case "RED ZONE[L]": return "RED ZONE[A]";
    case "spiral galaxy[L]": return "spiral galaxy[A]";
    default: return songName;
  }
}

const rs = async ()=>{
  await init();
  const files = fs.readdirSync(outputDir);
  const wrs = await readWR();
  const maxes = await readMax();
  let res:{
    title:string,difficulty:number,wr:number,avg:number,playerSum:number,BPI100:number,BPI90:number,BPI80:number,BPI70:number,BPI60:number,BPI50:number,
    BPI40:number,BPI30:number,BPI20:number,BPI10:number,max:number
  }[] = [];
  for(let i =0; i < files.length; ++i){
    const f = files[i];
    let songName = f.replace(".json","");
    const fullPath = outputDir + f;
    const r = await openFile(fullPath);
    if(diff === "12"){
      songName = songNameRevise12(songName);
    }else if(diff === "11"){
      songName = songNameRevise11(songName);
    }
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
    res.push({title:songName,difficulty:_diff,wr:wrLogic(),
      BPI100:mGet(1),BPI90:mGet(2),BPI80:mGet(5),BPI70:mGet(11),BPI60:mGet(23),BPI50:mGet(51),
      BPI40:mGet(113),BPI30:mGet(249),BPI20:mGet(547),BPI10:mGet(1203),
      avg:Math.floor(sum / m.length),
      playerSum:m.length,max:max});
    }
    await write(".\\release\\" + "release"+ diff +".json",JSON.stringify(res));
    console.log(files);

  }

  rs();
