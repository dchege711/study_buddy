import React, { createContext, useContext, useState, useEffect } from "react";

import { IMetadataRaw } from "../../../models/mongoose_models/MetadataCardSchema";
import { MetadataReadParams } from "../../../models/MetadataMongoDB";
import { sendHTTPRequest } from "../AppUtilities";

const MetadataContext = createContext({
  metadata: null as IMetadataRaw | null,
});

export const useMetadata = () => useContext(MetadataContext);

export default function MetadataProvider({
  children,
  payload,
  endpoint,
}: {
  children: React.ReactNode;
  payload: Partial<MetadataReadParams>;
  endpoint: string;
}) {
  const [metadata, setMetadata] = useState<IMetadataRaw | null>(null);

  // Load the metadata once (note empty dependency array) after the initial
  // render.
  useEffect(() => {
    sendHTTPRequest("POST", endpoint, payload).then(
      (metadataDocs: IMetadataRaw[]) => {
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
