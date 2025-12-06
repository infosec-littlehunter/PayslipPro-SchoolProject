lucide.createIcons();
document.getElementById("previewDate").innerText =
  new Date().toLocaleDateString("en-GB");

function updatePreview() {
  // 1. Get Values
  const company = document.getElementById("companyName").value;
  const rate =
    parseFloat(document.getElementById("exchangeRate").value) || 4100;
  const useNssf = document.getElementById("nssfToggle").value === "yes";

  const name = document.getElementById("empName").value;
  const id = document.getElementById("empId").value;
  const pos = document.getElementById("empPosition").value;
  const dept = document.getElementById("empDept").value;
  const nssfNo = document.getElementById("nssfNumber").value;
  const dependents =
    parseInt(document.getElementById("numDependents").value) || 0;

  // Payment & Attendance
  const bankName = document.getElementById("bankName").value;
  const bankAcc = document.getElementById("bankAcc").value;
  const workDays = document.getElementById("workDays").value;
  const leaveDays = document.getElementById("leaveDays").value;

  // Financials
  const base = parseFloat(document.getElementById("baseSalary").value) || 0;
  const bonus = parseFloat(document.getElementById("bonus").value) || 0;
  const seniority = parseFloat(document.getElementById("seniority").value) || 0;

  const otHours = parseFloat(document.getElementById("otHours").value) || 0;
  const otMulti = parseFloat(document.getElementById("otRate").value) || 1.5;
  const otherDed = parseFloat(document.getElementById("deduction").value) || 0;

  // 2. Earnings Calculations
  const hourlyRate = base / 208; // 26 days * 8 hours standard
  const otPay = otHours * hourlyRate * otMulti;
  const totalEarnings = base + bonus + seniority + otPay;

  // 3. NSSF Logic (Pension 2% - Capped)
  // Cap base usually 1.2M KHR => Max ded ~24,000 KHR (~$6)
  let nssfUSD = 0;
  if (useNssf) {
    // Determine NSSF Base: Usually excludes Seniority Indemnity.
    // We use (Base + Bonus + OT) for NSSF Base here to be safe.
    const nssfBaseUSD = base + bonus + otPay;
    const nssfBaseKHR = nssfBaseUSD * rate;
    const maxNssfKHR = 24000;
    const nssfKHR = Math.min(Math.max(nssfBaseKHR, 0) * 0.02, maxNssfKHR);
    nssfUSD = nssfKHR / rate;
  }

  // 4. Tax Calculation (Tax Base = Gross - Exemptions - NSSF - Dependents)
  // EXEMPTION: Seniority Indemnity is tax exempt.
  // We pass (totalEarnings - seniority) as the taxable base candidate
  const taxableGrossUSD = totalEarnings - seniority;
  const taxUSD = calculateCambodiaTax(
    taxableGrossUSD,
    nssfUSD,
    dependents,
    rate
  );

  // 5. Net Pay
  const totalDeductions = nssfUSD + taxUSD + otherDed;
  const net = totalEarnings - totalDeductions;

  // 6. DOM Updates
  document.getElementById("previewCompany").innerText =
    company || "Your Company Name";
  document.getElementById("previewExRate").innerText = rate;

  // Employee Info
  document.getElementById("previewName").innerText = name || "---";
  document.getElementById("previewId").innerText = id || "---";
  document.getElementById("previewPosition").innerText = pos || "---";
  document.getElementById("previewDept").innerText = dept || "---";

  // Bank/Att Info
  document.getElementById("previewBank").innerText = bankName || "---";
  document.getElementById("previewAcc").innerText = bankAcc || "---";
  document.getElementById("previewNssfNo").innerText = nssfNo || "---";
  document.getElementById("previewWork").innerText = workDays || "0";
  document.getElementById("previewLeave").innerText = leaveDays || "0";

  // Earnings Column
  document.getElementById("previewBase").innerText = formatCurrency(base);
  document.getElementById("previewBonus").innerText = formatCurrency(bonus);
  document.getElementById("previewSeniority").innerText =
    formatCurrency(seniority);
  document.getElementById("previewOt").innerText = formatCurrency(otPay);
  document.getElementById("previewOtDetail").innerText = `(${otHours}h)`;
  document.getElementById("previewTotalEarnings").innerText =
    formatCurrency(totalEarnings);

  // Deductions Column
  document.getElementById("previewNssf").innerText = formatCurrency(nssfUSD);
  document.getElementById("previewTax").innerText = formatCurrency(taxUSD);
  document.getElementById(
    "previewTaxDetail"
  ).innerText = `(Dep: ${dependents})`;
  document.getElementById("previewDeduction").innerText =
    formatCurrency(otherDed);
  document.getElementById("previewTotalDeductions").innerText =
    formatCurrency(totalDeductions);

  // Totals & Words
  document.getElementById("previewNet").innerText = formatCurrency(net);
  document.getElementById("previewNetKhr").innerText = formatKHR(net * rate);
  document.getElementById("amountInWords").innerText =
    convertNumberToWords(net) + " US Dollars Only";
}

