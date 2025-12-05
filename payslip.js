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
const MIN_ZOOM = 0.3;
const MAX_ZOOM = 1.5;

async function exportToPDF() {
  const btn = document.getElementById("downloadBtn");
  const btnText = document.getElementById("btnText");
  const originalContent = btnText.innerHTML;
  btn.disabled = true;
  btnText.innerHTML = '<span class="spinner"></span> Generating...';

  if (!window.jspdf) {
    alert("jsPDF library not loaded.");
    btn.disabled = false;
    btnText.innerHTML = originalContent;
    return;
  }

  const { jsPDF } = window.jspdf;
  const element = document.getElementById("payrollSlip");

  try {
    // Clone the element to capture it without UI interference (zoom, margins, etc.)
    const clone = element.cloneNode(true);

    // Style the clone to be wider for better layout (like a desktop view)
    // 1000px provides a good "desktop-like" layout that scales down nicely to A4
    const virtualWidth = 1000;
    // Calculate min-height to maintain A4 aspect ratio (1.414)
    const virtualMinHeight = Math.ceil(virtualWidth * (297 / 210));

    clone.style.width = `${virtualWidth}px`;
    clone.style.minHeight = `${virtualMinHeight}px`;
    clone.style.height = "auto"; // Allow it to grow if content is long
    clone.style.transform = "none";
    clone.style.margin = "0";
    clone.style.padding = "40px"; // Restore comfortable padding for the larger layout
    clone.style.position = "absolute";
    clone.style.left = "-9999px";
    clone.style.top = "0";
    clone.style.backgroundColor = "white";
    clone.classList.remove("paper-shadow"); // Remove shadow for clean capture

    // Ensure the content div has appropriate padding
    const contentDiv = clone.querySelector(".flex-1");
    if (contentDiv) {
      // Reset any specific padding overrides to ensure consistent spacing
      contentDiv.classList.remove("p-6");
      contentDiv.classList.add("p-10");
    }

    document.body.appendChild(clone);

    const canvas = await html2canvas(clone, {
      scale: 2, // High resolution
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
      width: virtualWidth,
      windowWidth: virtualWidth,
      height: clone.scrollHeight,
      windowHeight: clone.scrollHeight,
    });

    document.body.removeChild(clone);

    const imgData = canvas.toDataURL("image/png");
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pdfWidth = doc.internal.pageSize.getWidth();
    const pdfHeight = doc.internal.pageSize.getHeight();
    const imgProps = doc.getImageProperties(imgData);
    const imgRatio = imgProps.width / imgProps.height;

    // Calculate dimensions to fit the page width first
    let finalWidth = pdfWidth;
    let finalHeight = finalWidth / imgRatio;

    // If fitting to width makes it taller than the page, we must scale down to fit height
    // This ensures 1-page fit.
    if (finalHeight > pdfHeight) {
      finalHeight = pdfHeight;
      finalWidth = finalHeight * imgRatio;
    }

    // Center horizontally
    const x = (pdfWidth - finalWidth) / 2;

    // Align top (y=0)
    const y = 0;

    doc.addImage(imgData, "PNG", x, y, finalWidth, finalHeight);
    const empName = document.getElementById("empName").value || "Employee";
    doc.save(`Payslip_${empName}.pdf`);
  } catch (error) {
    console.error(error);
    alert("Error generating PDF.");
  } finally {
    btn.disabled = false;
    btnText.innerHTML = originalContent;
  }
}

function zoomIn() {
  if (currentZoom < MAX_ZOOM) {
    currentZoom = Math.min(currentZoom + 0.1, MAX_ZOOM);
    applyZoom();
  }
}

function zoomOut() {
  if (currentZoom > MIN_ZOOM) {
    currentZoom = Math.max(currentZoom - 0.1, MIN_ZOOM);
    applyZoom();
  }
}

function resetZoom() {
  const container = document.getElementById("previewContainer");
  const slip = document.getElementById("payrollSlip");
  if (!container || !slip) return;

  const containerWidth = container.clientWidth - 80;
  const containerHeight = container.clientHeight - 80;
  const slipWidth = 794;
  const slipHeight = 1123;

  const scaleX = containerWidth / slipWidth;
  const scaleY = containerHeight / slipHeight;
  currentZoom = Math.min(scaleX, scaleY, 1);
  applyZoom();
}

function applyZoom() {
  const wrapper = document.getElementById("previewWrapper");
  const zoomLabel = document.getElementById("zoomLevel");

  if (wrapper) {
    wrapper.style.transform = `scale(${currentZoom})`;
  }
  if (zoomLabel) {
    zoomLabel.textContent = `${Math.round(currentZoom * 100)}%`;
  }
}

window.addEventListener("load", () => {
  setTimeout(resetZoom, 100);
});

window.addEventListener("resize", () => {
  resetZoom();
});
