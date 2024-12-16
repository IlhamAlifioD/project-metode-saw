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

     const normalizationTableContainer = document.querySelector("#normalization-table-container");
          normalizationTableContainer.innerHTML = renderNormalizationTable(
               "Tabel Normalisasi", 
               weights.length, 
               normalizedAlternatives, 
               fractionDigits,
          );

     // ? Perhitungan Skor Hasil Normalisasi
     const finalScores = alternatives.map((_, alternativeIndex) =>
          normalizedAlternatives.reduce((totalScore, criterionValues, criterionIndex) =>
               totalScore + criterionValues[alternativeIndex] * weights[criterionIndex], 0)
     );

     // ? Perangkingan
	const ranked = finalScores
		.map((score, i) => ({ alternative: `A${i + 1}`, score }))
		.sort((a, b) => b.score - a.score);

     const rankingTableContainer = document.querySelector("#ranking-table-container");
          rankingTableContainer.innerHTML = renderRankingTable(
               "Tabel Ranking", 
               ranked, 
               fractionDigits,
          );

     // ? Debugging
     console.log("Tabel Normalisasi:", normalizedTableBody.innerHTML);
     console.log("Tabel Ranking:", rankingTableBody.innerHTML);
}

function renderNormalizationTable(title, numCriteria, normalizedAlternatives, fractionDigits) {
     const headers = Array.from(
          { length: numCriteria }, (_, i) => `
               <th>Kriteria ${i + 1}</th>
          `
     ).join("");

     const rows = normalizedAlternatives[0].map((_, i) => `
          <tr>
               <td>A${i + 1}</td>
               ${normalizedAlternatives.map(row => `<td>${row[i].toFixed(fractionDigits)}</td>`).join("")}
          </tr>`
     ).join("");

     return `
          <h3>${title}</h3>
          <table>
               <thead>
                    <tr>
                         <th>Alternatif</th>
                         ${headers}
                    </tr>
               </thead>
               <tbody>
                    ${rows}
               </tbody>
          </table>
     `;
}

function renderRankingTable(title, ranked, fractionDigits) {
     const rows = ranked.map(({ alternative, score }) => `
          <tr>
               <td>${alternative}</td>
               <td>${score.toFixed(fractionDigits)}</td>
          </tr>`
     ).join("");

     return `
          <h3>${title}</h3>
          <table>
               <thead>
                    <tr>
                         <th>Alternatif</th>
                         <th>Total Skor</th>
                    </tr>
               </thead>
               <tbody>
                    ${rows}
               </tbody>
          </table>
     `;
}

export default calculateSAW;
