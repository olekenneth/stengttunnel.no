(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[405],{5301:function(a,b,c){(window.__NEXT_P=window.__NEXT_P||[]).push(["/",function(){return c(9578)}])},9578:function(a,b,c){"use strict";c.r(b),c.d(b,{"default":function(){return C}});var d,e,f=c(5893),g=c(9008),h=c(7294),i=c(4623),j=c(3272),k=c(542),l=c(2256),m=c(5967),n=function(a){var b=(0,h.useState)([]),c=b[0],d=b[1];return(0,h.useEffect)(function(){d(a.roads.map(function(a){return{key:a.urlFriendly,value:a.urlFriendly,text:a.roadName,content:(0,f.jsx)(f.Fragment,{children:a.roadName})}}))},[a.roads]),(0,f.jsx)(f.Fragment,{children:(0,f.jsx)(l.Z,{fluid:!0,children:(0,f.jsx)(m.Z,{placeholder:"Velg tunnel(er)",onChange:function(b,c){a.setFavorites(c.value),setTimeout(function(){"activeElement"in document&&document.activeElement.blur()},100)},fluid:!0,search:!0,selection:!0,multiple:!0,closeOnChange:!0,value:a.favorites,disabled:!c.length,loading:!c.length,options:c})})})},o=c(345),p=c(967),q=c(5666),r=c.n(q);(e=d||(d={})).UserReported="Brukerskapt melding",e.StatensVegvesen="Statens Vegvesen";var s=c(3819),t=c(6702),u=c(4854),v=c(6743);function w(a,b,c,d,e,f,g){try{var h=a[f](g),i=h.value}catch(j){c(j);return}h.done?b(i):Promise.resolve(i).then(d,e)}function x(a,b,c){return b in a?Object.defineProperty(a,b,{value:c,enumerable:!0,configurable:!0,writable:!0}):a[b]=c,a}var y=function(a){var b=(0,h.useState)(),c=b[0],e=b[1],g=(0,h.useState)(!1),i=g[0],j=g[1],m=(0,h.useState)(!0),n=m[0],o=m[1],q=a.road.roadName;if((0,h.useMemo)(function(){document.addEventListener("visibilitychange",function(){"visible"===document.visibilityState?j(!0):j(!1)})},[]),(0,h.useEffect)(function(){k.ZP.pageview("/"+a.road.urlFriendly),o(!0),fetch(a.road.url).then(function(a){return a.json()}).then(function(b){return(function(a){for(var b=1;b<arguments.length;b++){var c=null!=arguments[b]?arguments[b]:{},d=Object.keys(c);"function"==typeof Object.getOwnPropertySymbols&&(d=d.concat(Object.getOwnPropertySymbols(c).filter(function(a){return Object.getOwnPropertyDescriptor(c,a).enumerable}))),d.forEach(function(b){x(a,b,c[b])})}return a})({},b,a.road)}).then(e).then(function(){return o(!1)})},[a.road,i]),n)return(0,f.jsxs)(l.Z,{fluid:!0,children:[(0,f.jsxs)(l.Z.Content,{children:[(0,f.jsx)(s.Z.Header,{as:"h2",children:q}),(0,f.jsx)(t.Z,{children:(0,f.jsxs)(t.Z.Header,{image:!0,children:[(0,f.jsx)(t.Z.Line,{length:"full"}),(0,f.jsx)(t.Z.Line,{length:"medium"}),(0,f.jsx)(t.Z.Line,{}),(0,f.jsx)(t.Z.Line,{length:"medium"})]})})]}),(0,f.jsx)(l.Z.Content,{extra:!0,children:(0,f.jsx)(t.Z,{children:(0,f.jsxs)(t.Z.Paragraph,{children:[(0,f.jsx)(t.Z.Line,{length:"full"}),(0,f.jsx)(t.Z.Line,{}),(0,f.jsx)(t.Z.Line,{}),(0,f.jsx)(t.Z.Line,{length:"full"})]})})})]});var y=c.status,z=c.messages,A=c.statusMessage,B="/status/".concat(y,".png"),C=z.map(function(a,b){var c=new Intl.DateTimeFormat(["nb-no","da","sv","en-us","en-gb"],{weekday:"short",month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"}),e="".concat(c.format(new Date(a.validFrom))," - ").concat(c.format(new Date(a.validTo)));return(0,f.jsxs)(u.Z.Event,{children:[(0,f.jsx)(v.Z,{trigger:a.source===d.StatensVegvesen?(0,f.jsx)(u.Z.Label,{image:"/vv_logo.png"}):(0,f.jsx)(u.Z.Label,{icon:"user outline"}),content:a.source,inverted:!0}),(0,f.jsxs)(u.Z.Content,{children:[(0,f.jsx)(u.Z.Date,{content:e}),(0,f.jsx)(u.Z.Summary,{children:a.message})]})]},"message-"+b)}),D=function(a){return function(){var b=this,c=arguments;return new Promise(function(d,e){var f=a.apply(b,c);function g(a){w(f,d,e,g,h,"next",a)}function h(a){w(f,d,e,g,h,"throw",a)}g(void 0)})}}(r().mark(function b(){var c,d,e;return r().wrap(function(b){for(;;)switch(b.prev=b.next){case 0:if(c=window.navigator,d=new URL(window.location.href),e="".concat(d.protocol,"//").concat(d.host,"/").concat(a.road.urlFriendly),!c.clipboard){b.next=6;break}return b.next=6,window.navigator.clipboard.writeText(e);case 6:if(!c.share){b.next=9;break}return b.next=9,window.navigator.share({title:"Stengt tunnel",text:A+"\nSe mer p\xe5 ",url:e});case 9:case"end":return b.stop()}},b)}));return(0,f.jsxs)(l.Z,{fluid:!0,role:"road",children:[(0,f.jsx)(l.Z.Content,{children:(0,f.jsxs)(s.Z.Group,{children:[(0,f.jsx)(v.Z,{on:["click"],trigger:(0,f.jsx)(p.Z,{onClick:D,style:{position:"absolute",right:"10px"},icon:"external share",circular:!0,basic:!0}),content:"Kopiert linken",inverted:!0}),(0,f.jsxs)(s.Z,{floated:"left",style:{margin:0},children:[(0,f.jsx)(s.Z.Image,{style:{width:"auto"},size:"tiny",src:B}),(0,f.jsx)(s.Z.Content,{verticalAlign:"middle",children:(0,f.jsx)(s.Z.Header,{role:"status",as:"h2",children:A})})]})]})}),(0,f.jsx)(l.Z.Content,{extra:!0,children:(0,f.jsx)(u.Z,{children:C})})]})},z=c(4155),A=(0,h.forwardRef)(function(a,b){var c=a.road;return(0,f.jsxs)("div",{ref:b,children:[(0,f.jsx)(y,{road:c}),(0,f.jsx)(o.Z,{}),"true"!==z.env.REACT_APP_DISABLE_ADS&&(0,f.jsxs)(f.Fragment,{children:[(0,f.jsx)(function(){return(0,h.useEffect)(function(){(window.adsbygoogle=window.adsbygoogle||[]).push({google_ad_client:"ca-pub-8133897183984535"})},[]),(0,f.jsx)("ins",{className:"adsbygoogle",style:{display:"block"},"data-ad-client":"ca-pub-8133897183984535","data-ad-slot":"5404963764","data-ad-format":"auto","data-full-width-responsive":"true","data-adtest":"off"})},{}),(0,f.jsx)(o.Z,{})]})]},"container-".concat(c.urlFriendly))});A.displayName="RoadAndAd";var B=function(a){var b=(0,h.useState)(!1),c=b[0],d=b[1],e=[];(0,h.useEffect)(function(){d(window.innerWidth<600||window.innerHeight<900)},[]);var g,i=((function(a){if(Array.isArray(a)){for(var b=0,c=new Array(a.length);b<a.length;b++)c[b]=a[b];return c}})(g=a.favorites)||(function(a){if(Symbol.iterator in Object(a)||"[object Arguments]"===Object.prototype.toString.call(a))return Array.from(a)})(g)||(function(){throw new TypeError("Invalid attempt to spread non-iterable instance")})()).reverse().map(function(b){return a.roads.find(function(a){return a.urlFriendly===b})}).filter(Boolean).map(function(a,b){var c=a,d=(0,h.createRef)();return e.push({active:0===b,ref:d,road:c,key:c.urlFriendly}),(0,f.jsx)(A,{ref:d,road:c},c.urlFriendly)}),j=function(a){var b,c=a.target.closest("button"),d=e.findIndex(function(a){return!0===a.active});e[d].active=!1;var f=++d%e.length,g=e[f];g.active=!0,e[f]=g,null===(b=g.ref.current)|| void 0===b||b.scrollIntoView({behavior:"smooth"}),f===e.length-1?c.style.transform="rotate(-180deg)":c.style.transform="rotate(0)"};return(0,f.jsxs)(f.Fragment,{children:[i,c&&(0,f.jsx)(p.Z,{size:"massive",color:"red",circular:!0,active:!1,icon:"arrow down",onClick:function(a){return j(a)},style:{zIndex:10e3,position:"fixed",bottom:"25px",left:"50%",marginLeft:"-31px"}})]})},C=function(){var a=(0,h.useState)([]),b=a[0],c=a[1],d=(0,h.useState)([]),e=d[0],l=d[1];return(0,h.useEffect)(function(){var a=!0;return k.ZP.initialize("UA-8420880-19",{testMode:!1,debug:!1}),k.ZP.pageview("/"),fetch("https://api.stengttunnel.no/roads.json").then(function(a){return a.json()}).then(function(b){a&&c(b)}),function(){a=!1}},[]),(0,h.useEffect)(function(){Promise.resolve(localStorage.getItem("favorites")||"[]").then(function(a){return JSON.parse(a)}).then(l).catch(function(){return l([])})},[b]),(0,h.useEffect)(function(){localStorage.setItem("favorites",JSON.stringify(e))},[e]),(0,f.jsxs)(f.Fragment,{children:[(0,f.jsx)(g.default,{children:(0,f.jsx)("title",{children:"Stengt tunnel"})}),(0,f.jsx)(i.Z,{inverted:!0,children:(0,f.jsxs)(j.Z,{inverted:!0,secondary:!0,style:{margin:"0 auto",maxWidth:"640px"},children:[(0,f.jsx)(j.Z.Item,{children:(0,f.jsx)("img",{alt:"Stengt tunnel logo",src:"/images/stengttunnel-logo.png"})}),(0,f.jsx)(j.Z.Item,{header:!0,children:"Stengt tunnel"})]})}),(0,f.jsxs)("div",{style:{margin:"15px auto",maxWidth:"640px"},children:[(0,f.jsx)(n,{roads:b,favorites:e,setFavorites:l}),(0,f.jsx)(B,{favorites:e,roads:b})]})]})}}},function(a){a.O(0,[774,374,888,179],function(){return a(a.s=5301)}),_N_E=a.O()}])