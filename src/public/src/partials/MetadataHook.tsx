import React, { createContext, useContext, useState, useEffect } from "react";

import { IMetadataRaw } from "../../../models/mongoose_models/MetadataCardSchema";
import { MetadataReadParams } from "../../../models/MetadataMongoDB";
import { sendHTTPRequest } from "../AppUtilities";
import { useUser } from "./UserHook";

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
  const { user } = useUser();

  // Load the metadata once (note empty dependency array) after the initial
  // render.
  useEffect(() => {
    let payload: Partial<MetadataReadParams>;
    if (endpoint === "/read-metadata") {
      if (!user) {
        return;
      }
      payload = { userIDInApp: user.userIDInApp };
    } else if (endpoint === "/read-public-metadata") {
      payload = {};
    } else {
      throw new Error("Invalid endpoint");
    }

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
