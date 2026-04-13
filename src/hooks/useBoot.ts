import { useEffect } from "react";

import { initializeOfflineQueue } from "@/lib/offline/queue";

export function useBoot() {
  useEffect(() => {
    initializeOfflineQueue();
  }, []);
}
