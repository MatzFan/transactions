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

  function doGet(tab, nameSeq, docSeq) {
    xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET', 'http://pride/pride/Search/detailstab.aspx?tab=' + tab + '&nameSeq=' + nameSeq + '&docSeq=' + docSeq, false);
    xmlhttp.send();
    return xmlhttp.responseText;
  }

  function parsePartiesProperties(text) {
    var data = text.match(/(<td (.*)<\/td>|<a href=(.*)<\/a>)/gmi).slice(19).map(function(string) {
      return string.match(/>(.*)</)[0];
    });
    return data.join('\n');
  }

  function parseDetails(text) {
    var data = text.match(/<td (.*)<\/td>$/gmi).slice(14).map(function(string) {
      trunc = string.match(/(.*)<\/span><\/td>/)[0].substring(0, string.length -12);
      return trunc.substring(trunc.lastIndexOf('>')) + '<';
    });
    return data.join('\n');
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
      var details = parseDetails(doGet('details', nameSeq, docSeq));
      var parties = parsePartiesProperties(doGet('parties', nameSeq, docSeq));
      var properties = parsePartiesProperties(doGet('properties', nameSeq, docSeq));
      allText += '<DET>\n' + details + '\n<PAR>\n' + parties + '\n<PRO>\n' + properties + '\n|\n';
    }
  };
  alert(count);
  pasteTextInNewWindow(allText);

})();
