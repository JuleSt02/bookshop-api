import { app } from "./api";

import { environmentService } from "./infrastructure/EnvironmentService";

environmentService.load();

const PORT = environmentService.get().PORT;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
