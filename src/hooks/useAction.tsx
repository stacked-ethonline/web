import { useLogs } from "@/context/logs.context";
import { LOG_TYPE } from "@/lib/constants";
import {getEmbeddedConnectedWallet, usePrivy, useWallets} from "@privy-io/react-auth";
import { submitAction } from "../api/api";
import { useMruInfo } from "./useMruInfo";

export const useAction = () => {
  const { signTypedData } = usePrivy();
  const { wallets } = useWallets()
  const { mruInfo } = useMruInfo();
  const { addLog } = useLogs();

  const submit = async (name: string, payload: any) => {
    const wallet = getEmbeddedConnectedWallet(wallets);
    if (!mruInfo || !wallet) {
      return;
    }
    const inputs = { ...payload };
    const { transitionToSchema, domain, schemas } = mruInfo;
    const msgSender = wallet.address;

    console.log(msgSender)
    const schemaName = transitionToSchema[name];
    const schema = schemas[schemaName];

    const signature = await signTypedData({
      domain,
      types: schema.types,
      primaryType: schema.primaryType,
      message: inputs,
    });

    addLog({
      type: LOG_TYPE.REQUEST,
      time: Date.now(),
      value: {
        transitionName: name,
        payload: { inputs, msgSender, signature },
      },
    });

    try {
      const response = await submitAction(name, {
        msgSender,
        signature,
        inputs,
      });

      addLog({
        type: LOG_TYPE.C0_RESPONSE,
        time: Date.now(),
        value: { acknowledgementHash: response.ackHash },
      });
      addLog({
        type: LOG_TYPE.C1_RESPONSE,
        time: Date.now(),
        value: { logs: response.logs },
      });

      return response;
    } catch (e) {
      addLog({
        type: LOG_TYPE.ERROR,
        time: Date.now(),
        value: { message: (e as Error).message },
      });
      throw e;
    }
  };

  return { submit };
};
