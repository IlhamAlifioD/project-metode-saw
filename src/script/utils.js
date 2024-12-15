function calculateSAW(weights, types, alternatives, fractionDigits) {
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

export default calculateSAW;
