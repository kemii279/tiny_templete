function copyAttributes(n,t,i=[]){i.forEach(i=>{const r=n.getAttribute(i);r!==null&&t.setAttribute(i,r)})}const templateDefinitions=document.querySelectorAll(".replace > [class]"),targetElements=Array.from(document.querySelectorAll(".p_temp")).filter(n=>!n.closest(".replace"));targetElements.forEach(n=>{const i=Array.from(templateDefinitions).find(t=>Array.from(t.classList).some(t=>n.classList.contains(t)));if(!i){console.warn("No matching template found:",n);return}const t=i.cloneNode(!0),r=["href","src"];if(i.children.length>0){const i=Array.from(t.querySelectorAll("*")).filter(n=>n.className).flatMap(n=>n.className.split(/\s+/));i.forEach(i=>{const u=n.classList.contains(i)?n:n.querySelector(`.${i}`);u&&t.querySelectorAll(`.${i}`).forEach(n=>{n.innerHTML=u.innerHTML,copyAttributes(u,n,r)})})}copyAttributes(n,t,r);n.parentNode.replaceChild(t,n)});document.querySelectorAll(".replace").forEach(n=>n.style.display="none");document.body.style.display="block"