(this.webpackJsonpstengttunnel=this.webpackJsonpstengttunnel||[]).push([[0],{119:function(e,t,n){},150:function(e,t,n){},159:function(e,t,n){"use strict";n.r(t);var a,r=n(0),c=n.n(r),i=n(47),s=n.n(i),o=(n(149),n(150),n(25)),l=n(182),u=n(174),d=n(179),j=n(79),b=(n(119),n(177)),f=n(173),O=n(4),h=function(e){var t=Object(r.useState)([]),n=Object(o.a)(t,2),a=n[0],c=n[1];Object(r.useEffect)((function(){c(e.roads.map((function(e){return{key:e.urlFriendly,value:e.urlFriendly,text:e.roadName,content:Object(O.jsx)(O.Fragment,{children:e.roadName})}})))}),[e.roads]);return Object(O.jsx)(O.Fragment,{children:Object(O.jsx)(b.a,{fluid:!0,children:Object(O.jsx)(f.a,{placeholder:"Velg tunnel(er)",onChange:function(t,n){e.setFavorites(n.value),setTimeout((function(){"activeElement"in document&&document.activeElement.blur()}),100)},fluid:!0,search:!0,selection:!0,multiple:!0,closeOnChange:!0,value:e.favorites,disabled:!Boolean(a.length),loading:!Boolean(a.length),options:a})})})},g=n(131),x=n(171),v=n(180),m=n(117),p=n.n(m),w=n(128),S=n(118);!function(e){e.UserReported="Brukerskapt melding",e.StatensVegvesen="Statens Vegvesen"}(a||(a={}));var y=n(176),F=n(178),E=n(175),k=n(172),L=function(e){var t=Object(r.useState)(),n=Object(o.a)(t,2),c=n[0],i=n[1],s=Object(r.useState)(!1),l=Object(o.a)(s,2),u=l[0],d=l[1],f=Object(r.useState)(!0),h=Object(o.a)(f,2),g=h[0],x=h[1],m=e.road.roadName;if(Object(r.useMemo)((function(){document.addEventListener("visibilitychange",(function(){"visible"===document.visibilityState?d(!0):d(!1)}))}),[]),Object(r.useEffect)((function(){j.a.pageview("/"+e.road.urlFriendly),x(!0),fetch(e.road.url).then((function(e){return e.json()})).then((function(t){return Object(S.a)(Object(S.a)({},t),e.road)})).then(i).then((function(){return x(!1)}))}),[e.road,u]),g)return Object(O.jsxs)(b.a,{fluid:!0,children:[Object(O.jsxs)(b.a.Content,{children:[Object(O.jsx)(y.a.Header,{as:"h2",children:m}),Object(O.jsx)(F.a,{children:Object(O.jsxs)(F.a.Header,{image:!0,children:[Object(O.jsx)(F.a.Line,{length:"full"}),Object(O.jsx)(F.a.Line,{length:"medium"}),Object(O.jsx)(F.a.Line,{}),Object(O.jsx)(F.a.Line,{length:"medium"})]})})]}),Object(O.jsx)(b.a.Content,{extra:!0,children:Object(O.jsx)(F.a,{children:Object(O.jsxs)(F.a.Paragraph,{children:[Object(O.jsx)(F.a.Line,{length:"full"}),Object(O.jsx)(F.a.Line,{}),Object(O.jsx)(F.a.Line,{}),Object(O.jsx)(F.a.Line,{length:"full"})]})})})]});var L=c,C=L.status,_=L.messages,I=L.statusMessage,T="https://stengttunnel.no/status/".concat(C,".png"),D=_.map((function(e,t){var n=new Intl.DateTimeFormat(["nb-no","da","sv","en-us","en-gb"],{weekday:"short",month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"}),r="".concat(n.format(new Date(e.validFrom))," - ").concat(n.format(new Date(e.validTo)));return Object(O.jsxs)(E.a.Event,{children:[Object(O.jsx)(k.a,{on:"click",trigger:e.source===a.StatensVegvesen?Object(O.jsx)(E.a.Label,{image:"/vv_logo.png"}):Object(O.jsx)(E.a.Label,{icon:"user outline"}),content:e.source,inverted:!0}),Object(O.jsxs)(E.a.Content,{children:[Object(O.jsx)(E.a.Date,{content:r}),Object(O.jsx)(E.a.Summary,{children:e.message})]})]},"message-"+t)})),R=function(){var t=Object(w.a)(p.a.mark((function t(){var n,a,r;return p.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(n=window.navigator,a=new URL(window.location.href),r="".concat(a.protocol,"//").concat(a.host,"/").concat(e.road.urlFriendly),!n.clipboard){t.next=6;break}return t.next=6,window.navigator.clipboard.writeText(r);case 6:if(!n.share){t.next=9;break}return t.next=9,window.navigator.share({title:"Stengt tunnel",text:I+"\nSe mer p\xe5 ",url:r});case 9:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}();return Object(O.jsxs)(b.a,{fluid:!0,role:"road",children:[Object(O.jsx)(b.a.Content,{children:Object(O.jsxs)(y.a.Group,{children:[Object(O.jsx)(k.a,{on:["click"],trigger:Object(O.jsx)(v.a,{onClick:R,style:{position:"absolute",right:"10px"},icon:"external share",circular:!0,basic:!0}),content:"Kopiert linken",inverted:!0}),Object(O.jsxs)(y.a,{floated:"left",style:{margin:0},children:[Object(O.jsx)(y.a.Image,{style:{width:"auto"},size:"tiny",src:T}),Object(O.jsx)(y.a.Content,{verticalAlign:"middle",children:Object(O.jsx)(y.a.Header,{role:"status",as:"h2",children:I})})]})]})}),Object(O.jsx)(b.a.Content,{extra:!0,children:Object(O.jsx)(E.a,{children:D})})]})},C=function(e){return Object(r.useEffect)((function(){(window.adsbygoogle=window.adsbygoogle||[]).push({google_ad_client:"ca-pub-8133897183984535"})}),[]),Object(O.jsx)("ins",{className:"adsbygoogle",style:{display:"block"},"data-ad-client":"ca-pub-8133897183984535","data-ad-slot":"5404963764","data-ad-format":"auto","data-full-width-responsive":"true","data-adtest":"off"})},_=c.a.forwardRef((function(e,t){var n=e.road;return Object(O.jsxs)("div",{ref:t,children:[Object(O.jsx)(L,{road:n}),Object(O.jsx)(x.a,{}),"true"!==Object({NODE_ENV:"production",PUBLIC_URL:"",WDS_SOCKET_HOST:void 0,WDS_SOCKET_PATH:void 0,WDS_SOCKET_PORT:void 0,FAST_REFRESH:!0}).REACT_APP_DISABLE_ADS&&Object(O.jsxs)(O.Fragment,{children:[Object(O.jsx)(C,{}),Object(O.jsx)(x.a,{})]})]},"container-".concat(n.urlFriendly))})),I=function(e){var t=Object(r.useState)(!1),n=Object(o.a)(t,2),a=n[0],i=n[1],s=[];Object(r.useEffect)((function(){i(window.innerWidth<600||window.innerHeight<900)}),[]);var l=Object(g.a)(e.favorites).reverse().map((function(t){return e.roads.find((function(e){return e.urlFriendly===t}))})).filter(Boolean).map((function(e,t){var n=e,a=c.a.createRef();return s.push({active:0===t,ref:a,road:n,key:n.urlFriendly}),Object(O.jsx)(_,{ref:a,road:n},n.urlFriendly)}));return Object(O.jsxs)(O.Fragment,{children:[l,a&&Object(O.jsx)(v.a,{size:"massive",color:"red",circular:!0,active:!1,icon:"arrow down",onClick:function(e,t){return function(e,t){var n,a=e.target.closest("button"),r=s.findIndex((function(e){return!0===e.active}));s[r].active=!1;var c=++r%s.length,i=s[c];i.active=!0,s[c]=i,null===(n=i.ref.current)||void 0===n||n.scrollIntoView({behavior:"smooth"}),c===s.length-1?a.style.transform="rotate(-180deg)":a.style.transform="rotate(0)"}(e)},style:{zIndex:1e4,position:"fixed",bottom:"25px",left:"50%",marginLeft:"-31px"}})]})},T=function(){var e=Object(r.useState)([]),t=Object(o.a)(e,2),n=t[0],a=t[1],c=Object(r.useState)([]),i=Object(o.a)(c,2),s=i[0],b=i[1],f=Object(r.useState)(null),g=Object(o.a)(f,2),x=g[0],v=g[1];return Object(r.useEffect)((function(){var e=!0;return j.a.initialize("UA-8420880-19",{testMode:!1,debug:!1}),j.a.pageview("/"),fetch("https://api.stengttunnel.no/roads.json").then((function(e){return e.json()})).then((function(t){e&&a(t)})),function(){e=!1}}),[]),Object(r.useEffect)((function(){var e=window.location.pathname.split("/"),t=Object(o.a)(e,2)[1];Promise.resolve(localStorage.getItem("favorites")||"[]").then((function(e){return JSON.parse(e)})).then((function(e){return t&&n.find((function(e){return e.urlFriendly===t}))?(-1===e.indexOf(t)&&e.push(t),window.history.replaceState(null,"Stengt tunnel","/")):t&&n.length>0&&v("Finner ikke tunnelen eller veien '"+t+"'"),e})).then(b).catch((function(){return b([])}))}),[n]),Object(r.useEffect)((function(){localStorage.setItem("favorites",JSON.stringify(s))}),[s]),Object(O.jsxs)(O.Fragment,{children:[Object(O.jsx)(l.a,{inverted:!0,children:Object(O.jsxs)(u.a,{inverted:!0,secondary:!0,style:{margin:"0 auto",maxWidth:"640px"},children:[Object(O.jsx)(u.a.Item,{children:Object(O.jsx)("img",{alt:"Stengt tunnel logo",src:"/images/stengttunnel-logo.png"})}),Object(O.jsx)(u.a.Item,{header:!0,children:"Stengt tunnel"})]})}),Object(O.jsxs)("div",{style:{margin:"15px auto",maxWidth:"640px"},children:[x&&Object(O.jsxs)(d.a,{negative:!0,onDismiss:function(){v(null),window.history.replaceState(null,"Stengt tunnel","/")},children:[Object(O.jsx)(d.a.Header,{children:"404 Finner ikke siden"}),Object(O.jsx)("p",{children:x})]}),Object(O.jsx)(h,{roads:n,favorites:s,setFavorites:b}),Object(O.jsx)(I,{favorites:s,roads:n})]})]})};s.a.render(Object(O.jsx)(c.a.StrictMode,{children:Object(O.jsx)(T,{})}),document.getElementById("root"))}},[[159,1,2]]]);
//# sourceMappingURL=main.b97c84d1.chunk.js.map