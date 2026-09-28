;(function(){
  function getMsg(path){
    if(path==null) return undefined;
    return path.split(".").reduce(function(o,k){ return (o==null)?o:o[k]; }, window.MESSAGES);
  }
  function fmt(str, params){
    if(typeof str!=="string"||!params) return str;
    return str.replace(/\{(\w+)\}/g,function(m,k){ return (params[k]!==undefined&&params[k]!==null)?params[k]:m; });
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
