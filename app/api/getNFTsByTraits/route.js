import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const req = await request.json();
    const data = await filterNFT(req.traits, req.page, req.limit);

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 });
  }
}

const nftsData = JSON.parse(fs.readFileSync(path.resolve("./app/nftsV3.json")));
const filterNFT = async (traits, page = 1, limit = 20) => {
  try {
    const filteredNFTs = [];
    let count = 0;

    for (const nft of nftsData) {
      if (nft.metadata && nft.metadata.attributes) {
        const isMatch = Object.keys(traits).every((traitType) => {
          const traitValues = traits[traitType];
          if (traitValues.length === 0) {
            return true;
          }
          const matchingAttributes = nft.metadata.attributes.filter(
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

        if (isMatch) {
          count++;
          if (count > (page - 1) * limit && count <= page * limit) {
            filteredNFTs.push(nft);
          }

          if (count > page * limit) {
            break;
          }
        }
      }
    }

    return filteredNFTs;
  } catch (error) {
    console.error("Error in filterNFT:", error);
    throw error;
  }
};