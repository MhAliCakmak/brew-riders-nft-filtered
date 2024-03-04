// /pages/api/countAllTraits.js
import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const traitsCount = countAllTraits();
    return NextResponse.json({ traitsCount }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 });
  }
}

const countAllTraits = () => {
  const nftsData = JSON.parse(fs.readFileSync(path.resolve('./app/api/nfts.json')));
  const traitsCount = {};

  nftsData.forEach((nft) => {
    if (nft.raw && nft.raw.metadata && nft.raw.metadata.attributes) {
      nft.raw.metadata.attributes.forEach((attribute) => {
        const traitType = attribute.trait_type.toLowerCase();
        const traitValue = attribute.value.toLowerCase();

        if (!traitsCount[traitType]) {
          traitsCount[traitType] = [];
        }

        if (!traitsCount[traitType].includes(traitValue)) {
          traitsCount[traitType].push(traitValue);
        }
      });
    }
  });

  return traitsCount;
};