// Logic Helpers
function calculateCambodiaTax(taxableGrossUSD, nssfUSD, children, rate) {
  const CHILD_ALLOWANCE_KHR = 150000;
  const grossKHR = taxableGrossUSD * rate;
  const nssfKHR = nssfUSD * rate;

  let taxableBaseKHR = grossKHR - nssfKHR - children * CHILD_ALLOWANCE_KHR;
  if (taxableBaseKHR < 0) taxableBaseKHR = 0;

  let taxKHR = 0;
  // 2025 Progressive Brackets (Instruction 002 MEF)
  if (taxableBaseKHR <= 1500000) taxKHR = 0;
  else if (taxableBaseKHR <= 2000000)
    taxKHR = (taxableBaseKHR - 1500000) * 0.05;
  else if (taxableBaseKHR <= 8500000)
    taxKHR = (taxableBaseKHR - 2000000) * 0.1 + 25000;
  else if (taxableBaseKHR <= 12500000)
    taxKHR = (taxableBaseKHR - 8500000) * 0.15 + 675000;
  else taxKHR = (taxableBaseKHR - 12500000) * 0.2 + 1275000;

  return taxKHR / rate;
}

function formatCurrency(amount) {
  return (
    "$" +
    amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
}

function formatKHR(amount) {
  return Math.round(amount).toLocaleString("en-US") + " ៛";
}

// Improved Number to Words (Supports Millions)
function convertNumberToWords(amount) {
  const num = Math.floor(amount);
  if (num === 0) return "Zero";

  const a = [
    "",
    "One ",
    "Two ",
    "Three ",
    "Four ",
    "Five ",
    "Six ",
    "Seven ",
    "Eight ",
    "Nine ",
    "Ten ",
    "Eleven ",
    "Twelve ",
    "Thirteen ",
    "Fourteen ",
    "Fifteen ",
    "Sixteen ",
    "Seventeen ",
    "Eighteen ",
    "Nineteen ",
  ];
  const b = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  const regex = /^(\d{1,2})(\d{2})$/;

  const getHundreds = (n) => {
    let str = "";
    if (n > 99) {
      str += a[Math.floor(n / 100)] + "Hundred ";
      n %= 100;
    }
    if (n > 0) {
      if (n < 20) {
        str += a[n];
      } else {
        str += b[Math.floor(n / 10)] + " ";
        if (n % 10 > 0) str += a[n % 10];
      }
    }
    return str;
  };

  let words = "";

  // Millions
  if (num >= 1000000) {
    words += getHundreds(Math.floor(num / 1000000)) + "Million ";
  }
  // Thousands
  const thousands = Math.floor((num % 1000000) / 1000);
  if (thousands > 0) {
    words += getHundreds(thousands) + "Thousand ";
  }
  // Hundreds
  const hundreds = num % 1000;
  if (hundreds > 0) {
    words += getHundreds(hundreds);
  }

  return words.trim();
}

let currentZoom = 1;


function switchTab(tab) {
  const formPanel = document.getElementById("formPanel");
  const previewPanel = document.getElementById("previewPanel");
  const tabEdit = document.getElementById("tabEdit");
  const tabPreview = document.getElementById("tabPreview");

  if (tab === "edit") {
    formPanel.classList.remove("hidden");
    previewPanel.classList.add("hidden");
    previewPanel.classList.remove("flex");

    // Update Tab Styles
    tabEdit.classList.add("text-blue-600", "border-t-2", "border-blue-600");
    tabEdit.classList.remove("text-gray-500");
    tabPreview.classList.remove(
      "text-blue-600",
      "border-t-2",
      "border-blue-600"
    );
    tabPreview.classList.add("text-gray-500");
  } else {
    formPanel.classList.add("hidden");
    previewPanel.classList.remove("hidden");
    previewPanel.classList.add("flex");

    // Update Tab Styles
    tabPreview.classList.add("text-blue-600", "border-t-2", "border-blue-600");
    tabPreview.classList.remove("text-gray-500");
    tabEdit.classList.remove("text-blue-600", "border-t-2", "border-blue-600");
    tabEdit.classList.add("text-gray-500");

    // Trigger resize/zoom
    setTimeout(resetZoom, 50);
  }
}

function resetZoom() {
  const container = document.getElementById("previewContainer");
  const slip = document.getElementById("payrollSlip");
  if (!container || !slip) return;

  // On mobile, we might want less padding
  const isMobile = window.innerWidth < 1024;
  const padding = isMobile ? 20 : 80;

  const containerWidth = container.clientWidth - padding;
  const containerHeight = container.clientHeight - padding;
  const slipWidth = 794;
  const slipHeight = 1123;

  const scaleX = containerWidth / slipWidth;

  if (isMobile) {
    // On mobile, fit to width, ignore height (allow scrolling)
    currentZoom = Math.min(scaleX, 1);
  } else {
    const scaleY = containerHeight / slipHeight;
    currentZoom = Math.min(scaleX, scaleY, 1);
  }

  applyZoom();
}

function applyZoom() {
  const wrapper = document.getElementById("previewWrapper");

  if (wrapper) {
    wrapper.style.transform = `scale(${currentZoom})`;
  }
}

window.addEventListener("load", () => {
  setTimeout(resetZoom, 100);
});

window.addEventListener("resize", () => {
  resetZoom();
});
