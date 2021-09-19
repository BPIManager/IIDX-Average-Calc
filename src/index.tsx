import fs from "fs";
const fss = fs.promises;
const diff = "12";
const songRegExp = /\?|\:|\"|\*|\!|\'|\\|\//g;

var folder = "D:\\Downloads\\bpi_kaiden\\" + diff + "\\";
var outputDir = ".\\res\\"

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
  const songs:{[key:string]:number[]} = {};
  const files = fs.readdirSync(folder);
  for(let i =0;i < files.length; ++i){
    const fullPath = folder + files[i];
    const f = await openFile(fullPath);
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
}

const write = async(fileName:string,output:string)=> await fss.writeFile(fileName, output);

const init = async()=>{
  const res = await parser();
  Object.keys(res).map(async(song:string)=>{
    const rank = res[song];
    await write(outputDir + song.replace(songRegExp," ") + ".json",JSON.stringify(rank.sort((a,b)=>b -a)));
  })
}

const readWR = async()=>{
  const r = await openFile(".\\inputs\\" + diff +".json");
  const m = JSON.parse(r);
  return m.reduce((group:any,item:any)=>{
    if(!group) group = {};
    const d = item.difficulty === "3" ? "[H]" : item.difficulty === "4" ? "[A]" : "[L]";
    group[item.title.replace(songRegExp," ") + d] = Number(item.wr);
    return group;
  },{});
}

const rs = async ()=>{
  await init();
  const files = fs.readdirSync(outputDir);
  const wrs = await readWR();
  let res:{[key:string]:{wr:number,avg:number,len:number,sum:number}} = {};
  for(let i =0; i < files.length; ++i){
    const f = files[i];
    let songName = f.replace(".json","");
    const fullPath = outputDir + f;
    const r = await openFile(fullPath);
    const wr = wrs[songName];
    if(!wr){
      console.log(songName + ": WR Not found");
    }
    const m = JSON.parse(r);
    const sum = m.reduce((sum:number,item:number)=>sum += Number(item),0);
    if(diff === "12"){
      if(songName === "snow storm[A]") songName = "snow storm[L]"; //誤記修正
      if(songName === "Secrets[A]") songName = "Secrets[L]";
      if(songName === "仮想空間の旅人たち[A]") songName = "仮想空間の旅人たち[L]";
    }
    res[songName] = {wr:wr || 0,avg:Math.floor(sum / m.length),len:m.length,sum:sum};
  }
  await write(".\\release\\" + "release.json",JSON.stringify(res));
  console.log(files);

}

rs();
