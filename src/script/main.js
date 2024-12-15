import calculateSAW from "./utils.js";

const decompositionForm = document.querySelector("#decomposition-form");

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

     weights = Array.from(weightInputs).map((input) => parseFloat(input.value) || 0);
     types = Array.from(typeInputs).map((input) => input.value);
     alternatives = Array.from(rows).map((row) =>
          Array.from(row.querySelectorAll(".alternative")).map(
               (cell) => parseFloat(cell.value) || 0,
          )
     );
     fractionDigits = fractionDigitsInput || 3;        // ? Jika tidak ada input, maka menggunakan nilai default

     if (!validateInput(weights, alternatives, fractionDigits)) {
          return;
     }

     calculateSAW(weights, types, alternatives, fractionDigits);
})


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