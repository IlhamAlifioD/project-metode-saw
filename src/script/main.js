document.getElementById('calculate-btn').addEventListener('click', function () {
     console.log("terklik");
     calculateSAW(); 
});

let weights = [];
let types = [];
let alternatives = [];
let fractionDigits = "";

function calculateSAW() {
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
     
     const fractionDigits = fractionDigitsInput || 3;        // ? Jika tidak ada input, maka menggunakan nilai default

     // ? Debugging
     console.log("Bobot:", weights);
     console.log("Tipe:", types);
     console.log("Alternatif:", alternatives);

	const normalizedAlternatives = [];
          // ? Perhitungan Normalisasi
          for (let i = 0; i < weights.length; i++) {
               const values = alternatives.map((alt) => alt[i]);
               const max = Math.max(...values);
               const min = Math.min(...values);
                    normalizedAlternatives.push(
                         values.map((value) => types[i] === "benefit" ? value / max : min / value)
                    );
          }

	const normalizedTableBody = document.querySelector("#normalizationTable tbody");
          normalizedTableBody.innerHTML = alternatives.map((_, i) => `
               <tr>
                    <td>A${i + 1}</td>
                    ${normalizedAlternatives.map(
                         (row) => `<td>${row[i].toFixed(fractionDigits)} </td>`
                    ).join("")}
               </tr>
          `).join("");

     // ? Perhitungan Skor Hasil Normalisasi
     const finalScores = alternatives.map((_, alternativeIndex) =>
          normalizedAlternatives.reduce((totalScore, criterionValues, criterionIndex) =>
               totalScore + criterionValues[alternativeIndex] * weights[criterionIndex], 0)
     );

     // ? Perangkingan
	const ranked = finalScores
		.map((score, i) => ({ alternative: `A${i + 1}`, score }))
		.sort((a, b) => b.score - a.score);

	const rankingTableBody = document.querySelector("#rankingTable tbody");
          rankingTableBody.innerHTML = ranked.map(
               ({ alternative, score }) => `
                    <tr>
                         <td>${alternative}</td>
                         <td>${score.toFixed(fractionDigits)}</td>
                    </tr>
               `
		).join("");


     // ? Debugging
     console.log("Tabel Normalisasi:", normalizedTableBody.innerHTML);
     console.log("Tabel Ranking:", rankingTableBody.innerHTML);
}
