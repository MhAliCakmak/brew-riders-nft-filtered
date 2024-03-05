"use client";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function Home() {
  const [selectedTraits, setSelectedTraits] = useState({});
  const [nfts, setNfts] = useState([]);
  const [allTraits, setAllTraits] = useState({});

  useEffect(() => {
    fetchAllTraits();
    fetchNFTs();
  }, [selectedTraits]);

  const handleCheckboxChange = (traitType, traitValue) => {
    setSelectedTraits((prevTraits) => ({
      ...prevTraits,
      [traitType]: prevTraits[traitType]?.includes(traitValue)
        ? prevTraits[traitType].filter((value) => value !== traitValue)
        : [...(prevTraits[traitType] || []), traitValue],
    }));
  };

  const fetchAllTraits = async () => {
    try {
      const response = await fetch("/api/countAllTraits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const apiResponse = await response.json();
      setAllTraits(apiResponse.traitsCount);
    } catch (error) {
      console.error(
        "An error occurred while fetching all traits:",
        error.message
      );
    }
  };

  const fetchNFTs = async () => {
    try {
      const response = await fetch("/api/getNFTsByTraits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ traits: selectedTraits }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const apiResponse = await response.json();

      // API yanıtındaki uygun alana göre nfts'i ayarlayın
      const nftsFromApi = apiResponse.data || apiResponse;

      setNfts(nftsFromApi);
    } catch (error) {
      console.error(
        "An error occurred while fetching the NFTs:",
        error.message
      );
    }
  };

  return (
    <div
      style={{
        display: "flex",
        maxWidth: "1200px",
        margin: "auto",
        padding: "20px",
      }}
    >
      {/* Sidebar */}
      <div style={{ flex: "0 0 25%", marginRight: "20px" }}>
        <h2>Kategoriler</h2>
        {Object.entries(allTraits).map(([traitType, traitValues]) => (
          <div key={traitType} style={{ marginBottom: "10px" }}>
            <strong>{traitType}:</strong>
            <div style={{ marginTop: "5px" }}>
              {traitValues.map((traitValue) => (
                <span
                  key={traitValue}
                  style={{ display: "block", marginBottom: "5px" }}
                >
                  <input
                    type="checkbox"
                    value={traitValue}
                    checked={selectedTraits[traitType]?.includes(traitValue)}
                    onChange={() => handleCheckboxChange(traitType, traitValue)}
                  />
                  {traitValue}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* NFT Listesi */}
      <div style={{ flex: "1" }}>
        <div style={{ marginBottom: "20px" }}>
          <h1>NFT Traits Filter</h1>
          <p>Filter NFTs based on traits</p>
        </div>

        {Array.isArray(nfts) && nfts.length > 0 ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "20px",
            }}
          >
            {nfts.map((nft, index) => (
              <div
                key={index}
                style={{
                  border: "1px solid #ccc",
                  padding: "10px",
                  marginBottom: "10px",
                }}
              >
                <img
                  src={nft.pngUrl}
                  alt={nft.metadata.name}
                  
                  style={{ maxWidth: "100%", marginBottom: "10px" }}
                  loading="lazy"
                />

                <p>
                  <strong>Name:</strong> {nft.metadata.name}
                </p>
                <p>
                  <strong>Attributes:</strong>
                  <ul>
                    {nft.metadata.attributes.map((attr, index) => (
                      <li key={index}>
                        {attr.trait_type}: {attr.value}
                      </li>
                    ))}
                  </ul>
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p>No NFTs found.</p>
        )}
      </div>
    </div>
  );
}
