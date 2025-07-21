const instanceName = "alloy";
window.__alloyNS = [instanceName];
document.addEventListener(`alloy:${instanceName}:ready`, async () => {
  console.log("Alloy is ready!");
  const alloy = window[instanceName];
  await alloy("configure", {
    datastreamId: "929ad39c",
    orgId: "92aed92f@AdobeOrg",
  });
});
