// 20241226
// Function to walk through an object
function eNotes2Table(obj) {
  var idx = 0, tab_id = "tab_for_eNotes";
  var stb = `<table id='${tab_id}' border='1'><thead><tr><th>#</th> <th>bcv</th> <th>dat</th> <th>verse</th> </tr></thead> <tbody>`
  // Iterate over each key in the object
  for (let book in obj) {
    // Check if the value corresponding to the key is an object itself
    for (chap in obj[book]) {
      // If it is an object, recursively call the walkObject function
      for (vers in obj[book][chap]) {
        var txt = obj[book][chap][vers].trim()
        if (txt.length === 0) break
        var ary = [book, chap, vers]


        var dat = txt.substring(0, 13).replace(/\<|\>/g, "")
        let pattern = /\d{6}_\d{6}/i;
        let result = txt.match(pattern);
        if (!result) result = ""

        // If it's not an object, print the key and its corresponding value
        console.log(ary.join() + ': ' + txt);
        stb += `<tr><td>${idx++}</td><td>${ary.join()}</td><td>${result}</td><td>${txt}</td></tr>`
      }
    }
  }
  return { tabHTM: stb + "<tbody></table>", tabID: tab_id }
}
