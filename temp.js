
//置換要素を探します

const templateDefinitions = document.querySelectorAll('.replace > [class]');
const targetElements = Array.from(document.querySelectorAll('.p_temp')).filter(el => 
  !el.closest('.replace')
);

// 置換
targetElements.forEach(targetElement => {
  // テンプレートを検索（クラス名のみで判定）
  let matchedTemplate = Array.from(templateDefinitions).find(templateDef => {
    // クラス名の一致を返す
    return Array.from(templateDef.classList).some(cls => 
      targetElement.classList.contains(cls)
    );
  });


  //マッチするのがなかった
  if (!matchedTemplate) {
    console.warn('No matching template found:', targetElement);
    return;
  }

  // テンプレートのクローンを作成
  const templateClone = matchedTemplate.cloneNode(true);

    // マッピング対象の属性を処理
  const mappingKeys = Array.from(templateClone.querySelectorAll('*'))
  .filter(el => el.className)
  .flatMap(el => el.className.split(/\s+/)); // 複数クラス対応

  // 子要素がある場合の処理
  if (matchedTemplate.children.length > 0) {
  mappingKeys.forEach(key => {
    // 対象要素自身のクラスもチェックするよう修正
    const sourceEl = targetElement.classList.contains(key) 
      ? targetElement 
      : targetElement.querySelector(`.${key}`);
    if (!sourceEl) return;

    const templateElements = templateClone.querySelectorAll(`.${key}`);
      
    templateElements.forEach(templateEl => {
      templateEl.innerHTML = sourceEl.innerHTML;
      
      // href属性を常にコピー
      const sourceHref = sourceEl.getAttribute('href');
      if (sourceHref !== null) {
        templateEl.setAttribute('href', sourceHref);
      }
      
      // src属性を常にコピー
      const sourceSrc = sourceEl.getAttribute('src');
      if (sourceSrc !== null) {
        templateEl.setAttribute('src', sourceSrc);
      }
    });
  });
  }

  // 対象要素自体のhref/srcをテンプレートのルート要素に常にコピー
  const sourceHref = targetElement.getAttribute('href');
  if (sourceHref !== null) {
    templateClone.setAttribute('href', sourceHref);
  }

  const sourceSrc = targetElement.getAttribute('src');
  if (sourceSrc !== null) {
    templateClone.setAttribute('src', sourceSrc);
  }
  // コンテンツ挿入処理
  // data-insert="content"属性を持つ要素をテンプレートから検索
  const contentContainer = templateClone.querySelector('[data-insert="content"]');

  // 要素置換処理
  targetElement.parentNode.replaceChild(templateClone, targetElement);
});

// テンプレートコンテナを非表示
document.querySelectorAll('.replace').forEach(el => {
  el.style.display = 'none';
});
// bodyを表示
document.body.style.display = 'block';

