import dotenv from 'dotenv';

import { CONFIG } from './config';
import { FlexSDK } from './sdk';
import { MoveFunctionId, InputGenerateTransactionPayloadData } from '@aptos-labs/ts-sdk';
dotenv.config();
// Specify which network to connect to via AptosConfig

const privateKey = process.env.NFT_PRIVATE_KEY || '';

const sdk = new FlexSDK(CONFIG['Bardock Testnet'], privateKey);
console.log(`use this address: ${sdk.address}`);

// mint nft
const contractAddress = "0x5bdfce8fd01a132fc3c68e7f4a2086146c34da70428efcfc3b56d075fbace38e";

//1. purchase token
const data = {
    function:
        `${contractAddress}::token_collection_aggregate::purchase_token` as MoveFunctionId,
    functionArguments: [],
    typeArguments: [],
} as InputGenerateTransactionPayloadData;

// Chain promises instead of using top-level await
sdk.aptosClient.transaction.build.simple({
    sender: sdk.address,
    data: data,
})
    .then(transaction => {
        return sdk.poolModule.signAndSubmitTransaction(sdk.aptosClient, sdk.account, transaction);
    })
    .then(console.log)
    .catch(error => {
        console.error("Error:", error);
    });




// 2. Function to fetch owned tokens via GraphQL
async function fetchOwnedTokens(userAddress: string, offset = 0, limit = 10) {
    const url = 'https://indexer.testnet.movementnetwork.xyz/v1/graphql/';

    const query = `
    query getOwnedTokens($where_condition: current_token_ownerships_v2_bool_exp!, $offset: Int, $limit: Int, $order_by: [current_token_ownerships_v2_order_by!]) {
      current_token_ownerships_v2(
        where: $where_condition
        offset: $offset
        limit: $limit
        order_by: $order_by
      ) {
        ...CurrentTokenOwnershipFields
      }
    }
    
    fragment CurrentTokenOwnershipFields on current_token_ownerships_v2 {
      token_standard
      token_properties_mutated_v1
      token_data_id
      table_type_v1
      storage_id
      property_version_v1
      owner_address
      last_transaction_version
      last_transaction_timestamp
      is_soulbound_v2
      is_fungible_v2
      amount
      current_token_data {
        collection_id
        description
        is_fungible_v2
        largest_property_version_v1
        last_transaction_timestamp
        last_transaction_version
        maximum
        supply
        token_data_id
        token_name
        token_properties
        token_standard
        token_uri
        current_collection {
          collection_id
          collection_name
          creator_address
          current_supply
          description
          last_transaction_timestamp
          last_transaction_version
          max_supply
          mutable_description
          mutable_uri
          table_handle_v1
          token_standard
          total_minted_v2
          uri
        }
      }
    }
    `;

    const variables = {
        where_condition: {
            owner_address: { _eq: userAddress }
        },
        offset,
        limit,
        order_by: [{ last_transaction_timestamp: "desc" }]
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query,
                variables
            })
        });

        if (!response.ok) {
            throw new Error(`GraphQL request failed with status ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching owned tokens:', error);
        throw error;
    }
}

// Define interface for token ownership
interface TokenOwnership {
    token_data_id: string;
    current_token_data?: {
        token_name?: string;
        [key: string]: any;
    };
    [key: string]: any;
}

// Example usage (as a promise chain to avoid top-level await)
fetchOwnedTokens(sdk.address)
    .then(data => {
        const tokenOwnerships = data?.data?.current_token_ownerships_v2 || [];
        const mysteriousBoxTokens = tokenOwnerships
            .filter((token: TokenOwnership) => token.current_token_data?.token_name?.includes('MysteriousBox'))
            .map((token: TokenOwnership) => token.token_data_id);
        console.log('Mysterious Box Token IDs:', mysteriousBoxTokens);
    })
    .catch(error => {
        console.error('Failed to fetch owned tokens:', error);
    });

