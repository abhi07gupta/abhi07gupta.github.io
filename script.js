document.getElementById("year").textContent = String(new Date().getFullYear());

const copyButton = document.getElementById("copy-email");
const copyStatus = document.getElementById("copy-status");
const emailAddress = document.getElementById("email-address").textContent.trim();

async function copyEmailAddress() {
  copyStatus.classList.remove("error");
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(emailAddress);
    } else {
      const field = document.createElement("textarea");
      field.value = emailAddress;
      field.setAttribute("readonly", "");
      field.style.position = "fixed";
      field.style.opacity = "0";
      document.body.appendChild(field);
      field.select();
      const copied = document.execCommand("copy");
      field.remove();
      if (!copied) throw new Error("Copy command was unavailable");
    }
    copyStatus.textContent = "Email address copied. Paste it into your preferred email service.";
    copyButton.textContent = "Email copied";
  } catch {
    copyStatus.textContent = `Copy was blocked by the browser. Please use ${emailAddress}.`;
    copyStatus.classList.add("error");
  }
}

copyButton.addEventListener("click", copyEmailAddress);
