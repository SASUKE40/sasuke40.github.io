(window.webpackJsonp=window.webpackJsonp||[]).push([[2],{"/j2g":function(t,n,r){"use strict";r("f3/d"),r("a1Th"),r("HEwt"),r("rE2o"),r("ioFf"),r("rGqo"),r("yt8O"),r("Btvt"),r("XfO3"),r("T39b");var e=r("wTIg"),o=r("q1tI"),a=r.n(o),i=r("qKvR"),u=r("Wbzz"),c=r("TJpk"),l=r("sjHn"),p=r("1AOi");function s(){var t=b(["\n    justify-content: flex-start;\n    "," { display: none; }\n  "]);return s=function(){return t},t}function f(){var t=b(["\n    .Paginator__pageLink, "," { display: none; }\n    left: -15px;\n  "]);return f=function(){return t},t}function d(){var t=b(["\n    display: block;\n    width: auto;\n    height: auto;\n    padding: 2rem;\n\n    &:first-of-type {\n      padding-left: 0;\n    }\n\n    &:last-child {\n      padding-right: 0;\n    }\n  "]);return d=function(){return t},t}function b(t,n){return n||(n=t.slice(0)),t.raw=n,t}function g(t){return function(t){if(Array.isArray(t))return h(t)}(t)||function(t){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(t))return Array.from(t)}(t)||function(t,n){if(!t)return;if("string"==typeof t)return h(t,n);var r=Object.prototype.toString.call(t).slice(8,-1);"Object"===r&&t.constructor&&(r=t.constructor.name);if("Map"===r||"Set"===r)return Array.from(t);if("Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))return h(t,n)}(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function h(t,n){(null==n||n>t.length)&&(n=t.length);for(var r=0,e=new Array(n);r<n;r++)e[r]=t[r];return e}function m(t,n){for(var r=0;r<n.length;r++){var e=n[r];e.enumerable=e.enumerable||!1,e.configurable=!0,"value"in e&&(e.writable=!0),Object.defineProperty(t,e.key,e)}}var x=function(t){var n,r,e,o,u;function l(){for(var n,r=arguments.length,e=new Array(r),o=0;o<r;o++)e[o]=arguments[o];return(n=t.call.apply(t,[this].concat(e))||this).maxPages=3,n.count=n.props.pageCount,n.current=n.props.index,n.pageRoot=n.props.pathPrefix,n.getFullPath=function(t){return"/"===n.pageRoot?1===t?n.pageRoot:n.pageRoot+"page/"+t:1===t?n.pageRoot:n.pageRoot+"/page/"+t},n}return r=t,(n=l).prototype=Object.create(r.prototype),n.prototype.constructor=n,n.__proto__=r,l.prototype.render=function(){var t=this.count,n=this.current;if(t<=1)return null;var r=this.previousPath,e=this.nextPath,o=this.current<this.count,u=this.current>1;return Object(i.d)(a.a.Fragment,null,Object(i.d)(c.Helmet,null,u&&Object(i.d)("link",{rel:"prev",href:r}),o&&Object(i.d)("link",{rel:"next",href:e})),Object(i.d)(k,null,u&&Object(i.d)(y,{to:r},"Prev"),this.getPageLinks,Object(i.d)(O,{"aria-hidden":"true"},Object(i.d)("em",null,n)," of ",t),o&&Object(i.d)(y,{to:e},"Next")))},e=l,(o=[{key:"nextPath",get:function(){return this.getFullPath(this.current+1)}},{key:"previousPath",get:function(){return this.getFullPath(this.current-1)}},{key:"getPageLinks",get:function(){var t=this,n=this.current,r=this.count,e=this.maxPages,o=1===n?n:n-1,a=Object(p.i)(o,r+1-o),u=a.slice(0,e);return a[0]>2&&u.unshift(null),a[0]>1&&u.unshift(1),a[0]+1===r&&a[0]-1>0&&u.splice(a.length-1-e,0,a[0]-1),a[0]+e<r&&u.push(null),a[0]+e-1<r&&u.push(r),g(new Set(u)).map((function(r,e){return null===r?Object(i.d)(j,{key:"PaginatorPage_spacer_"+e,"aria-hidden":!0}):Object(i.d)(w,{key:"PaginatorPage_"+r,to:t.getFullPath(r),style:{opacity:n===r?1:.3},className:"Paginator__pageLink"},r)}))}}])&&m(e.prototype,o),u&&m(e,u),l}(o.Component);n.a=x;var v=function(t){return Object(i.c)("line-height:1;color:",t.theme.colors.primary,";padding:0;width:6.8rem;height:6.8rem;display:flex;align-items:center;justify-content:center;font-variant-numeric:tabular-nums;",l.a.desktop_up(d()))},y=Object(e.a)(u.Link,{target:"e5lnzj40"})("font-weight:600;font-size:18px;text-decoration:none;color:",(function(t){return t.theme.colors.primary}),";",v," &:hover,&:focus{opacity:1;text-decoration:underline;}"),w=Object(e.a)(u.Link,{target:"e5lnzj41"})("font-weight:400;font-size:18px;text-decoration:none;color:",(function(t){return t.theme.colors.primary}),";",v," &:hover,&:focus{opacity:1;text-decoration:underline;}"),j=Object(e.a)("span",{target:"e5lnzj42"})("opacity:0.3;",v,' &::before{content:"...";}'),O=Object(e.a)("span",{target:"e5lnzj43"})("font-weight:400;",v," color:",(function(t){return t.theme.colors.primary}),";em{font-style:normal;color:",(function(t){return t.theme.colors.primary}),";}"),k=Object(e.a)("nav",{target:"e5lnzj44"})("position:relative;z-index:1;display:inline-flex;justify-content:space-between;align-items:center;",l.a.tablet(f(),j)," ",l.a.desktop_up(s(),O))},"6Ras":function(t,n,r){"use strict";r("rGqo"),r("yt8O"),r("Btvt"),r("RW0V");var e=r("wTIg"),o=r("q1tI"),a=r("qKvR"),i=r("Wbzz"),u=r("gZs9"),c=r("joFz"),l=r("sjHn"),p=r("ZtNh");function s(){var t=_(["\n    &:hover "," {\n      transform: none;\n      box-shadow: initial;\n    }\n\n    &:active {\n      transform: scale(0.97) translateY(3px);\n    }\n  "]);return s=function(){return t},t}function f(){var t=_(["\n    max-width: 100%;\n    padding:  0 20px 30px;\n  "]);return f=function(){return t},t}function d(){var t=_(["\n    max-width: 100%;\n    padding:  0 20px;\n    margin-bottom: 20px;\n    -webkit-line-clamp: 3;\n  "]);return d=function(){return t},t}function b(){var t=_(["\n    margin-bottom; 15px;\n  "]);return b=function(){return t},t}function g(){var t=_(["\n    display: -webkit-box;\n  "]);return g=function(){return t},t}function h(){var t=_(["\n    font-size: 22px;  \n    padding: 30px 20px 0;\n    margin-bottom: 10px;\n    -webkit-line-clamp: 3;\n  "]);return h=function(){return t},t}function m(){var t=_(["\n    font-size: 24px;  \n  "]);return m=function(){return t},t}function x(){var t=_(["\n    margin-bottom: 15px;\n  "]);return x=function(){return t},t}function v(){var t=_(["\n    overflow: hidden;\n    margin-bottom: 0;\n    box-shadow: none;\n    border-top-right-radius: 5px;\n    border-top-left-radius: 5px;\n  "]);return v=function(){return t},t}function y(){var t=_(["\n    height: 200px;\n    margin-bottom: 35px;\n  "]);return y=function(){return t},t}function w(){var t=_(["\n    margin-bottom: 40px;\n    box-shadow: 0px 20px 40px rgba(0, 0, 0, 0.2);\n    border-bottom-right-radius: 5px;\n    border-bottom-left-radius: 5px;\n  "]);return w=function(){return t},t}function j(){var t=_(["\n    margin-bottom: 60px;\n  "]);return j=function(){return t},t}function O(){var t=_(["\n    box-shadow: 0px 20px 40px rgba(0, 0, 0, 0.2);\n    border-bottom-right-radius: 5px;\n    border-bottom-left-radius: 5px;\n  "]);return O=function(){return t},t}function k(){var t=_(["\n    grid-template-columns: 1fr;\n  "]);return k=function(){return t},t}function L(){var t=_(["\n    grid-column-gap: 24px;\n    grid-template-columns: 1fr 380px;\n  "]);return L=function(){return t},t}function P(){var t=_(["\n    grid-template-columns: 1fr;\n    \n    &:not(:last-child) {\n      margin-bottom: 0;\n    }\n  "]);return P=function(){return t},t}function z(){var t=_(["\n    grid-template-columns: 1fr 1fr;\n  "]);return z=function(){return t},t}function A(){var t=_(["\n    -webkit-line-clamp: 3;\n  "]);return A=function(){return t},t}function _(t,n){return n||(n=t.slice(0)),t.raw=n,t}n.a=function(t){var n=t.articles,r=t.alwaysShowAllDetails;if(!n)return null;var e=1===n.length,i=Object(o.useContext)(p.a),u=i.gridLayout,c=void 0===u?"tiles":u,l=i.hasSetGridLayout,s=i.getGridLayout,f=n.reduce((function(t,n,r,e){return r%2==0&&t.push(e.slice(r,r+2)),t}),[]);return Object(o.useEffect)((function(){return s()}),[]),Object(a.d)(F,{style:{opacity:l?1:0},alwaysShowAllDetails:r},f.map((function(t,n){var r=n%2!=0,o=n%2!=1;return Object(a.d)(G,{key:n,gridLayout:c,hasOnlyOneArticle:e,reverse:r},Object(a.d)(R,{article:t[0],narrow:r}),Object(a.d)(R,{article:t[1],narrow:o}))})))};var R=function(t){var n=t.article,r=t.narrow;if(!n)return null;var e=Object(o.useContext)(p.a).gridLayout,i=r&&n.title.length>35,u=r?n.hero.narrow:n.hero.regular,l=u&&0!==Object.keys(u).length&&u.constructor===Object;return Object(a.d)(B,{to:n.slug,"data-a11y":"false"},Object(a.d)(H,{gridLayout:e},Object(a.d)(D,{narrow:r,gridLayout:e},l?Object(a.d)(c.c,{src:u}):Object(a.d)(c.a,null)),Object(a.d)("div",null,Object(a.d)(J,{dark:!0,hasOverflow:i,gridLayout:e},n.title),Object(a.d)(N,{narrow:r,hasOverflow:i,gridLayout:e},n.excerpt),Object(a.d)(W,null,n.date," · ",n.timeToRead," min read"))))},q=Object(a.c)("text-overflow:ellipsis;overflow-wrap:normal;-webkit-line-clamp:2;-webkit-box-orient:vertical;display:-webkit-box;white-space:normal;overflow:hidden;",l.a.phablet(A())),S={name:"1fq9f5n",styles:"p{display:-webkit-box;}h2{margin-bottom:10px;}"},F=Object(e.a)("div",{target:"e14bbv6l0"})("transition:opacity 0.25s;",(function(t){return t.alwaysShowAllDetails&&S})),I=function(t){return Object(a.c)("position:relative;display:grid;grid-template-columns:",t.reverse?"457px 1fr":"1fr 457px",";grid-template-rows:2;column-gap:30px;&:not(:last-child){margin-bottom:75px;}",l.a.desktop_medium(z())," ",l.a.tablet(P()))},T=function(t){return Object(a.c)("display:grid;grid-template-rows:1fr;grid-template-columns:1fr 488px;grid-column-gap:96px;grid-template-rows:1;align-items:center;position:relative;margin-bottom:50px;",l.a.desktop(L())," ",l.a.tablet(k())," @media (max-width:540px){background:",t.theme.colors.card,";}",l.a.phablet(O()))},C=function(t){return Object(a.c)("position:relative;",l.a.tablet(j())," @media (max-width:540px){background:",t.theme.colors.card,";}",l.a.phablet(w()))},E=function(t){return Object(a.c)("display:grid;grid-template-rows:",t.hasOnlyOneArticle?"1fr":"1fr 1fr",";")},G=Object(e.a)("div",{target:"e14bbv6l1"})((function(t){return"tiles"===t.gridLayout?I:E})),H=Object(e.a)("div",{target:"e14bbv6l2"})((function(t){return"rows"===t.gridLayout?T:C})),D=Object(e.a)("div",{target:"e14bbv6l3"})("position:relative;height:",(function(t){return"tiles"===t.gridLayout?"280px":"220px"}),";box-shadow:0 30px 60px -10px rgba(0,0,0,",(function(t){return t.narrow?.22:.3}),"),0 18px 36px -18px rgba(0,0,0,",(function(t){return t.narrow?.25:.33}),");margin-bottom:",(function(t){return"tiles"===t.gridLayout?"30px":0}),";transition:transform 0.3s var(--ease-out-quad),box-shadow 0.3s var(--ease-out-quad);& > div{height:100%;}",l.a.tablet(y())," ",l.a.phablet(v())),J=Object(e.a)(u.a.h2,{target:"e14bbv6l4"})("font-size:21px;font-family:",(function(t){return t.theme.fonts.serif}),";margin-bottom:",(function(t){return t.hasOverflow&&"tiles"===t.gridLayout?"35px":"10px"}),";transition:color 0.3s ease-in-out;",q,";",l.a.desktop(x())," ",l.a.tablet(m())," ",l.a.phablet(h())),N=Object(e.a)("p",{target:"e14bbv6l5"})(q,";font-size:16px;margin-bottom:10px;color:",(function(t){return t.theme.colors.grey}),";display:",(function(t){return t.hasOverflow&&"tiles"===t.gridLayout?"none":"box"}),";max-width:",(function(t){return t.narrow?"415px":"515px"}),";",l.a.desktop(g())," ",l.a.phablet(b())," ",l.a.phablet(d())),W=Object(e.a)("div",{target:"e14bbv6l6"})("font-weight:600;font-size:16px;color:",(function(t){return t.theme.colors.grey}),";opacity:0.33;",l.a.phablet(f())),B=Object(e.a)(i.Link,{target:"e14bbv6l7"})("position:relative;display:block;width:100%;height:100%;top:0;left:0;border-radius:5px;z-index:1;transition:transform 0.33s var(--ease-out-quart);-webkit-tap-highlight-color:rgba(255,255,255,0);&:hover ",D,",&:focus ",D,"{transform:translateY(-1px);box-shadow:0 50px 80px -20px rgba(0,0,0,0.27),0 30px 50px -30px rgba(0,0,0,0.3);}&:hover h2,&:focus h2{color:",(function(t){return t.theme.colors.accent}),";}&[data-a11y='true']:focus::after{content:'';position:absolute;left:-1.5%;top:-2%;width:103%;height:104%;border:3px solid ",(function(t){return t.theme.colors.accent}),";background:rgba(255,255,255,0.01);border-radius:5px;}",l.a.phablet(s(),D))}}]);
//# sourceMappingURL=5adfd937054d18aa90c3653907d1d43da6549296-9e0c8aa601bb949119d6.js.map