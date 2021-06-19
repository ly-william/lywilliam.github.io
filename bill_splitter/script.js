let bill = {}
let names = ['Cris', 'Ergi', 'Jason', 'Mike', 'Wellan', 'Will', 'Laurelle', 'Sally'];
let tax_rate = 0.0625
let tips = [0.15, 0.2, 0.25]
let tip_rate = 0.20
let curr_person_idx = 0

$(document).ready(function() {
  main()
});

function createItemComponent(price, idx) {
  let component = $(`
    <tr>
      <th class="align-middle text-center pl-5">${idx+1}</th>
      <td class="align-middle">$<input class="custom_input" data-idx="${idx}" type="number" placeholder="00.00" value=${price === 0 ? '' : price}></td>
    </tr>
  `)

  component.find('input').on('keypress',function(e) {
      if(e.which == 13) {
        let next = $(this).data('idx') + 1;
        // if it's empty or we've reached the end of the inputs
        if ($(this).val() === '' || $(this).val() === 0 || next === 5) {
          // go to next person
          submitAndNext()
        } else {
          // go to next input
          $('#items').find(`[data-idx=${next}]`).focus()
        }
      }
  })

  return component
}
function setPerson(idx) {
  curr_person_idx = idx
  let name = names[curr_person_idx]
  $("#name").text(name)

  let items = $("#items")
  items.empty()
  
  bill[name].forEach((price, idx2, arr) => {
    let component = createItemComponent(price, idx2)
    items.append(component)

    // focuses first empty input
    if ((price === 0 && idx2 === 0) || (price === 0 && arr[idx2 - 1] !== 0)) {
      component.find('input').get(0).focus({preventScroll: true})
    }
  })
  $("#name").css("color", "red")
  $("#name").animate({color: "black"})
}

function main() {
  let dropdown = $('#dropdown')
  names.forEach((name, idx) => {
    bill[name] = [0, 0, 0, 0, 0];
    let dropdown_item = $(`<a class="dropdown-item" data-person-idx="${idx}">${name}</a>`)
      .click(function(e) {
        e.preventDefault(); 
        let next_person = $(this).data('person-idx')
        submitPerson()
        setPerson(next_person)
        return false; 
      })
      .css('cursor', 'pointer');
    let component = $(`<li></li>`).append(dropdown_item)
    dropdown.append(component)
  })

  let dropdown2 = $('#dropdown2');
  tips.forEach((tip) => {
    let dropdown_item = $(`<a class="dropdown-item">${parseFloat(tip*100, 2)}% Tip</a>`)
      .click(function(e) {
        e.preventDefault(); 
        tip_rate = tip;
        calculateBill()
        return false; 
      })
      .css('cursor', 'pointer');
    let component = $(`<li></li>`).append(dropdown_item)
    dropdown2.append(component) 
  }) 

  setPerson(curr_person_idx)
}

function submitPerson() {
  let curr_person = names[curr_person_idx]
  bill[curr_person] = []
  let arr = bill[curr_person]

  $('#items').children().each(function() {
    let val = $(this).find('input').val()

    if (val !== 0 && val !== "") {
      arr.push(parseFloat(parseFloat(val).toFixed(2)))
    }
  })

  while (arr.length < 5) {
    arr.push(0)
  }
}

function calculateBill() {
  submitPerson()
  let totals = [] 
  for (let key in bill) {
    let subtotal = bill[key].reduce((acc, e) => acc + e, 0);
    if (subtotal === 0) continue;
    let tax = subtotal * tax_rate
    let tip = subtotal * tip_rate
    totals.push({"person": key, "subtotal": subtotal, "tax": tax, "tip": tip, "sum": subtotal + tax + tip}) 
  }
  showTotals(totals)
}

function showTotals(totals) {
  let table = $("#tbody_totals")
  let col_total = {
    "person": "Totals",
    "subtotal": 0,
    "tax": 0,
    "tip": 0,
    "sum": 0
  }

  table.empty()
  totals.forEach((total) => {
    col_total["subtotal"] += total.subtotal
    col_total["tax"] += total.tax
    col_total["tip"] += total.tip
    col_total["sum"] += total.sum
    table.append($(`
      <tr>
        <td class="align-middle text-center pl-5">${total.person}</td>
        <td class="align-middle">$${total.subtotal.toFixed(2)}</td>
        <td class="align-middle">$${total.tax.toFixed(2)}</td>
        <td class="align-middle">$${total.tip.toFixed(2)}</td>
        <td class="align-middle bold">$${total.sum.toFixed(2)}</td>
      </tr> 
    `))
  })

  table.append($(`
    <tr>
      <th class="align-middle text-center pl-5">${col_total.person}</th>
      <th class="align-middle">$${col_total.subtotal.toFixed(2)}</th>
      <th class="align-middle">$${col_total.tax.toFixed(2)}</th>
      <th class="align-middle">$${col_total.tip.toFixed(2)}</th>
      <th class="align-middle">$${col_total.sum.toFixed(2)}</th>
    </tr> 
  `))

  $("#tip").text(`Tip (${parseInt(tip_rate*100)}%)`)
  $("#main").hide()
  $("#totals").show()

}

function hideTotals() {
  $("#totals").hide()
  $("#main").show()
}

function submitAndNext() {
  submitPerson()
  setPerson((curr_person_idx+1)%names.length)
}