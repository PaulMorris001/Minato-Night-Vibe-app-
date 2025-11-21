import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

console.log("🔍 Testing MongoDB Connection...\n");

const testConnection = async () => {
  try {
    console.log("Connection String:", process.env.MONGO_URI.replace(/:[^:@]+@/, ':****@'));

    console.log("\n⏳ Attempting to connect...");

    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log("✅ SUCCESS! Connected to MongoDB Atlas");
    console.log(`📊 Database: ${mongoose.connection.name}`);
    console.log(`🌐 Host: ${mongoose.connection.host}`);

    // List collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`\n📁 Collections (${collections.length}):`);
    collections.forEach(col => console.log(`   - ${col.name}`));

    await mongoose.disconnect();
    console.log("\n✅ Test completed successfully!");
    process.exit(0);

  } catch (error) {
    console.error("\n❌ CONNECTION FAILED!");
    console.error("Error Code:", error.code);
    console.error("Error Message:", error.message);

    console.error("\n🔧 Troubleshooting:");

    if (error.code === 'ECONNREFUSED') {
      console.error("\n📡 DNS Resolution Failed");
      console.error("Possible causes:");
      console.error("  1. No internet connection");
      console.error("  2. DNS issues");
      console.error("  3. Firewall blocking MongoDB Atlas");
      console.error("\nTry:");
      console.error("  • Check your internet connection");
      console.error("  • Try: ping atlas-sql.mongodb.com");
      console.error("  • Restart your router/wifi");
    }

    if (error.message.includes('authentication failed')) {
      console.error("\n🔐 Authentication Failed");
      console.error("  • Check username and password in connection string");
      console.error("  • Special characters must be URL encoded");
    }

    if (error.message.includes('IP') || error.message.includes('whitelist')) {
      console.error("\n🔒 IP Whitelist Issue");
      console.error("  • Go to MongoDB Atlas → Network Access");
      console.error("  • Add IP: 0.0.0.0/0 (allow all) for testing");
    }

    console.error("\n💡 Quick Fix Steps:");
    console.error("  1. Visit: https://cloud.mongodb.com");
    console.error("  2. Go to: Security → Network Access");
    console.error("  3. Click: Add IP Address");
    console.error("  4. Select: Allow Access from Anywhere (0.0.0.0/0)");
    console.error("  5. Check if cluster is PAUSED - click Resume if needed");

    process.exit(1);
  }
};

testConnection();
