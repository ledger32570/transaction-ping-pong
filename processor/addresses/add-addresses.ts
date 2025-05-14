import axios from "axios";
import { AGENT_LIST } from "../../agent-list";
import { getAccessToken } from "../../api";
import {
  createApiResponseSuccess,
  handleApiResponseError,
} from "../../api/utils";
import {
  ADDRESS_MANAGEMENT_API_CLIENT_ID,
  ADDRESS_MANAGEMENT_API_CLIENT_SECRET,
  PALISADE_API_GATEWAY_URI,
} from "../../config";

export const addAgentAddressesToCounterparty = async (): Promise<any> => {
  const counterpartyId = "0196c4a3-76ab-7976-947e-7c5b84c2d95a";
  let count = 0;

  console.log("Adding agent addresses to counterparty...", AGENT_LIST.length);

  for (const agent of AGENT_LIST) {
    count++;
    const authResponse = await getAccessToken(
      ADDRESS_MANAGEMENT_API_CLIENT_ID as string,
      ADDRESS_MANAGEMENT_API_CLIENT_SECRET as string
    );

    const data = {
      termsAndConditionsAccepted: true,
      details: {
        name: `Agent ${count}`,
        address: agent,
        blockchains: ["XRP_LEDGER"],
      },
    };

    if (authResponse.success) {
      console.log("Data to be sent:", data);

      const postAddressResponse = await axios(
        `${PALISADE_API_GATEWAY_URI}/v2/counterparties/${counterpartyId}/addresses`,
        {
          method: "POST",
          data: {
            termsAndConditionsAccepted: true,
            details: {
              type: "EXTERNAL",
              externalAddress: {
                name: `Agent ${count}`,
                address: agent,
                blockchains: ["XRP_LEDGER"],
              },
            },
          },
          headers: {
            Authorization: `Bearer ${authResponse.data.accessToken}`,
          },
        }
      )
        .then((response) => createApiResponseSuccess(response.data))
        .catch(handleApiResponseError);

      if (postAddressResponse.success) {
        console.log(`Agent ${count} w. address ${agent} added successfully.`);
      } else {
        console.log(`Agent ${count} w. address ${agent} failed to be added.`);
        console.error(postAddressResponse.status, postAddressResponse.message);
      }
    }
  }
};
