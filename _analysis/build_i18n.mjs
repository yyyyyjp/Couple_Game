// 从 messages JSON 构建 assets/js/i18n.js
import fs from "node:fs";

const [,, srcPath, outPath] = process.argv;
const messages = JSON.parse(fs.readFileSync(srcPath, "utf8"));

const FUNC = `
;(function(){
  function getMsg(path){
    if(path==null) return undefined;
    return path.split(".").reduce(function(o,k){ return (o==null)?o:o[k]; }, window.MESSAGES);
  }
  function fmt(str, params){
    if(typeof str!=="string"||!params) return str;
    return str.replace(/\\{(\\w+)\\}/g,function(m,k){ return (params[k]!==undefined&&params[k]!==null)?params[k]:m; });
  }
  function t(key,params){
    var v=getMsg(key);
    if(v==null) return key;
    if(Array.isArray(v)) return v;
    return fmt(v,params);
  }
  function scoped(ns){
    return function(key,params){ return t(ns?(ns+".")+key:key,params); };
  }
  window.getMsg=getMsg; window.t=t; window.scoped=scoped; window.fmt=fmt;
})();
`;

const body = "window.MESSAGES = " + JSON.stringify(messages, null, 2) + "\n" + FUNC;
fs.writeFileSync(outPath, body);
console.log("wrote", outPath, body.length, "bytes;", Object.keys(messages).length, "top keys");
