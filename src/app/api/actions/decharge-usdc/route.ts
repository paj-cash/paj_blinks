import {
  ActionPostResponse,
  createPostResponse,
  ActionGetResponse,
  ActionPostRequest,
  createActionHeaders,
} from "@solana/actions";
import {
  clusterApiUrl,
  Connection,
  PublicKey,
  Transaction,
} from "@solana/web3.js";
import * as splToken from "@solana/spl-token";
import { NextResponse } from "next/server";
import axios from "axios";

const SOLANA_MAINNET_USDC_PUBKEY =
  "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";
const headers = createActionHeaders();

export const GET = async (req: Request) => {
  try {
    const requestUrl = new URL(req.url);
    const { toPubkey } = validatedQueryParams(requestUrl);

    const baseHref = new URL(
      `/api/actions/decharge-usdc?to=${toPubkey.toBase58()}`,
      requestUrl.origin
    ).toString();

    const payload: ActionGetResponse = {
      type: "action",
      title: "1 DeCharge Mini - 90 USDC",
      icon: "https://res.cloudinary.com/dtfvdjvyr/image/upload/v1730126416/photo_2024-10-28_15.37.46_vb03ds.jpg",
      description:
        "The DeCharge Mini is a smart, compact EV charger designed to offer effortless, reliable charging for EVs. Perfect for homes, businesses, cafes - almost anywhere!",
      label: "Buy for $90",
      links: {
        actions: [
          {
            label: "Deploy Now",
            href: `${baseHref}&amount=90&email={email}`,
            parameters: [
              {
                name: "email",
                label: "Enter Email Address",
                type: "email",
              },
            ],
          },
        ],
      },
    };

    return Response.json(payload, {
      headers,
    });
  } catch (err) {
    console.log(err);
    let message = "An unknown error occurred";
    if (typeof err == "string") message = err;
    return new Response(message, {
      status: 400,
      headers,
    });
  }
};

export const OPTIONS = GET;

export const POST = async (req: Request) => {
  try {
    const requestUrl = new URL(req.url);
    const { amount, toPubkey, email } = validatedQueryParams(requestUrl);

    const body: ActionPostRequest = await req.json();

    let account: PublicKey;
    try {
      account = new PublicKey(body.account);
    } catch (err) {
      return new Response('Invalid "account" provided', {
        status: 400,
        headers,
      });
    }

    // Send email and wallet data to API
    try {
      const response = await axios.post(
        "https://rechrg.one/v1/ps/order/create",
        JSON.stringify({
          email: email,
          wallet_id: "GeWJUMvrCWahZxy3JNyrHQ5CATxCscGB8J4xcFudPRFi",
          transaction_id: "12345ABC",
          purchase_quantity: 1,
          amount: 1,
          price: amount,
          token: "SOL",
          status: "PENDING",
          name: "Test User",
          country: "INDIA",
          total_amount: 200,
          total_amount_after_discount: 1,
          voucher_code: "",
          is_sphere: false,
          // Update the comment to include email and wallet_id
          comment: `Purchase from DeCharge BLINK - Email: ${email}, Wallet ID: ${account.toString()}`,
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Successfully sent to API");
      console.log("Server response:", response.data); // Log the server response
    } catch (error) {
      console.error("Error sending data to API:", error);
    }

    const connection = new Connection(clusterApiUrl("mainnet-beta"));
    const decimals = 6;
    const mintAddress = new PublicKey(SOLANA_MAINNET_USDC_PUBKEY);

    let transferAmount: any = parseFloat(amount.toString());
    transferAmount = transferAmount.toFixed(decimals);
    transferAmount = transferAmount * Math.pow(10, decimals);

    const fromTokenAccount = await splToken.getAssociatedTokenAddress(
      mintAddress,
      account,
      false,
      splToken.TOKEN_PROGRAM_ID,
      splToken.ASSOCIATED_TOKEN_PROGRAM_ID
    );

    let toTokenAccount = await splToken.getAssociatedTokenAddress(
      mintAddress,
      toPubkey,
      true,
      splToken.TOKEN_PROGRAM_ID,
      splToken.ASSOCIATED_TOKEN_PROGRAM_ID
    );

    const ifexists = await connection.getAccountInfo(toTokenAccount);

    let instructions = [];

    if (!ifexists || !ifexists.data) {
      let createATAiX = splToken.createAssociatedTokenAccountInstruction(
        account,
        toTokenAccount,
        toPubkey,
        mintAddress,
        splToken.TOKEN_PROGRAM_ID,
        splToken.ASSOCIATED_TOKEN_PROGRAM_ID
      );
      instructions.push(createATAiX);
    }

    let transferInstruction = splToken.createTransferInstruction(
      fromTokenAccount,
      toTokenAccount,
      account,
      transferAmount
    );
    instructions.push(transferInstruction);

    const transaction = new Transaction();
    transaction.feePayer = account;
    transaction.add(...instructions);
    transaction.recentBlockhash = (
      await connection.getLatestBlockhash()
    ).blockhash;

    const payload: ActionPostResponse = await createPostResponse({
      fields: {
        transaction,
        message: `Transaction created successfully`,
      },
    });

    return Response.json(payload, {
      headers,
    });
  } catch (err) {
    console.log(err);
    let message = "An unknown error occurred";
    if (typeof err == "string") message = err;
    return new Response(message, {
      status: 400,
      headers,
    });
  }
};

function validatedQueryParams(requestUrl: URL) {
  let toPubkey: PublicKey = new PublicKey(
    "FjBbqZykDaGYH5xurYN4sN78d2EyrwY7FzBFVDkTy2i2"
  );
  let amount: number = 1;
  let email: string = "";

  // try {
  //   if (requestUrl.searchParams.get("to")) {
  //     toPubkey = new PublicKey(requestUrl.searchParams.get("to")!);
  //   }
  // } catch (err) {
  //   throw "Invalid input query parameter: to";
  // }

  try {
    if (requestUrl.searchParams.get("email")) {
      email = requestUrl.searchParams.get("email")!;
      if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        throw "Invalid email format";
      }
    }
  } catch (err) {
    throw "Invalid input query parameter: email";
  }

  return {
    amount,
    toPubkey,
    email,
  };
}
