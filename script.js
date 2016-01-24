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

  function get(url) {
    xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET', url ,false);
    xmlhttp.send();
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
      var nameS = allContracts[i].nameSeq;
      var docS = allContracts[i].docSeq;
      var url = 'detailstab.aspx?tab=details&nameSeq=' + nameS + '&docSeq=' + docS;
      allText += ('|' + get(url));
    }
  };
  alert(count);
  pasteTextInNewWindow(allText);

})();
