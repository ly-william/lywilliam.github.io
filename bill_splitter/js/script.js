let bill = {}
let names = ['Cris', 'Ergi', 'Jason', 'Mike', 'Wellan', 'Will', 'Laurelle', 'Sally'];
let tax_rate = 0.08875
let tip_rate = 0.20
let curr_person_idx = 0
let modal = undefined;



$(document).ready(function() {
  main()
  modal = new bootstrap.Modal(document.getElementById('editRateModal'))
  document.getElementById('editRateModal').addEventListener('hide.bs.modal', function (event) {
    // do something...
    $('#edit_rate_input').val('')
    $('#modal_error').hide()
  })
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
          submitAndNext(true)
        } else {
          // go to next input
          $('#items').find(`[data-idx=${next}]`).focus()
        }
      }
  })

  return component
}
function setPerson(idx, focus) {
  curr_person_idx = idx
  let name = names[curr_person_idx]
  $("#name").text(name)

  let items = $("#items")
  items.empty()
  
  bill[name].forEach((price, idx2, arr) => {
    let component = createItemComponent(price, idx2)
    items.append(component)
    if (focus) {
      // focuses first empty input
      if ((price === 0 && idx2 === 0) || (price === 0 && arr[idx2 - 1] !== 0)) {
        component.find('input').get(0).focus({preventScroll: true})
      }
    }
  })
  $("#name").css("color", "#0d6efd")
  $("#name").animate({color: "black"}, 800)
}

function main() {
  let dropdown = $('#dropdown')
  names.forEach((name, idx) => {
    bill[name] = [0, 0, 0, 0, 0];
    let dropdown_item = $(`<a class="dropdown-item" data-person-idx="${idx}">${name}</a>`)
      .click(function(e) {
        let next_person = $(this).data('person-idx')
        submitPerson()
        setPerson(next_person, false)
        return true; 
      })
      .css('cursor', 'pointer');
    let component = $(`<li></li>`).append(dropdown_item)
    dropdown.append(component)
  })

  $('#displayed_tax_rate').text(`(${(tax_rate*100)}%)`)
  $('#displayed_tip_rate').text(`(${tip_rate*100}%)`)

  $('#edit_rate_input').keypress(function(event) {
    if (event.keyCode == 13 || event.which == 13) {
        event.preventDefault();
        submitRate()
    }
});


  setPerson(curr_person_idx, false)
}

function submitPerson() {
  let curr_person = names[curr_person_idx]
  bill[curr_person] = []
  let arr = bill[curr_person]

  $('#items').children().each(function() {
    let val = $(this).find('input').val()

    if (val !== 0 && val !== "" && !isNaN(val)) {
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
        <td class="align-middle hide">$${total.subtotal.toFixed(2)}</td>
        <td class="align-middle hide">$${total.tax.toFixed(2)}</td>
        <td class="align-middle hide">$${total.tip.toFixed(2)}</td>
        <td class="align-middle bold">$${total.sum.toFixed(2)}</td>
      </tr> 
    `))
  })

  table.append($(`
    <tr>
      <th class="align-middle text-center pl-5">${col_total.person}</th>
      <th class="align-middle hide">$${col_total.subtotal.toFixed(2)}</th>
      <th class="align-middle hide">$${col_total.tax.toFixed(2)}</th>
      <th class="align-middle hide">$${col_total.tip.toFixed(2)}</th>
      <th class="align-middle">$${col_total.sum.toFixed(2)}</th>
    </tr> 
  `))

  $("#main").hide()
  $("#totals").show()

}

function hideTotals() {
  $("#totals").hide()
  $("#main").show()
  expand()
}

function submitAndNext(focus) {
  submitPerson()
  setPerson((curr_person_idx+1)%names.length, focus)
}

function onlyTotal() {
  $(".hide").hide()
  $("#onlyT").hide()
  $("#expandTotals").show()
}

function expand(){
  $(".hide").show()
  $("#onlyT").show()
  $("#expandTotals").hide()
}

function openEditModal(type) {
  $(".displayed_type").text(type)
  $(".displayed_rate").text(`${((type === 'Tip' ? tip_rate : tax_rate) * 100)}%`)
  $('#edit_rate_input').data('rate', type)
  rate_editing = type

  modal.show()
}


function submitRate() {
  let rate_input = $('#edit_rate_input')
  if (rate_input.val().length === 0) {
    modalError(`Enter a number.`);
    return;
  }
  if (isNaN(rate_input.val())) {
    modalError(`<strong>${rate_input.val()}</strong> is not a number.`);
    return;
  }
  if (rate_input.data('rate') === 'Tax') {
    tax_rate = parseFloat(rate_input.val()) / 100
    $("#displayed_tax_rate").text(`(${rate_input.val()}%)`)
  } else {
    tip_rate = parseFloat(rate_input.val()) / 100
    $("#displayed_tip_rate").text(`(${rate_input.val()}%)`)
  }

  modal.hide()
  calculateBill()
}

function modalError(err) {
  $('#modal_error').html(err)
  $('#modal_error').show()
  $('#edit_rate_input').val('')
}