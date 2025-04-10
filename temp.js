//置換要素を探します
const templateDefinitions = document.querySelectorAll('.replace > [class]');
const targetElements = Array.from(document.querySelectorAll('.p_temp')).filter(el => 
  !el.closest('.replace')
);

// 属性コピー処理の共通化
function copyAttributes(source, target, attributes = []) {
  attributes.forEach(attr => {
    const value = source.getAttribute(attr);
    if (value !== null) target.setAttribute(attr, value);
  });
}

// 置換処理
targetElements.forEach(targetElement => {
  // テンプレート検索
  const matchedTemplate = Array.from(templateDefinitions).find(templateDef => 
    Array.from(templateDef.classList).some(cls => 
      targetElement.classList.contains(cls)
    )
  );

  if (!matchedTemplate) {
    console.warn('No matching template found:', targetElement);
    return;
  }

  // テンプレートクローン作成
  const templateClone = matchedTemplate.cloneNode(true);
  const attributesToCopy = ['href', 'src'];

  // 子要素処理
  if (matchedTemplate.children.length > 0) {
    const mappingKeys = Array.from(templateClone.querySelectorAll('*'))
  .flatMap(el => {
    const className = el.getAttribute('class');
    return className ? className.split(/\s+/) : [];
  });

    mappingKeys.forEach(key => {
      const sourceEl = targetElement.classList.contains(key) 
        ? targetElement 
        : targetElement.querySelector(`.${key}`);
      if (!sourceEl) return;

      templateClone.querySelectorAll(`.${key}`).forEach(templateEl => {
        templateEl.innerHTML = sourceEl.innerHTML;
        copyAttributes(sourceEl, templateEl, attributesToCopy);
      });
    });
  }

  // ルート要素属性コピー
  copyAttributes(targetElement, templateClone, attributesToCopy);

  // 要素置換処理
  targetElement.parentNode.replaceChild(templateClone, targetElement);
});

// テンプレート非表示 & body表示
document.querySelectorAll('.replace').forEach(el => el.style.display = 'none');
document.body.style.display = 'block';