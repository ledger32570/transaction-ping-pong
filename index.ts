import dotenv from "dotenv";
import "./api/interceptor";
import { initInterceptor } from "./api/interceptor";
import { startProcessing } from "./processor";

dotenv.config();

const main = async () => {
  console.log("Starting Palisade Signer...");

  // Cron job to refresh access token every 15 seconds
  // cron.schedule("*/60 * * * * *", async () => {
  //   await startProcessing();
  // });

  initInterceptor();
  // addAgentAddressesToCounterparty();
  startProcessing();
};

main();
