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

     calculateSAW(weights, types, alternatives, fractionDigits);
})
