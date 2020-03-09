// This allows the Javascript code inside this block to only run when the page
// has finished loading in the browser.

var randomIndex, cnt, current_rval;
current_rval = 1;
cnt = 0;

$( document ).ready(function() {
  resetCountry();
  
});

// Need to be modified: When clicked -> same behavior as pressing enter. 
$( document).ready(function(){ 
  var country_capital_pairs = pairs;
  var source = [];
  var value;
  for (var i=0; i<country_capital_pairs.length; i++){
    value = country_capital_pairs[i];
    source = source.concat(value['capital'])
  }
  var searchSource = source;
  $("#input").autocomplete({  
      source : searchSource,
      select : function(event, ui) { 

      },
      focus : function(event, ui) {    
       
      },
      minLength: 1,
      autoFocus: true, 
      classes: {   
          "ui-autocomplete": "highlight"
      },
      delay: 100, 
      position: { my : "right top", at: "right bottom" },    
      close : function(event){  
        console.log(event);
      }
  });
});

function enterkey() {
  if (window.event.keyCode == 13) {
       submit();
  }
};

function submit(){
  addRowtoTable();
  resetCountry();
  resetInput();
};

function resetCountry(){
  var country_capital_pairs = pairs;
  randomIndex = Math.floor(Math.random() * country_capital_pairs.length); 
  var randomElement = country_capital_pairs[randomIndex]['country'];
  document.getElementById('pr2__question').innerHTML=randomElement;
};

function resetInput(){
  var input = document.getElementById('input');
  input.value = "";
};

function addRowtoTable(){
  var country_capital_pairs = pairs;
  var country = document.getElementById('pr2__question').outerHTML;
  var answer = document.getElementById('input').value;
  var correctanswer = country_capital_pairs[randomIndex]['capital'];

  var objTable = document.getElementById('table1');
  var objRow = objTable.insertRow(3);
  var cell_country = objRow.insertCell(-1);
  var cell_answer = objRow.insertCell(-1);
  var cell_correctness = objRow.insertCell(-1);
  if (answer.toLowerCase()==correctanswer.toLowerCase())
  {
    cell_country.innerHTML = country;
    cell_answer.innerHTML = answer;
    if (answer==correctanswer)
    {
      cell_correctness.innerHTML = '<i class="fas fa-check"></i>';
    }
    else{
      cell_correctness.innerHTML = correctanswer;
    }

    var button = document.createElement('input');
    button.setAttribute('type', 'button');
    button.setAttribute('value', 'Remove');
    button.setAttribute('onclick', 'removeRow(this)');
    button.setAttribute("style", "float:right")

    cell_correctness.appendChild(button);

    cell_answer.className = "correct";
    cell_country.className = "correct";
    cell_correctness.className = "correct" ; 
    if(current_rval==3)
    {
      //same effect as clicking all 
      
      filterTable(1);
      document.getElementById('radio1').checked = true;     
    }
  }
  else
  {
    cell_country.innerHTML = country;
    cell_answer.innerHTML = answer.strike();
    cell_correctness.innerHTML = correctanswer ;

    var button = document.createElement('input');
    button.setAttribute('type', 'button');
    button.setAttribute('value', 'Remove');
    button.setAttribute('onclick', 'removeRow(this)');
    button.setAttribute("style", "float:right")

    cell_correctness.appendChild(button);
    cell_answer.className = "incorrect";
    cell_country.className = "incorrect";
    cell_correctness.className = "incorrect";
    if(current_rval==2)
    {
      //same effect as clicking all 
      filterTable(1);
      document.getElementById('radio1').checked = true;
    }
  }
}

function removeRow(oButton) {
  var empTab = document.getElementById('table1');
  empTab.deleteRow(oButton.parentNode.parentNode.rowIndex);     
}

function filterTable(radio)
{
  var table, tr, i, radioval, corr, incorr;
  radioval = radio;
  if(radioval == current_rval)
  {
    return;
  }

  if(radioval==1)
  {
    corr = 1;
    incorr = 1;
  }
  else if (radioval==2)
  {
    corr=1;
    incorr=0;
  }
  else
  {
    corr=0;
    incorr=1;
  }

  table = document.getElementById('table1');
  tr = table.getElementsByTagName('tr');

  for (i=3;i<tr.length;i++)
  {
    td = tr[i].getElementsByTagName('td')[0].className;
    if(td=="incorrect"&&incorr==0)
    {
      tr[i].style.display= "none";
    }
    else if (td=="incorrect"&&incorr==1)
    {
      tr[i].style.display="";
    }
    else if (td=="correct"&&corr==0)
    {
      tr[i].style.display = "none";
    }
    else
    {
      tr[i].style.display=""
    }
  }

  current_rval = radioval;
  return;
}