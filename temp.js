
const templateDefinitions = document.querySelectorAll('.replace > [class]');
const targetElements = Array.from(document.querySelectorAll('.p_temp')).filter(el => 
  !el.closest('.replace')
);

// 各置換対象に対して処理を実行
targetElements.forEach(targetElement => {
  // マッチするテンプレートを検索（クラス名のみで判定）
  let matchedTemplate = Array.from(templateDefinitions).find(templateDef => {
    // クラス名の一致を確認（タグの種類は無視）
    return Array.from(templateDef.classList).some(cls => 
      targetElement.classList.contains(cls)
    );
  });

  if (!matchedTemplate) {
    console.warn('No matching template found:', targetElement);
    return;
  }

  // テンプレートの解析
  const templateInfo = {
    template: matchedTemplate,
    hasChildTags: matchedTemplate.children.length > 0,
    originalHTML: matchedTemplate.innerHTML
  };

  // テンプレートのクローンを作成
  const templateClone = matchedTemplate.cloneNode(true);

  // マッピング対象の属性を処理
  const mappingKeys = Array.from(templateClone.querySelectorAll('*'))
    .filter(el => el.className)
    .flatMap(el => el.className.split(/\s+/)); // 複数クラス対応

  // 修正後のマッピング処理部分
  if (templateInfo.hasChildTags) {
    mappingKeys.forEach(key => {
      const sourceEl = targetElement.querySelector(`.${key}`);
      if (!sourceEl) return;

      // テンプレート内の該当クラス要素をすべて取得
      const templateElements = templateClone.querySelectorAll(`.${key}`);
      
      // すべての一致する要素に内容をコピー
      templateElements.forEach(templateEl => {
        templateEl.innerHTML = sourceEl.innerHTML;
        // href属性の処理を追加
        if (templateEl.hasAttribute('href')) {
          const sourceHref = sourceEl.getAttribute('href');
          if (sourceHref) {
            templateEl.setAttribute('href', sourceHref);
          }
        }
        if (templateEl.hasAttribute('src')) {
          const sourceHref = sourceEl.getAttribute('src');
          if (sourceHref) {
            templateEl.setAttribute('src', sourceHref);
          }
        }
      });
    });
  } else {
    // タグがない場合は要素全体のHTMLを使用
    templateClone.innerHTML = targetElement.innerHTML;
    
    // タグがない場合もhref属性を処理
    if (templateClone.hasAttribute('href') && targetElement.hasAttribute('href')) {
      templateClone.setAttribute('href', targetElement.getAttribute('href'));
    }
    if (templateClone.hasAttribute('src') && targetElement.hasAttribute('src')) {
      templateClone.setAttribute('src', targetElement.getAttribute('src'));
    }
  }
  // コンテンツ挿入処理
  // data-insert="content"属性を持つ要素をテンプレートから検索
  const contentContainer = templateClone.querySelector('[data-insert="content"]');
  if (contentContainer) {
    // 対象要素の子ノードから、以下の条件に合うものをフィルタリング:
    // 1. テキストノードの場合: 空白以外のテキストを含むもの
    // 2. 要素ノードの場合: マッピング対象のクラスを持たないもの
    const unmappedNodes = Array.from(targetElement.childNodes).filter(node => {
      // テキストノードの処理
      if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent.trim() !== ''; // 空白でないテキスト
      }
      // 要素ノードの処理
      if (node.nodeType === Node.ELEMENT_NODE) {
        // マッピング対象のクラスを持たない要素のみを選択
        return !Array.from(node.classList).some(cls => mappingKeys.includes(cls));
      }
      return false; // その他のノードタイプは除外
    });

    // フィルタリングされたノードを、コンテンツ挿入先にディープコピーして追加
    unmappedNodes.forEach(node => {
      contentContainer.appendChild(node.cloneNode(true));
    });
  }

  // 要素置換処理
  targetElement.parentNode.replaceChild(templateClone, targetElement);
});

// テンプレートコンテナを非表示
document.querySelectorAll('.replace').forEach(el => {
  el.style.display = 'none';
});
// bodyを表示
document.body.style.display = 'block';

