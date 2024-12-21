import calculateSAW from "./utils.js";

// ? Form
const decompositionForm = document.querySelector("#decomposition-form");
const criteriaInputGroup = document.querySelector("#criteria-input-group");
const alternativesInputGroup = document.querySelector("#alternatives-input-group");

// ? Table
const agregationTableHeader = document.querySelector("#agregation-table-header tr");
const agregationTableBody = document.querySelector("#agregation-table-body");

// ? Result
const resultWrapper= document.querySelector(".result-wrapper");

// ? Button
const createCriterionButton = document.querySelector("#add-criterion");
const deleteCriterionButton = document.querySelector("#remove-criterion");
const createAlternativeButton = document.querySelector("#add-alternative");
const deleteAlternativeButton = document.querySelector("#remove-alternative");

let criterionNames = [];
let weights = [];
let types = [];
let alternativeNames = [];
let alternatives = [];
let fractionDigits = "";

decompositionForm.addEventListener("submit", (event) => {
     event.preventDefault();

     const weightInputs = document.querySelectorAll(".weight");
     const typeInputs = document.querySelectorAll(".type");
     const rows = document.querySelectorAll("#agregation-table-body tr");
     const fractionDigitsInput = parseInt(document.querySelector("#fractionDigits").value, 10);

     // ? Mengambil semua input nama kriteria
     criterionNames = Array.from(criteriaInputGroup.querySelectorAll(".criterion-name")).map(input => input.value);
     alternativeNames = Array.from(alternativesInputGroup.querySelectorAll(".alternative-name")).map(input => input.value);

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

     console.log("Nama kriteria:", criterionNames);
     console.log("Nama alternatif:", alternativeNames);

     calculateSAW(criterionNames, weights, types, alternativeNames, alternatives, fractionDigits);

     resultWrapper.classList.remove("hidden");
})

// ? Listener tobol kriteria
createCriterionButton.addEventListener("click", () => {
     const criterionIndex = criteriaInputGroup.querySelectorAll(".criterion-container").length + 1;
          const criterionContainer = document.createElement("div");
               criterionContainer.classList.add("criterion-container");

               const label = document.createElement("label");
                    label.textContent = `Kriteria ${criterionIndex}:`;
               
               const criterionName = document.createElement("input");
                    criterionName.classList.add("criterion-name");
                    criterionName.type = "text";
                    criterionName.required = true;
                    criterionName.placeholder = "Nama Kriteria";

                    criterionName.addEventListener("input", () => {
                         criterionNames[criterionIndex - 1] = criterionName.value;
                    });

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
          criterionContainer.append(label, criterionName, weightInput, select);
     criteriaInputGroup.appendChild(criterionContainer);

     // ? Membuat header kriteria baru pada tabel
     const createTableHeader = document.createElement("th");
          createTableHeader.textContent = `C${criterionIndex}`;
          agregationTableHeader.appendChild(createTableHeader);

     // ? Menambah kolom pada tabel untuk setiap alternatif
     const rows = document.querySelectorAll("#agregation-table-body tr");
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
               const lastCriterionHeader = agregationTableHeader.querySelector(`th:nth-child(${criterionIndex + 1})`);
               // ? Menghapus kolom kriteria terakhir pada tabel
               const rows = document.querySelectorAll("#agregation-table-body tr");
                    lastCriterion.remove();
                    lastCriterionHeader.remove();
                    rows.forEach((row) => row.removeChild(row.lastElementChild));
          }
});


// ? Listener tobol alternatif
createAlternativeButton.addEventListener("click", () => {
     const alternativeIndex = alternativesInputGroup.querySelectorAll(".alternative-container").length + 1;
          const alternativeContainer = document.createElement("div");
               alternativeContainer.classList.add("alternative-container");

               const label = document.createElement("label");
                    label.textContent = `Alternatif ${alternativeIndex}:`;
               
               const alternativeName = document.createElement("input");
                    alternativeName.classList.add("alternative-name");
                    alternativeName.type = "text";
                    alternativeName.required = true;
                    alternativeName.placeholder = "Nama Alternatif";

                    alternativeName.addEventListener("input", () => {
                         alternativeNames[alternativeIndex - 1] = alternativeName.value;
                    });

          alternativeContainer.append(label, alternativeName);
     alternativesInputGroup.appendChild(alternativeContainer);

     const alternativeIndexTable = agregationTableBody.querySelectorAll("tr").length + 1;
     // ? Membuat header row alternatif baru pada tabel
     const createTableRow = document.createElement("tr");
          createTableRow.innerHTML = `<td>A${alternativeIndexTable}</td>`;

     // ? Membuat kolom input nilai alternatif baru pada tabel
     const criterionCells = document.querySelectorAll(".criterion-container");
          criterionCells.forEach(() => {
               createTableRow.appendChild(createTableCell());
          });


     agregationTableBody.appendChild(createTableRow);
});

deleteAlternativeButton.addEventListener("click", () => {
     const tableRows = agregationTableBody.querySelectorAll("tr");
          if (tableRows.length <= 3) {
                    alert("Minimal harus ada 3 alternatif untuk dihitung!");
               return;
          }

     const lastAlternative = alternativesInputGroup.querySelector(".alternative-container:last-child");
          if (lastAlternative) {
               const alternativeIndex = criteriaInputGroup.querySelectorAll(".alternative-container").length;
               const lastAlternativeRow = agregationTableBody.querySelector("tr:last-child");
                    lastAlternative.remove();
                    lastAlternativeRow.remove();
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