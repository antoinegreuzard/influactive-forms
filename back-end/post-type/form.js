/* global Sortable */

document.addEventListener('DOMContentLoaded', function() {
  const container = document.getElementById("influactive_form_fields_container");

  new Sortable(container, {
    handle: '.influactive_form_field', // This class should be on the elements you want to be draggable
    animation: 150,
    onSort: function() {
      updateFieldOrder();
    },
    onEnd: () => {
      updateFieldOrder();
    },
  });

  document.getElementById("add_field").addEventListener("click", addFieldHandler);

  Array.from(container.getElementsByClassName("influactive_form_field")).forEach(function(formField) {
    const fieldType = formField.querySelector(".field_type");

    if (fieldType.value === "select") {
      const addOptionElement = formField.querySelector(".add_option");
      const removeOptionElement = formField.querySelector(".remove_option");

      if (addOptionElement) {
        addOptionElement.addEventListener("click", addOptionHandler);
      }

      if (removeOptionElement) {
        removeOptionElement.addEventListener("click", removeOptionHandler);
      }
    }
  });

  container.addEventListener("click", function(e) {
    if (e.target && e.target.classList.contains("remove_field")) {
      removeFieldHandler(e);
    }
  });
});

function updateFieldOrder() {
  const container = document.getElementById("influactive_form_fields_container");
  Array.from(container.getElementsByClassName("influactive_form_field")).forEach((formField, index) => {
    formField.querySelector(".influactive_form_fields_order").value = index;
  });

  recalculateFieldIndexes();
}

function addFieldHandler(e) {
  e.preventDefault();

  let fieldElement = createFieldElement();
  let container = document.getElementById("influactive_form_fields_container");
  container.appendChild(fieldElement);

  const fieldType = fieldElement.querySelector(".field_type");
  fieldType.addEventListener("change", fieldTypeChangeHandler(fieldElement));


  const addOptionBtn = fieldElement.querySelector(".add_option");
  if (addOptionBtn) {
    addOptionBtn.addEventListener("click", addOptionHandler);
  }

  recalculateFieldIndexes();
}

function fieldTypeChangeHandler(fieldElement) {
  return function(event) {
    let fieldValue = event.target.value;

    if (fieldValue === "select") {
      const addOptionElement = document.createElement('p')
      addOptionElement.innerHTML = "<a href='#' class='add_option'>Add option</a>";
      const options_container = fieldElement.querySelector(".options_container");
      options_container.parentNode.insertBefore(addOptionElement, options_container.nextSibling);

      addOptionElement.addEventListener("click", addOptionHandler);
    }
  }
}

function addOptionHandler(e) {
  e.preventDefault();
  const optionsContainer = e.target.parentElement.previousElementSibling;
  const optionElement = createOptionElement();

  // Here, add event listener to the "Remove option" link
  const removeOptionElement = optionElement.querySelector('.remove_option');
  if (removeOptionElement) {
    removeOptionElement.addEventListener("click", removeOptionHandler);
  }

  optionsContainer.appendChild(optionElement);

  let influactive_form_fields_order = optionElement.closest(".influactive_form_field").querySelector(".influactive_form_fields_order").value;
  let influactive_form_options_order = 0;
  if (document.getElementsByClassName("option-field").length > 0) {
    influactive_form_options_order = document.getElementsByClassName("option-field").length;
  }
  optionElement.querySelector(".option-label").name = "influactive_form_fields[" + influactive_form_fields_order + "][options][" + influactive_form_options_order + "][label]";
  optionElement.querySelector(".option-value").name = "influactive_form_fields[" + influactive_form_fields_order + "][options][" + influactive_form_options_order + "][value]";

  recalculateFieldIndexes();
}

function removeFieldHandler(e) {
  e.preventDefault();
  e.target.closest(".influactive_form_field").remove();
  recalculateFieldIndexes();
}

function removeOptionHandler(e) {
  e.preventDefault();
  e.target.closest(".option-field").remove();
  recalculateFieldIndexes();
}

function createFieldElement() {
  let fieldElement = document.createElement('div');
  let id = 0;
  // compter le nombre de .influactive_form_field, il y a dans la page
  if (document.getElementsByClassName("influactive_form_field").length > 0) {
    id = document.getElementsByClassName("influactive_form_field").length;
  }
  fieldElement.className = "influactive_form_field";
  fieldElement.innerHTML =
    "<p><label>Type <select class='field_type' name='influactive_form_fields[" + id + "][type]'>" +
    "<option value='text'>Text</option>" +
    "<option value='email'>Email</option>" +
    "<option value='number'>Number</option>" +
    "<option value='textarea'>Textarea</option>" +
    "<option value='select'>Select</option>" +
    "</select></label> " +
    "<label>Label <input type='text' name='influactive_form_fields[" + id + "][label]'></label> " +
    "<label>Name <input type='text' name='influactive_form_fields[" + id + "][name]'></label> " +
    "<div class='options_container'></div>" +
    "<input type='hidden' name='influactive_form_fields[" + id + "][order]' class='influactive_form_fields_order' value='" + id + "'>" +
    "<a href='#' class='remove_field'>Remove the field</a> " +
    "</p>";

  return fieldElement;
}


function createOptionElement() {
  let optionElement = document.createElement('p');
  optionElement.className = "option-field";
  // use appendChild for optionElement to
  optionElement.innerHTML = "<label>Option Label " +
    "<input type='text' class='option-label' name='influactive_form_fields[][options][][label]'>" +
    "</label> " +
    "<label>Option Value " +
    "<input type='text' class='option-value' name='influactive_form_fields[][options][][value]'>" +
    "</label> " +
    "<a href='#' class='remove_option'>Remove option</a>";

  return optionElement;
}

function recalculateFieldIndexes() {
  const container = document.getElementById("influactive_form_fields_container");
  const formFields = Array.from(container.getElementsByClassName("influactive_form_field"));

  formFields.forEach((fieldField, index) => {
    const fieldType = fieldField.querySelector(".field_type");
    const fieldLabel = fieldField.querySelector(".influactive_form_fields_label");
    const fieldName = fieldField.querySelector(".influactive_form_fields_name");
    const fieldOrder = fieldField.querySelector(".influactive_form_fields_order");

    fieldType.name = `influactive_form_fields[${index}][type]` ?? "";
    fieldLabel.name = `influactive_form_fields[${index}][label]` ?? "";
    fieldName.name = `influactive_form_fields[${index}][name]` ?? ""
    fieldOrder.name = `influactive_form_fields[${index}][order]` ?? "";
  });
}
