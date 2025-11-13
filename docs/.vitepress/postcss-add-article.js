import pkg from 'postcss-selector-parser';

const { combinator, tag } = pkg;

export default () => ({
  postcssPlugin: 'postcss-add-article-to-root-selectors',
  Rule(rule) {
    rule.selector = pkg((selectors) => {
      selectors.each(sel => {
        // 找到第一个非 combinator 的节点序列 [i..j)
        let i = 0;
        while (i < sel.nodes.length && sel.nodes[i].type === 'combinator') i++;
        if (i >= sel.nodes.length) return;
        let j = i;
        while (j < sel.nodes.length && sel.nodes[j].type !== 'combinator') j++;

        // 在该序列内检查是否包含 html / body / :root
        const seq = sel.nodes.slice(i, j);
        const hasRootLike = seq.some(n =>
          (n.type === 'tag' && (n.value === 'html' || n.value === 'body')) ||
          (n.type === 'pseudo' && (n.value === ':root' || n.value === 'root'))
        );
        if (!hasRootLike) return;

        // 检查紧随其后的第一个非 combinator 是否已经是 article，避免重复插入
        let k = j;
        while (k < sel.nodes.length && sel.nodes[k].type === 'combinator') k++;
        if (k < sel.nodes.length && sel.nodes[k].type === 'tag' && sel.nodes[k].value === 'article') return;

        // 在该序列后插入 " article"（通过插入空格 combinator + tag）
        const space = combinator({ value: ' ' });
        const article = tag({ value: 'article' });
        sel.insertAfter(sel.nodes[j - 1], space);
        sel.insertAfter(space, article);
      });
    }).processSync(rule.selector);
  }
});
