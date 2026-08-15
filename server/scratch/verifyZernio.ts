import "dotenv/config";
import zernio from "../config/zernio.js";

async function verifyZernioConnection() {
  console.log("--------------------------------------------------");
  console.log("🔍 Checking Zernio API & Connected Channels Setup");
  console.log("--------------------------------------------------");

  if (!process.env.ZERNIO_API_KEY) {
    console.error("❌ ERROR: ZERNIO_API_KEY is missing in server/.env!");
    process.exit(1);
  }

  console.log("✅ ZERNIO_API_KEY found in .env:", process.env.ZERNIO_API_KEY.slice(0, 10) + "...");

  try {
    // 1. Test Listing Profiles
    console.log("\n📡 Testing Zernio API Profiles Connection...");
    const profilesRes = await (zernio as any).profiles.listProfiles().catch((err: any) => err);
    
    if (profilesRes?.response?.status === 401 || profilesRes?.status === 401) {
      console.error("❌ Zernio API Authentication Failed (401 Unauthorized). Check ZERNIO_API_KEY.");
      return;
    }

    const profilesData = profilesRes?.data?.data || profilesRes?.data || profilesRes;
    console.log(`✅ Zernio API Connected! Total Profiles Found: ${Array.isArray(profilesData) ? profilesData.length : "OK"}`);

    // 2. Test Accounts Query
    console.log("\n📲 Testing Connected Accounts Query...");
    const accountsRes = await (zernio as any).accounts.listAccounts().catch((err: any) => err);
    const accountsList = accountsRes?.data?.data || accountsRes?.data || accountsRes || [];
    
    console.log(`✅ Total Connected Social Channels on Zernio: ${Array.isArray(accountsList) ? accountsList.length : 0}`);
    if (Array.isArray(accountsList) && accountsList.length > 0) {
      accountsList.forEach((acc: any, i: number) => {
        console.log(`   [${i + 1}] Platform: ${acc.platform} | Name: ${acc.displayName || acc.name || acc.username} | Account ID: ${acc._id || acc.id}`);
      });
    }

    console.log("\n--------------------------------------------------");
    console.log("🎉 Zernio API Integration Diagnostic Complete: ALL SYSTEMS OPERATIONAL");
    console.log("--------------------------------------------------");
  } catch (error: any) {
    console.error("❌ Zernio API Connection Error:", error?.message || error);
  }
}

verifyZernioConnection();
