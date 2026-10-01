import React from "react";
import { useLocation } from "react-router-dom";

interface IllustrationRow {
  policyYear: number;
  premium: number;
  sumAssured?: number;
  bonusRate?: number;
  bonusAmount: number;
  fundValue?: number;
  deathBenefit?: number;
  totalBenefit: number;
  netCashflows: number;
}

export const Illustration: React.FC = () => {
  const location = useLocation();

  const savedData: IllustrationRow[] = React.useMemo(() => {
    if (location.state?.illustrationData) {
      return location.state.illustrationData;
    }
    try {
      const stored = localStorage.getItem("illustration");
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error("Failed to parse localStorage data", e);
      return [];
    }
  }, [location.state]);

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header & Overview Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Policy Illustration Summary
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Year-by-year financial breakdown of premiums, bonuses, and projected
            cash flows.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
            Term: {savedData.length} Years
          </span>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50/80 uppercase text-xs tracking-wider text-gray-500 font-semibold">
              <tr>
                <th scope="col" className="px-6 py-4 text-left">
                  Year
                </th>
                <th scope="col" className="px-6 py-4 text-right">
                  Premium
                </th>
                <th scope="col" className="px-6 py-4 text-right">
                  Sum Assured
                </th>
                <th scope="col" className="px-6 py-4 text-right">
                  Bonus Rate
                </th>
                <th scope="col" className="px-6 py-4 text-right">
                  Bonus Amount
                </th>
                <th scope="col" className="px-6 py-4 text-right">
                  Total Benefit
                </th>
                <th scope="col" className="px-6 py-4 text-right">
                  Net Cashflow
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 bg-white">
              {savedData.length > 0 ? (
                savedData.map((row) => {
                  const isPositiveCashflow = row.netCashflows > 0;
                  const isNegativeCashflow = row.netCashflows < 0;

                  return (
                    <tr
                      key={row.policyYear}
                      className="hover:bg-blue-50/40 transition-colors duration-150"
                    >
                      {/* Policy Year */}
                      <td className="px-6 py-4 font-semibold text-gray-900 whitespace-nowrap">
                        Year {row.policyYear}
                      </td>

                      {/* Premium */}
                      <td className="px-6 py-4 text-right text-gray-700 font-medium whitespace-nowrap">
                        ₹{(row.premium ?? 0).toLocaleString("en-IN")}
                      </td>

                      {/* Sum Assured */}
                      <td className="px-6 py-4 text-right text-gray-700 font-medium whitespace-nowrap">
                        ₹{(row.sumAssured ?? 0).toLocaleString("en-IN")}
                      </td>

                      {/* Bonus Rate */}
                      <td className="px-6 py-4 text-right text-gray-600 whitespace-nowrap">
                        {((row.bonusRate ?? 0) * 100).toFixed(1)}%
                      </td>

                      {/* Bonus Amount */}
                      <td className="px-6 py-4 text-right text-gray-700 font-medium whitespace-nowrap">
                        ₹{(row.bonusAmount ?? 0).toLocaleString("en-IN")}
                      </td>

                      {/* Total Benefit */}
                      <td className="px-6 py-4 text-right font-semibold text-emerald-600 whitespace-nowrap">
                        ₹{(row.totalBenefit ?? 0).toLocaleString("en-IN")}
                      </td>

                      {/* Net Cashflow */}
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <span
                          className={`inline-flex items-center justify-end px-2.5 py-1 rounded-md text-xs font-semibold ${
                            isPositiveCashflow
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : isNegativeCashflow
                                ? "bg-rose-50 text-rose-700 border border-rose-200"
                                : "bg-gray-50 text-gray-600 border border-gray-200"
                          }`}
                        >
                          ₹{(row.netCashflows ?? 0).toLocaleString("en-IN")}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-gray-400 bg-gray-50/50"
                  >
                    No illustration data available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
