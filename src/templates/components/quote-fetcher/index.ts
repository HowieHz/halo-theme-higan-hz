// var t = document.getElementById("quote") as HTMLElement;
// var e = t.dataset.link;

// try {
//   if (e) {
//     var n = await fetch(e);
//     if (n.ok) {
//       t.innerText = await n.text();
//     } else {
//       t.innerText = ":)";
//     }
//   } else {
//     t.innerText = ":)";
//   }
// } catch {
//   t.innerText = ":)";
// }

// 假设 1：#quote 元素存在，并且具有 data-link 属性
// 假设 2：data-link 属性的值可能为空，或者是一个有效的 URL，指向一个文本资源

var n,
  t = document.getElementById("quote") as HTMLElement,
  e = t.dataset.link;
try {
  e && (n = await fetch(e)).ok ? (t.innerText = await n.text()) : (t.innerText = ":)");
} catch {
  t.innerText = ":)";
}

export {};
