import React, { createContext, useContext, useState, useEffect } from "react";

import { IMetadataRaw } from "../../../models/mongoose_models/MetadataCardSchema";
import { sendHTTPRequest } from "../AppUtilities";

const MetadataContext = createContext({
  metadata: null as IMetadataRaw | null,
});

export const useMetadata = () => useContext(MetadataContext);

export default function MetadataProvider({
  children,
  endpoint,
}: {
  children: React.ReactNode;
  endpoint: "/read-public-metadata" | "/read-metadata";
}) {
  const [metadata, setMetadata] = useState<IMetadataRaw | null>(null);

  // Load the metadata once (note empty dependency array) after the initial
  // render.
  useEffect(() => {
    sendHTTPRequest("POST", endpoint, {}).then(
      (metadataDocs: IMetadataRaw[] | null) => {
        if (!metadataDocs) return;

        if (metadataDocs.length > 0) {
          setMetadata(metadataDocs[0]);
        }
      }
    );
  }, []);

  return (
    <MetadataContext.Provider value={{ metadata }}>
      {children}
    </MetadataContext.Provider>
  );
}
