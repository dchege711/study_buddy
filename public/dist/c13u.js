!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define("c13u",[],t):"object"==typeof exports?exports.c13u=t():e.c13u=t()}(window,function(){return function(e){function t(t){for(var r,d,c=t[0],a=t[1],l=t[2],s=0,p=[];s<c.length;s++)d=c[s],i[d]&&p.push(i[d][0]),i[d]=0;for(r in a)Object.prototype.hasOwnProperty.call(a,r)&&(e[r]=a[r]);for(u&&u(t);p.length;)p.shift()();return o.push.apply(o,l||[]),n()}function n(){for(var e,t=0;t<o.length;t++){for(var n=o[t],r=!0,c=1;c<n.length;c++){var a=n[c];0!==i[a]&&(r=!1)}r&&(o.splice(t--,1),e=d(d.s=n[0]))}return e}var r={},i={0:0},o=[];function d(t){if(r[t])return r[t].exports;var n=r[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,d),n.l=!0,n.exports}d.m=e,d.c=r,d.d=function(e,t,n){d.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},d.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},d.t=function(e,t){if(1&t&&(e=d(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(d.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)d.d(n,r,function(t){return e[t]}.bind(null,r));return n},d.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return d.d(t,"a",t),t},d.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},d.p="";var c=window.webpackJsonpc13u=window.webpackJsonpc13u||[],a=c.push.bind(c);c.push=t,c=c.slice();for(var l=0;l<c.length;l++)t(c[l]);var u=a;return o.push([0,1]),n()}([function(e,t,n){"use strict";const r=n(1),i=n(2),o=n(3);let d=new r.Converter({headerLevelStart:4,literalMidWordUnderscores:!0,literalMidWordAsterisks:!0,simpleLineBreaks:!0,emoji:!0,backslashEscapesHTMLTags:!0,tables:!0,parseImgDimensions:!0,simplifiedAutoLink:!0,strikethrough:!0,tasklists:!0});function c(e,t){let n=document.getElementById("card_popup_element");n.innerHTML=e,n.style.visibility="visible",window.setTimeout(()=>{!function(e){document.getElementById(e).style.visibility="hidden"}("card_popup_element")},t)}e.exports=function(e,t){this.state=e,this.cardsManager=t,this.userMetadata=userMetadata,this.initializeCards=function(e){this.cardsManager.initialize(e,()=>{this.cardsManager.next(e=>{this.renderCard(e)})})},this.fetchNextCard=function(){this.cardsManager.next(e=>{void 0!==e.title?this.renderCard(e):c("Out of cards!",1500)})},this.fetchPreviousCard=function(){this.cardsManager.previous(e=>{void 0!==e.title?this.renderCard(e):c("Out of cards!",1500)})},this.displayNewCard=function(){return new Promise(function(e){document.getElementById("card_title").value="",document.getElementById("card_description").innerHTML="",document.getElementById("already_set_card_tags").innerHTML="",document.getElementById("card_is_public_toggle").checked=this.metadata.cardsAreByDefaultPrivate,document.getElementById("card_urgency").value=0,document.getElementById("card_urgency_number").innerText="0",e()})},this.renderCard=function(e){return new Promise(function(t){if(!e.title&&!e.description)return void displayNewCard();document.getElementById("card_title").value=e.title;let n=d.makeHtml(String.raw`${e.description.replace(/\\/g,"\\\\")}`);n.match(/\[spoiler\]/i)&&(n=n.replace(/\[spoiler\]/i,"<span id='spoiler'>[spoiler]</span>"),n+='<span id="spoiler_end"></span>'),document.getElementById("card_description").innerHTML=n;let r="",c=e.tags.trim().split(" ");for(let e=0;e<c.length;e++)c[e].length>0&&(r+=`<button id="card_tag_text_${c[e]}" class="card_tag_button_text">${c[e]}</button><button id="card_tag_remove_${c[e]}" class="card_tag_button_remove" onclick="removeTagFromCard('${c[e]}')"> <i class="fa fa-times fa-fw" aria-hidden="true"></i> </button>`);document.getElementById("already_set_card_tags").innerHTML=r,document.getElementById("card_urgency").value=e.urgency,document.getElementById("card_urgency_number").innerText=e.urgency,document.getElementById("card_description").removeAttribute("contenteditable"),document.getElementById("card_is_public_toggle").checked=e.isPublic;let a=document.querySelectorAll("pre code");for(let e=0;e<a.length;e++)i.highlightBlock(a[e]);o.Hub.Queue(["Typeset",o.Hub,"card_description"]),function(){let e=document.getElementById("spoiler"),t=document.getElementById("spoiler_end");if(e&&t){let n=e.getBoundingClientRect(),r=t.getBoundingClientRect(),i=`\n            <div id="spoiler_box" \n            style="height:${r.bottom-n.top}px; \n            width:${document.getElementById("card_description").getBoundingClientRect().width-30}px" \n            onclick="makeInvisible('spoiler_box')">\n            <p>Hover/Click to Reveal</p></div>\n        `,o=document.getElementById("spoiler_box");o?o.innerHTML=i:e.insertAdjacentHTML("beforebegin",i)}}(),t()})}}}])});