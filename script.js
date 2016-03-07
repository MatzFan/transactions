// href="javascript:(function () { alert(allContracts.length) })();"

(function () {

  function toDate(str) {
    var dayMthYear = str.split('/');
    return new Date(dayMthYear[2], dayMthYear[1] - 1, dayMthYear[0]);
  }

  function rowTextAtColumn(colNum) {
    var array = [];
    var rows = document.getElementsByTagName('tr');
    for(var i = 1; i < rows.length; i++) {
      var string = rows[i].children[colNum].innerText;
      array.push(string);
    }
    return array;
  }

  function dates(stringArr) {
    var array = [];
    for(var i = 0; i < stringArr.length; i++) { array.push(toDate(stringArr[i])); }
    return array;
  }

  function matches(regexArr, obj) {
    var i = regexArr.length;
    while (i--) {
     if (obj.match(regexArr[i])) {
       return true;
      }
    }
    return false;
  }

  function post(nameSeq, docSeq) {
    params = 'tab=details&nameSeq=' + nameSeq + '&docSeq=' + docSeq
    xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST', 'pride/Search/PrintDetails.aspx' ,false);
    xmlhttp.setRequestHeader('Referer', 'http://pride/pride/Search/detailstab.aspx?tab=details&nameSeq=' + nameSeq + '&docSeq=' + docSeq);
    xmlhttp.send(params);
    return xmlhttp.responseText;
  }

  function pasteTextInNewWindow(string) {
    window.open('', 'data').document.body['innerText'] = string;
  }

  var blacklist = [/^Act -.*/, /^Transaction.*/, /Will Registered/, /^H.C.S. -.*/, /^Notice -.*/, /Rights - Sale/, /Co ownership Declaration/];
  var datesArr = dates(rowTextAtColumn(3));
  var docTypesArr = rowTextAtColumn(8);
  var allText = '';
  var count = 0;
  for(var i = 0; i < allContracts.length; i++) {
    if(datesArr[i].getDay() == 5 && !matches(blacklist, docTypesArr[i])) {
      count += 1;
      var nameSeq = allContracts[i].nameSeq;
      var docSeq = allContracts[i].docSeq;
      allText += ('|' + post(nameSeq, docSeq));
    }
  };
  alert(count);
  pasteTextInNewWindow(allText);

})();
