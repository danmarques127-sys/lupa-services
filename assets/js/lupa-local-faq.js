/* FAQ accordion — same behavior and classes as Lupa Reviews. */
(function(){
  function init(){
    const root=document.getElementById('reviews-faq');
    if(!root)return;
    const items=Array.from(root.querySelectorAll('.faqItem'));
    function state(item,open){
      const q=item.querySelector('.faqQ'),a=item.querySelector('.faqA'),ico=item.querySelector('.faqIcon');
      if(!q||!a)return;
      q.setAttribute('aria-expanded',String(open));
      item.classList.toggle('is-open',open);
      a.classList.toggle('open',open);
      a.style.maxHeight=open?a.scrollHeight+'px':'0px';
      if(ico)ico.textContent=open?'−':'+';
    }
    items.forEach((item,index)=>{
      const heading=item.querySelector('.faqItem__title'),answer=item.querySelector('.faqItem__text');
      if(!heading||!answer)return;
      const button=document.createElement('button');button.className='faqQ';button.type='button';
      button.id='localFaqQuestion-'+index;button.setAttribute('aria-controls','localFaqAnswer-'+index);
      button.setAttribute('aria-expanded','false');
      const label=document.createElement('span');label.className='faqQ__text';label.textContent=heading.textContent.trim();
      const icon=document.createElement('span');icon.className='faqIcon';icon.setAttribute('aria-hidden','true');icon.textContent='+';
      button.append(label,icon);heading.replaceWith(button);
      const panel=document.createElement('div');panel.className='faqA';panel.id='localFaqAnswer-'+index;
      panel.setAttribute('role','region');panel.setAttribute('aria-labelledby',button.id);
      const inner=document.createElement('div');inner.className='faqA__inner';
      const p=document.createElement('p');p.textContent=answer.textContent.trim();inner.append(p);panel.append(inner);answer.replaceWith(panel);
      button.addEventListener('click',()=>{
        const opening=button.getAttribute('aria-expanded')!=='true';
        items.forEach(it=>state(it,false));
        if(opening)state(item,true);
      });
    });
    if(items.length)state(items[0],true);
    window.addEventListener('resize',()=>items.forEach(item=>{
      if(item.querySelector('.faqQ')?.getAttribute('aria-expanded')==='true')state(item,true);
    }),{passive:true});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();