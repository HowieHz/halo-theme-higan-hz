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

var n,
  t = document.getElementById("quote") as HTMLElement,
  e = t.dataset.link;
try {
  e && (n = await fetch(e)).ok ? (t.innerText = await n.text()) : (t.innerText = ":)");
} catch {
  t.innerText = ":)";
}

export {};
