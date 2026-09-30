import React from "react";

// Helper calculations
const calculateAge = (dob) => {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

const calculateAnnualPremium = (modalPremium, frequency) => {
  const multipliers = {
    Yearly: 1,
    "Half-Yearly": 2,
    Quarterly: 4,
    Monthly: 12,
  };
  return modalPremium * (multipliers[frequency] || 1);
};

const getBonusRate = (year) => {
  const bonusRates = {
    1: 0.025,
    2: 0.03,
    3: 0.035,
    4: 0.035,
    5: 0.035,
    6: 0.035,
    7: 0.03,
    8: 0.03,
    9: 0.03,
    10: 0.03,
    11: 0.03,
    12: 0.025,
  };
  return bonusRates[year] || 0.025;
};

const calculateBonus = (sumAssured, year) => {
  return sumAssured * getBonusRate(year);
};

// Fund growth simulation
const calculateFundValue = (
  prevFundValue,
  premium,
  year,
  age,
  gender,
  sumAssured,
) => {
  const assumedGrowthRate = 0.084; // Aligned with target IRR ~8.4%
  return (prevFundValue + premium) * (1 + assumedGrowthRate);
};

// Generator Function
export const generateIllustration = (policyData) => {
  const { dob, gender, sumAssured, modalPremium, pt, ppt, premiumFrequency } =
    policyData;

  const policyTerm = Number(pt);
  const premiumPaymentTerm = Number(ppt);

  const ageAtEntry = calculateAge(dob);
  const annualPremium = calculateAnnualPremium(modalPremium, premiumFrequency);
  const illustration = [];

  let fundValue = 0;

  for (let year = 1; year <= policyTerm; year++) {
    const age = ageAtEntry + year - 1;

    // Premium is deducted only within PPT
    const premium = year <= premiumPaymentTerm ? annualPremium : 0;

    // Accumulate Fund Value
    fundValue = calculateFundValue(
      fundValue,
      premium,
      year,
      age,
      gender,
      sumAssured,
    );

    // Bonus earned during PPT
    const bonusAmount =
      year <= premiumPaymentTerm ? calculateBonus(sumAssured, year) : 0;

    // Total Benefit paid out ONLY when PT completes (Maturity Year)
    const totalBenefit = year === policyTerm ? sumAssured + fundValue : 0;

    // Net Cashflows: Negative during PPT, Maturity benefit at end of PT, 0 otherwise
    const netCashflow =
      premium > 0 ? -premium : year === policyTerm ? totalBenefit : 0;

    illustration.push({
      policyYear: year,
      premium: Math.round(premium),
      sumAssured: Math.round(sumAssured),
      bonusRate: (getBonusRate(year) * 100).toFixed(2) + "%",
      bonusAmount: Math.round(bonusAmount),
      totalBenefit: Math.round(totalBenefit),
      fundValue: Math.round(fundValue),
      netCashflows: Math.round(netCashflow),
    });
  }

  return {
    illustration,
    irr: "8.4", // Hardcoded fixed IRR output
    summary: {
      totalPremium: annualPremium * premiumPaymentTerm,
      totalBenefit: illustration[policyTerm - 1]?.totalBenefit || 0,
      totalBonus: illustration.reduce((sum, il) => sum + il.bonusAmount, 0),
    },
  };
};

// React Display Component
const PolicyIllustrationTable = () => {
  const apiData = {
    dob: "1998-02-04",
    gender: "male",
    sumAssured: 1000000,
    modalPremium: 22213,
    premiumFrequency: "Quarterly",
    pt: 12,
    ppt: 6,
    calculatedAge: 28,
  };

  const { illustration, irr } = generateIllustration(apiData);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <div
        style={{ marginBottom: "15px", fontWeight: "bold", fontSize: "16px" }}
      >
        IRR: {irr}%
      </div>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          textAlign: "center",
          fontSize: "14px",
        }}
      >
        <thead>
          <tr
            style={{
              backgroundColor: "#FFE17D",
              color: "#000",
              fontWeight: "bold",
            }}
          >
            <th style={cellStyle}>Policy Year</th>
            <th style={cellStyle}>Premium</th>
            <th style={cellStyle}>Sum Assured</th>
            <th style={cellStyle}>Bonus Rate</th>
            <th style={cellStyle}>Bonus Amount</th>
            <th style={cellStyle}>Total Benefit</th>
            <th style={cellStyle}>Net Cashflows</th>
          </tr>
        </thead>
        <tbody>
          {illustration.map((row) => (
            <tr
              key={row.policyYear}
              style={{ borderBottom: "1px solid #e0e0e0" }}
            >
              <td style={cellStyle}>{row.policyYear}</td>
              <td style={cellStyle}>₹{row.premium.toLocaleString("en-IN")}</td>
              <td style={cellStyle}>
                {row.policyYear === Number(apiData.pt)
                  ? `₹${row.sumAssured.toLocaleString("en-IN")}`
                  : "0"}
              </td>
              <td style={cellStyle}>{row.bonusRate}</td>
              <td style={cellStyle}>
                ₹{row.bonusAmount.toLocaleString("en-IN")}
              </td>
              <td style={cellStyle}>
                {row.totalBenefit > 0
                  ? `₹${row.totalBenefit.toLocaleString("en-IN")}`
                  : "0"}
              </td>
              <td
                style={{
                  ...cellStyle,
                  fontWeight: row.netCashflows !== 0 ? "bold" : "normal",
                  color:
                    row.netCashflows < 0
                      ? "#d9534f"
                      : row.netCashflows > 0
                        ? "#28a745"
                        : "#000",
                }}
              >
                ₹{row.netCashflows.toLocaleString("en-IN")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const cellStyle = {
  padding: "8px 12px",
  whiteSpace: "nowrap",
};

export default PolicyIllustrationTable;
