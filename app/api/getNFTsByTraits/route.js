import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const req = await request.json();
    const data = await filterNFT(req.traits);

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 });
  }
}

const nftsData = JSON.parse(fs.readFileSync(path.resolve("./app/nfts.json")));
const filterNFT = async (traits) => {
  try {
    const filteredNFTs = nftsData.filter((nft) => {
      if (nft.raw && nft.raw.metadata && nft.raw.metadata.attributes) {
        return Object.keys(traits).every((traitType) => {
          const traitValues = traits[traitType];
          if (traitValues.length === 0) {
            return true;
          }
          const matchingAttributes = nft.raw.metadata.attributes.filter(
            (attribute) => {
              return (
                attribute &&
                attribute.trait_type &&
                attribute.value &&
                attribute.trait_type.toLowerCase() ===
                  traitType.toLowerCase() &&
                traitValues.includes(attribute.value.toLowerCase()) &&
                attribute.value.trim() !== ""
              );
            }
          );

          return matchingAttributes.length > 0;
        });
      }

      return false;
    });

    return filteredNFTs;
  } catch (error) {
    console.error("Error in filterNFT:", error);
    throw error;
  }
};
