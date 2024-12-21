import calculateSAW from "./utils.js";

// ? Form
const decompositionForm = document.querySelector("#decomposition-form");
const criteriaInputGroup = document.querySelector("#criteria-input-group");

// ? Table
const alternativesHeader = document.querySelector("#alternatives-header tr");
const alternativesContainer = document.querySelector("#alternatives-container");

// ? Result
const resultWrapper= document.querySelector(".result-wrapper");

// ? Button
const createCriterionButton = document.querySelector("#add-criterion");
const deleteCriterionButton = document.querySelector("#remove-criterion");
const createAlternativeButton = document.querySelector("#add-alternative");
const deleteAlternativeButton = document.querySelector("#remove-alternative");

let weights = [];
let types = [];
let alternatives = [];
let fractionDigits = "";

decompositionForm.addEventListener("submit", (event) => {
     event.preventDefault();

     const weightInputs = document.querySelectorAll(".weight");
     const typeInputs = document.querySelectorAll(".type");
     const rows = document.querySelectorAll("#alternatives-container tr");
     const fractionDigitsInput = parseInt(document.querySelector("#fractionDigits").value, 10);

     // ? Mengambil semua nilai input
     weights = Array.from(weightInputs).map((input) => parseFloat(input.value) || 0);
     types = Array.from(typeInputs).map((input) => input.value);
     alternatives = Array.from(rows).map((row) =>
          Array.from(row.querySelectorAll(".alternative")).map(
               (cell) => parseFloat(cell.value) || 0,
          )
     );
     fractionDigits = fractionDigitsInput || 3;
     if (!validateInput(weights, alternatives, fractionDigits)) {
          return;
     }

     calculateSAW(weights, types, alternatives, fractionDigits);

     resultWrapper.classList.remove("hidden");
})

createCriterionButton.addEventListener("click", () => {
     const criterionIndex = criteriaInputGroup.querySelectorAll(".criterion-container").length + 1;
          const criterionContainer = document.createElement("div");
               criterionContainer.classList.add("criterion-container");

               const label = document.createElement("label");
                    label.textContent = `Kriteria ${criterionIndex}:`;

               const weightInput = document.createElement("input");
                    weightInput.type = "number";
                    weightInput.min = "0";
                    weightInput.step = "0.01";
                    weightInput.classList.add("weight");
                    weightInput.required = true;
                    weightInput.placeholder = "Bobot";

               const select = document.createElement("select");
                    select.classList.add("type");
                    select.required = true;
     
                    const optionBenefit = document.createElement("option");
                         optionBenefit.value = "benefit";
                         optionBenefit.textContent = "Benefit";
               
                    const optionCost = document.createElement("option");
                         optionCost.value = "cost";
                         optionCost.textContent = "Cost";
               select.append(optionBenefit, optionCost);
          criterionContainer.append(label, weightInput, select);
     criteriaInputGroup.appendChild(criterionContainer);

     // ? Membuat header kriteria baru pada tabel
     const createTableHeader = document.createElement("th");
          createTableHeader.textContent = `Kriteria ${criterionIndex}`;
          alternativesHeader.appendChild(createTableHeader);

     // ? Menambah kolom pada tabel untuk setiap alternatif
     const rows = document.querySelectorAll("#alternatives-container tr");
          rows.forEach((row) => {
               row.appendChild(createTableCell());
          });
});

deleteCriterionButton.addEventListener("click", () => {
     const criteriaCount = criteriaInputGroup.querySelectorAll(".criterion-container").length;
          if (criteriaCount <= 3) {
                    alert("Minimal harus ada 3 kriteria untuk dihitung!");
               return;
          }

     const lastCriterion = criteriaInputGroup.querySelector(".criterion-container:last-child");
          if (lastCriterion) {
               const criterionIndex = criteriaInputGroup.querySelectorAll(".criterion-container").length;
               const lastCriterionHeader = alternativesHeader.querySelector(`th:nth-child(${criterionIndex + 1})`);
               // ? Menghapus kolom kriteria terakhir pada tabel
               const rows = document.querySelectorAll("#alternatives-container tr");
                    lastCriterion.remove();
                    lastCriterionHeader.remove();
                    rows.forEach((row) => row.removeChild(row.lastElementChild));
          }
});

createAlternativeButton.addEventListener("click", () => {
     const alternativeIndex = alternativesContainer.querySelectorAll("tr").length + 1;

     const createTableRow = document.createElement("tr");
          createTableRow.innerHTML = `<td>A${alternativeIndex}</td>`;
          
     const criterionCells = document.querySelectorAll(".criterion-container");
          criterionCells.forEach(() => {
               createTableRow.appendChild(createTableCell());
          });


     alternativesContainer.appendChild(createTableRow);
});

deleteAlternativeButton.addEventListener("click", () => {
     const tableRows = alternativesContainer.querySelectorAll("tr");
          if (tableRows.length <= 3) {
                    alert("Minimal harus ada 3 alternatif untuk dihitung!");
               return;
          }

     const lastAlternative = alternativesContainer.querySelector("tr:last-child");
          if (lastAlternative) {
               lastAlternative.remove();
          }
});

function createTableCell() {
     const tableCell = document.createElement("td");
          const input = document.createElement("input");
               input.type = "number";
               input.min = "0";
               input.classList.add("alternative");
               input.required = true;
     tableCell.appendChild(input);
     
     return tableCell;
}

function validateInput(weights, alternatives, fractionDigits) {
     if (weights.some(weight => isNaN(weight) || weight === 0))  {
               alert("Harap isi semua bobot kriteria dengan bilangan asli yang lebih besar dari angka 0!");
          return false;
     }

     if (alternatives.some((alt) => alt.some(value => isNaN(value) || value === 0))) {
               alert("Harap isi semua nilai alternatif dengan bilangan asli yang lebih besar dari 0!");
          return false;
     }

     if (isNaN(fractionDigits)) {
               alert("Harap isi jumlah digit desimal dengan bilangan bulat 1 hingga 6!");
          return false;
     }

     return true;
}