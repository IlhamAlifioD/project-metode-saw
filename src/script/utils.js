function calculateSAW(criterionNames, weights, types, alternativeNames, alternatives, fractionDigits) {
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

     const normalizationTable = document.querySelector("#normalization-table");
          normalizationTable.innerHTML = renderNormalizationTable(
               "Tabel Normalisasi",
               criterionNames,
               normalizedAlternatives,
               alternativeNames,
               fractionDigits,
          );

     // ? Perhitungan Skor Hasil Normalisasi
     const finalScores = alternatives.map((_, alternativeIndex) =>
          normalizedAlternatives.reduce((totalScore, criterionValues, criterionIndex) =>
               totalScore + criterionValues[alternativeIndex] * weights[criterionIndex], 0)
     );

     // ? Perangkingan
	const ranked = finalScores
		.map((score, i) => ({ alternative: `${alternativeNames[i]}`, score }))
		.sort((a, b) => b.score - a.score);

     const rankingTable = document.querySelector("#ranking-table");
          rankingTable.innerHTML = renderRankingTable(
               "Tabel Ranking",
               ranked,
               fractionDigits,
          );

     // ? Debugging
     console.log("Tabel Normalisasi:", normalizationTable.innerHTML);
     console.log("Tabel Ranking:", rankingTable.innerHTML);
}

function renderNormalizationTable(title, criterionNames, normalizedAlternatives, alternativeNames, fractionDigits) {
     const headers = criterionNames.map(name => `<th>${name}</th>`).join("");
     const rows = normalizedAlternatives[0].map((_, i) => `
          <tr>
               <td>${alternativeNames[i]}</td>
               ${normalizedAlternatives.map(row => `<td>${row[i].toFixed(fractionDigits)}</td>`).join("")}
          </tr>`
     ).join("");

     return `
          <h2>${title}</h2>
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
          <h2>${title}</h2>
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
